import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import ManageRouteService from "../services/compliance/ManageRouteService";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";

// Helper function for retrying failed requests with an async function
const retryAsync = async (asyncFn, args, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await asyncFn(args);
    } catch (error) {
      lastError = error;
      console.error(`Request failed (attempt ${i + 1}/${maxRetries}):`, error);
      if (i < maxRetries - 1) {
        console.log(`Retrying in ${delay}ms (attempt ${i + 2}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
      }
    }
  }
  throw lastError;
};

// Helper function to parse URL query parameters
const getQueryParams = () => {
  const search = window.location.search.substring(1);
  const params = {};

  search.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value !== undefined) {
      params[key] = decodeURIComponent(value);
    }
  });

  return params;
};



const colors = [
  "#4285F4", "#EA4335", "#FBBC05", "#34A853", "#A142F4", "#F44292", "#00B8D9",
  "#FF6D01", "#46BDC6", "#FFB300", "#8E24AA", "#43A047", "#F4511E", "#3949AB",
  "#757575", "#C0CA33", "#D81B60", "#00897B", "#6D4C41", "#7E57C2"
];

function getCircleIconWithText(text, color = "#4285F4", textColor = "#fff") {
  const svg = `
    <svg width="36" height="36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="${color}" stroke="#fff" stroke-width="2"/>
      <text x="18" y="23" text-anchor="middle" font-size="16" font-family="Inter,Arial,sans-serif" fill="${textColor}" font-weight="bold">${text}</text>
    </svg>
  `;
  return "data:image/svg+xml;base64," + btoa(svg);
}

function FitToPolyline({ geometry }) {
  const map = useMap();
  useEffect(() => {
    if (!geometry) return;
    try {
      const coords = polyline.decode(geometry).map(coord => [coord[0], coord[1]]);
      if (coords.length > 1) {
        map.fitBounds(coords, { padding: [40, 40] });
      } else if (coords.length === 1) {
        map.setView(coords[0], 15);
      }
    } catch { }
  }, [geometry, map]);
  return null;
}

// Loading spinner component
const LoadingSpinner = () => (
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #4285F4',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 2s linear infinite',
        marginBottom: '16px',
      }} />
      <p style={{ fontWeight: 500, color: '#4285F4' }}>Loading route details...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

export default function OffcanvasRouteDetails({ show, onClose, routeId }) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [queryParams, setQueryParams] = useState({});

  const [Mapsidebar, setMapsidebar] = useState(true);

  // Initialize query parameters from URL
  useEffect(() => {
    const params = getQueryParams();
    setQueryParams(params);
    console.log("Offcanvas query parameters:", params);
  }, []);

  useEffect(() => {
    if (!show || !routeId) return;

    setLoading(true);
    setMapReady(false);
    setError(null);

    (async () => {
      try {
        // Build API parameters from URL query params with fallbacks
        const apiParams = {
          sDate: queryParams.sDate || '',
          eDate: queryParams.sDate || '',  // Use same date for both
          FacilityID: queryParams.FacilityID,
          TripType: queryParams.TripType,
          Shifttimes: queryParams.Shifttimes,
          OrderBy: 'Colony',  // Keep OrderBy fixed
          Direction: queryParams.Direction || 'ASC',
          Routeid: routeId,   // Use the routeId from props
          occ_seater: -2      // Keep occ_seater fixed
        };

        console.log("Offcanvas API parameters:", apiParams);

        // Fetch route info using ManageRouteService with retry
        const routeResponse = await retryAsync(
          ManageRouteService.GetRoutesByOrder,
          apiParams
        );
        console.log("Route response:", routeResponse);
        // Parse response if needed
        let routeData = typeof routeResponse === 'string' ? JSON.parse(routeResponse) : routeResponse;
        if (typeof routeData === 'string') routeData = JSON.parse(routeData);

        if (!Array.isArray(routeData) || !routeData[0]) throw new Error('No route found');
        const routeInfo = routeData[0];

        // Fetch details and geometry using Promise.all with service methods and retry
        const [details, geometry] = await Promise.all([
          retryAsync(
            ManageRouteService.GetRoutesDetailsnew,
            {
              RouteID: routeId,
              isAdd: 0
            }
          ),
          retryAsync(
            ManageRouteService.Get_RouteGeometry,
            {
              RouteID: routeId
            }
          )
        ]);

        // Parse details if needed
        let parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
        if (typeof parsedDetails === 'string') parsedDetails = JSON.parse(parsedDetails);

        // Parse geometry if needed
        let parsedGeometry = typeof geometry === 'string' ? JSON.parse(geometry) : geometry;
        if (typeof parsedGeometry === 'string') parsedGeometry = JSON.parse(parsedGeometry);

        if (Array.isArray(parsedGeometry) && parsedGeometry.length > 0) {
          parsedGeometry = parsedGeometry[0];
        }

        console.log("Details data:", parsedDetails);

        // Set the route with all data
        setRoute({
          ...routeInfo,
          stops: parsedDetails,
          geometry: parsedGeometry.geometry,
          facility: {
            facilityGeoX: parsedDetails[0]?.facGeoX,
            facilityGeoY: parsedDetails[0]?.facGeoY
          }
        });

        // Small delay to ensure the map has time to initialize
        setTimeout(() => {
          setLoading(false);
          // We'll set mapReady to true after a short delay to ensure the map has time to render
          setTimeout(() => {
            setMapReady(true);
          }, 800);
        }, 500);
      } catch (err) {
        console.error("Error fetching route data:", err);
        setError(err.message);
        setLoading(false);
      }
    })();

    // Cleanup function - reset states when offcanvas is closed
    return () => {
      if (!show) {
        setRoute(null);
        setError(null);
        setMapReady(false);
      }
    };
  }, [show, routeId, queryParams]); // Add queryParams as a dependency

  if (!show) return null;

  // Compute a valid center for the map
  let mapCenter = [22.5937, 78.9629];
  if (route && route.stops && route.stops.length) {
    const lat = parseFloat(route.stops[0].locationY);
    const lng = parseFloat(route.stops[0].locationX);
    if (!isNaN(lat) && !isNaN(lng)) {
      mapCenter = [lat, lng];
    }
  }

  return (

   


    <div style={{
      position: 'fixed', top: 0, right: 0, width: "50vw", height: '100vh', background: '#fff', zIndex: 2000,
      boxShadow: '-2px 0 16px rgba(0,0,0,0.15)', padding: 0, transition: 'transform 0.3s',
      transform: show ? 'translateX(0)' : 'translateX(100%)', overflow: 'hidden', display: 'flex', flexDirection: 'row'
    }} className="blur_shadow">

      {/* Map as background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} className="">
        <div className="d-flex justify-content-between" style={{ position: 'absolute', top: '0', zIndex: '9999', background: '#000', width: '100%', padding: '26px 27px', fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
          <div >Route Map</div>
          <a href="#!" className="text-white" onClick={onClose}><span class="material-icons">close</span></a>
        </div>
        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
          whenReady={() => {
            // When map is ready, we'll use the timeout set above for full loading
            console.log("Map is ready");
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
          <ZoomControl position="bottomright" />
          {route && route.geometry && <FitToPolyline geometry={route.geometry} />}
          {route && route.geometry && (
            <Polyline
              positions={polyline.decode(route.geometry).map(coord => [coord[0], coord[1]])}
              color={colors[0]}
              weight={5}
              opacity={1}
            />
          )}
          {route && route.stops && route.stops.map((stop, idx) => {
            const lat = parseFloat(stop.locationY);
            const lng = parseFloat(stop.locationX);
            if (!isNaN(lat) && !isNaN(lng)) {
              return (
                <Marker
                  key={idx}
                  position={[lat, lng]}
                  icon={new L.Icon({
                    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=${stop.stopNo}|4285F4|ffffff`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 28],
                    popupAnchor: [0, -28],
                  })}
                >
                  <Popup>
                    <div><b>Stop {stop.stopNo}</b></div>
                    <div>{stop.address}</div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
          {/* Employee Markers */}
          {route && route.stops && route.stops.map((emp, idx) => {
            const lat = parseFloat(emp.GeoY);
            const lng = parseFloat(emp.GeoX);
            if (!isNaN(lat) && !isNaN(lng)) {
              // Determine marker color based on gender
              const markerColor = emp.Gender === 'F' ? "#F44292" : "#4285F4"; // Pink for female, Blue for male
              return (
                <Marker
                  key={`emp-${idx}`}
                  position={[lat, lng]}
                  icon={new L.Icon({
                    iconUrl: getCircleIconWithText(emp.SNo, markerColor, "#fff"),
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    popupAnchor: [0, -28],
                  })}
                >
                  <Popup>
                    <div style={{ minWidth: 20, maxWidth: 260 }}>
                      <div style={{ fontWeight: 600, color: "#3b82f6" }}>
                        Stop <span style={{ background: "#e0e7ff", color: "#3730a3", borderRadius: 6, padding: "2px 8px", fontSize: 13, marginLeft: 4 }}>{emp.stopNo}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#111827", marginBottom: 10, marginTop: 2 }}>
                        {emp.address}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>Emp Code:</span>
                        <span style={{ color: "#0ea5e9", fontSize: 13, fontWeight: 600, marginLeft: 8 }}>{emp.empCode || "-"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>ETA:</span>
                        <span style={{ color: "#0ea5e9", fontSize: 13, fontWeight: 600, marginLeft: 8 }}>{emp.ETA || "-"}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
          {route && route.facility &&
            !isNaN(parseFloat(route.facility.facilityGeoY)) &&
            !isNaN(parseFloat(route.facility.facilityGeoX)) && (
              <Marker
                position={[
                  parseFloat(route.facility.facilityGeoY),
                  parseFloat(route.facility.facilityGeoX),
                ]}
                icon={
                  new L.Icon({
                    iconUrl: "public/images/icons/facility.png",
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    popupAnchor: [0, -36],
                  })
                }
              >
                <Popup><b>Facility</b></Popup>
              </Marker>
            )}
        </MapContainer>
      </div>

      {/* Loading overlay - shown when loading or map is not ready yet */}
      {(loading || !mapReady) && <LoadingSpinner />}

      {/* Error overlay */}
      {error && !loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3,
          padding: '0 32px',
          textAlign: 'center'
        }}>
          <div>


            <div style={{ fontSize: 64, marginBottom: 8 }}>⚠️</div>
            <h3 style={{ color: '#d32f2f', marginBottom: 12 }}>Error Loading Route</h3>
            <p>{error}</p>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 4,
                marginTop: 16,
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Compact floating summary card */}
      {mapReady && route && (
        <div style={{
          position: 'absolute',
          top: 91,
          left: 15,
          zIndex: 3,
          // minWidth: 180,
          // maxWidth: 240,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          fontSize: 15,
        }}>
          {/* <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', zIndex: 4 }}>&times;</button> */}
          <div className="mb-2 d-flex justify-content-between">
            <div>
              {route.varvehicleType === "s" && (
                <img
                  src="images/icons/letter-s.png"
                  alt="Map"
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                  title="Small"
                />
              )}
              {route.varvehicleType === "m" && (
                <img
                  src="images/icons/letter-m.png"
                  alt="Map"
                  style={{ cursor: 'pointer', width: '20px', height: '20px', margin: '0 8px' }}
                  title="Medium"
                />
              )}
              {route.varvehicleType === "l" && (
                <img
                  src="images/icons/letter-l.png"
                  alt="Map"
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                  title="Large"
                />
              )}

            </div>
            <div>
              {route.swapped === true && (
                <img
                  src="images/icons/swap.png"
                  alt="Swap"
                  style={{ cursor: 'pointer', width: '20px', height: '20px', margin: '0 8px' }}
                  title="Swap"
                />
              )}
              {route.PlannedGuard === 1 && (
                <img
                  src="images/icons/add_guard.png"
                  alt="Guard"
                  style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                  title="Guard Required"
                />
              )}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 4 }}>
            <div style={{ background: '#dbeafe', borderRadius: 6, padding: 10, minWidth: 100 }}>
              <div style={{ color: '#475569', fontSize: 8, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Route ID</div>
              <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 600 }}>{route.RouteID}</div>
            </div>
            <div style={{ background: '#dcfce7', borderRadius: 6, padding: 10, minWidth: 100 }}>
              <div style={{ color: '#475569', fontSize: 8, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Distance</div>
              <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 600 }}>{route.totaldist ? `${parseFloat(route.totaldist).toFixed(1)} km` : '—'}</div>
            </div>
            <div style={{ background: '#fef9c3', borderRadius: 6, padding: 10, minWidth: 100 }}>
              <div style={{ color: '#475569', fontSize: 8, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Occupancy</div>
              <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 600 }}>{route.stops ? route.stops.length : '—'}</div>
            </div>
            <div style={{ background: '#fee2e2', borderRadius: 6, padding: 10, minWidth: 100 }}>
              <div style={{ color: '#475569', fontSize: 8, fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Duration</div>
              <div style={{ color: '#1e293b', fontSize: 14, fontWeight: 600 }}>{route.duration ? route.duration : '—'} min</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 