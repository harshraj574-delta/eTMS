import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  LayerGroup,
  useMap,
  ZoomControl
} from "react-leaflet";
import L from "leaflet";
import polylineUtil from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import ManageRouteService from "../services/compliance/ManageRouteService";

// ... (retryAsync, getQueryParams, createColoredMarker, colors, FitMapToRoutes, safeParseJson remain the same) ...

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
        console.log(
          `Retrying in ${delay * (i + 1)}ms (attempt ${i + 2
          }/${maxRetries})...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
      }
    }
  }
  throw lastError;
};

// Helper function to parse URL query parameters
const getQueryParams = () => {
  const search = window.location.search.substring(1);
  const params = {};

  search.split("&").forEach((param) => {
    const [key, value] = param.split("=");
    if (key && value !== undefined) {
      params[key] = decodeURIComponent(value);
    }
  });

  return params;
};

// Helper for colored SVG marker
function createColoredMarker(color, label) {
  const svg = `
    <svg width="28" height="28" viewBox="0 0 28 28" 
         xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <text x="14" y="19" text-anchor="middle" font-size="13" font-family="Inter,Arial,sans-serif" 
            fill="#fff" font-weight="bold">${label || ""}</text>
    </svg>
  `;
  return new L.Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(svg),
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

const colors = [
  "#4285F4",
  "#EA4335",
  "#FBBC05",
  "#34A853",
  "#A142F4",
  "#F44292",
  "#00B8D9",
  "#FF6D01",
  "#46BDC6",
  "#FFB300",
  "#8E24AA",
  "#43A047",
  "#F4511E",
  "#3949AB",
  "#757575",
  "#C0CA33",
  "#D81B60",
  "#00897B",
  "#6D4C41",
  "#7E57C2",
];

// Helper to fit map to all route bounds
function FitMapToRoutes({ routes }) {
  const map = useMap();
  useEffect(() => {
    if (!routes || !routes.length) return;
    let bounds = [];
    routes.forEach((route) => {
      if (route.geometry) {
        try {
          const coords = polylineUtil
            .decode(route.geometry)
            .map((coord) => [coord[0], coord[1]]);
          bounds = bounds.concat(coords);
        } catch (e) {
          console.error("Error decoding polyline for fitBounds:", e);
        }
      }
      if (route.stops) {
        bounds = bounds.concat(
          route.stops.map((stop) => [
            parseFloat(stop.locationY),
            parseFloat(stop.locationX),
          ]),
        );
      }
    });
    if (bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [routes, map]);
  return null;
}

const safeParseJson = (data, fieldName = "response") => {
  let parsedData = data;
  if (typeof parsedData === "string") {
    try {
      parsedData = JSON.parse(parsedData);
    } catch (e) {
      console.error(`Initial JSON.parse failed for ${fieldName}:`, e, data);
      throw new Error(`Invalid JSON string in ${fieldName}`);
    }
  }
  if (typeof parsedData === "string") {
    try {
      parsedData = JSON.parse(parsedData);
    } catch (e) {
      console.warn(
        `Secondary JSON.parse failed for ${fieldName}, using as is:`,
        e,
        parsedData,
      );
    }
  }
  return parsedData;
};

export default function RouteMap() {
  const [allRouteMetas, setAllRouteMetas] = useState([]);
  const [fetchedRoutesData, setFetchedRoutesData] = useState({});
  const [routeVisible, setRouteVisible] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const params = getQueryParams();
    setQueryParams(params);
  }, []);

  const fetchRouteDetailsAndGeometry = useCallback(
    async (routeID, existingRouteMeta) => {
      try {
        const [detailsResponse, geometryResponse] = await Promise.all([
          retryAsync(ManageRouteService.GetRoutesDetailsnew, {
            RouteID: routeID,
            isAdd: 0,
          }),
          retryAsync(ManageRouteService.Get_RouteGeometry, {
            RouteID: routeID,
          }),
        ]);

        const detailsData = safeParseJson(detailsResponse, "details API");
        if (!detailsData || !Array.isArray(detailsData)) {
          throw new Error(
            "Invalid details data structure from GetRoutesDetailsnew",
          );
        }

        let geometryData = safeParseJson(geometryResponse, "geometry API");
        if (Array.isArray(geometryData) && geometryData.length > 0) {
          geometryData = geometryData[0];
        }
        if (!geometryData || !geometryData.geometry) {
          throw new Error(
            "Invalid geometry data structure from Get_RouteGeometry",
          );
        }

        const stops = detailsData.map((emp) => ({
          stopNo: emp.stopNo,
          address: emp.address,
          empCode: emp.empCode,
          eta: emp.ETA,
          locationX: emp.GeoX,
          locationY: emp.GeoY,
        }));

        return {
          routeid: routeID,
          geometry: geometryData.geometry,
          stops, // Actual loaded stops
          totaldist: existingRouteMeta.totaldist,
          duration: existingRouteMeta.duration,
          totalStop: existingRouteMeta.totalStop, // Carry over totalStop from meta
          facility: {
            facilityGeoX: detailsData[0]?.facGeoX,
            facilityGeoY: detailsData[0]?.facGeoY,
          },
        };
      } catch (err) {
        console.error(
          `Error fetching full data for route ${routeID}:`,
          err,
        );
        setError(
          `Failed to load details for route ${routeID}. ${err.message}`,
        );
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    if (
      !queryParams.sDate ||
      !queryParams.FacilityID ||
      !queryParams.TripType
    ) {
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      setAllRouteMetas([]);
      setFetchedRoutesData({});
      setRouteVisible({});
      setShowAll(false);

      try {
        const apiParams = {
          sDate: queryParams.sDate,
          eDate: queryParams.sDate,
          FacilityID: queryParams.FacilityID,
          TripType: queryParams.TripType,
          Shifttimes: queryParams.Shifttimes || "0900",
          OrderBy: "Colony",
          Direction: queryParams.Direction || "ASC",
          Routeid: "",
          occ_seater: -2,
        };

        const routesResponse = await retryAsync(
          ManageRouteService.GetRoutesByOrder,
          apiParams,
        );
        const parsedRoutesMeta = safeParseJson(
          routesResponse,
          "GetRoutesByOrder",
        );

        if (!parsedRoutesMeta || !Array.isArray(parsedRoutesMeta)) {
          throw new Error(
            "Invalid response from GetRoutesByOrder: expected array",
          );
        }
        console.log("All route metas from API:", parsedRoutesMeta);
        // Ensure parsedRoutesMeta has RouteID, totaldist, duration, and totalStop
        setAllRouteMetas(parsedRoutesMeta);

        if (parsedRoutesMeta.length > 0) {
          const firstRouteMeta = parsedRoutesMeta[0];
          const firstRouteFullData = await fetchRouteDetailsAndGeometry(
            firstRouteMeta.RouteID,

            firstRouteMeta,
          );
          if (firstRouteFullData) {
            setFetchedRoutesData((prev) => ({
              ...prev,
              [firstRouteMeta.RouteID]: firstRouteFullData,
            }));
            setRouteVisible({
              [firstRouteMeta.RouteID]: true
            });
          } else {
            setError(`Failed to load data for the first route (${firstRouteMeta.RouteID}).`);
          }
        }
      } catch (err) {
        console.error("Error fetching initial route data:", err);
        setError(err.message || "Error during initial load.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [queryParams, fetchRouteDetailsAndGeometry]);

  const displayRoutes = useMemo(() => {
    return allRouteMetas.map((meta) => {
      const fetchedDetail = fetchedRoutesData[meta.RouteID];
      if (fetchedDetail) {
        // If details are fetched, it already includes totalStop from meta
        return fetchedDetail;
      }
      // For sidebar display before full details are fetched:
      return {
        routeid: meta.RouteID,
        varvehicleType: meta.varvehicleType,
        PlannedGuard: meta.PlannedGuard,
        swapped: meta.swapped,
        totaldist: meta.totaldist,
        duration: meta.duration,
        totalStop: meta.totalStop, // Use totalStop from meta for initial occupancy display
        stops: [], // Placeholder for actual stops
        geometry: null,
        facility: {},
      };
    });
  }, [allRouteMetas, fetchedRoutesData]);

  const routesForMap = useMemo(() => {
    return displayRoutes.filter(
      (route) => routeVisible[route.routeid] && route.geometry,
    );
  }, [displayRoutes, routeVisible]);

  // Summary stats based on *actually loaded* employee stops
  const fullyFetchedRoutesArray = useMemo(
    () => Object.values(fetchedRoutesData),
    [fetchedRoutesData],
  );

  const totalDistance = allRouteMetas.reduce(
    (sum, meta) => sum + (parseFloat(meta.totaldist) || 0),
    0
  );
   
  const totalEmployees = allRouteMetas.reduce(
    (sum, meta) => sum + (parseInt(meta.totalStop, 10) || 0), // Use totalStop from metadata
    0
  );
   
  const avgOccupancy =
    allRouteMetas.length > 0 && totalEmployees > 0
      ? (totalEmployees / allRouteMetas.length).toFixed(1)
      : "0.0";


  const handleToggleAll = async (checked) => {
    setShowAll(checked);
    if (checked) {
      setLoading(true);
      const routesToFetchDetailsFor = allRouteMetas.filter(
        (meta) => !fetchedRoutesData[meta.RouteID],
      );
      const newDetailsPromises = routesToFetchDetailsFor.map((meta) =>
        fetchRouteDetailsAndGeometry(meta.RouteID, meta),
      );
      try {
        const newlyFetchedDetails = await Promise.all(newDetailsPromises);
        const newFetchedDataUpdate = {};
        newlyFetchedDetails.forEach((routeData) => {
          if (routeData) newFetchedDataUpdate[routeData.routeid] = routeData;
        });
        setFetchedRoutesData((prev) => ({ ...prev, ...newFetchedDataUpdate, }));
        const allVisible = {};
        allRouteMetas.forEach((meta) => (allVisible[meta.RouteID] = true));
        setRouteVisible(allVisible);
      } catch (err) {
        setError("Some routes could not be loaded. " + err.message);
        const currentVis = { ...routeVisible };
        allRouteMetas.forEach(meta => {
          if (newFetchedDataUpdate[meta.RouteID]) currentVis[meta.RouteID] = true;
        });
        setRouteVisible(currentVis);
      } finally {
        setLoading(false);
      }
    } else {
      const noneVisible = {};
      allRouteMetas.forEach((meta) => (noneVisible[meta.RouteID] = false));
      setRouteVisible(noneVisible);
    }
  };

  const handleToggleRoute = async (routeid) => {
    const isCurrentlyVisible = !!routeVisible[routeid];
    const makeVisible = !isCurrentlyVisible;
    let operationSuccess = true;

    if (makeVisible && !fetchedRoutesData[routeid]) {
      setLoading(true);
      const routeMeta = allRouteMetas.find((meta) => meta.RouteID === routeid);
      if (routeMeta) {
        const routeFullData = await fetchRouteDetailsAndGeometry(routeid, routeMeta);
        if (routeFullData) {
          setFetchedRoutesData((prev) => ({ ...prev, [routeid]: routeFullData, }));
        } else {
          operationSuccess = false;
        }
      } else {
        operationSuccess = false;
        setError(`Route metadata not found for ${routeid}.`);
      }
      setLoading(false);
    }

    if (operationSuccess) {
      setRouteVisible((prev) => {
        const updated = { ...prev, [routeid]: makeVisible };
        const allAreNowVisible =
          allRouteMetas.length > 0 &&
          allRouteMetas.every((meta) => updated[meta.RouteID]);
        setShowAll(allAreNowVisible);
        return updated;
      });
    }
  };

  // ... (LoadingScreen, ErrorMessage, sidebarStyles components remain the same) ...
  const LoadingScreen = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
      }}
    >
      <div style={{ width: "80px", height: "80px", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "4px solid #e2e8f0",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "60%",
            height: "60%",
            top: "20%",
            left: "20%",
            border: "4px solid #e2e8f0",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite reverse",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#1e293b",
            margin: 0,
          }}
        >
          Loading Routes
        </h2>
        <p style={{ fontSize: "16px", color: "#64748b", margin: 0 }}>
          Please wait while we fetch your route data...
        </p>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  const ErrorMessage = ({ message }) => (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 10000,
        background: "white",
        padding: "16px 20px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        borderLeft: "4px solid #ef4444",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#fee2e2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            fontWeight: "600",
          }}
        >
          !
        </div>
        <div>
          <h3
            style={{
              margin: "0 0 4px 0",
              fontSize: "16px",
              fontWeight: "600",
              color: "#1e293b",
            }}
          >
            Error Loading Routes
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            {message}
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );

  const sidebarStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    .sidebar-react {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1000;
      background: white;
      padding: 12px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-height: calc(100vh - 40px);
      overflow-y: auto;
      width: 300px;
      font-family: 'Inter', sans-serif;
    }
    .summary-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 15px;
    }
    .stat-item {
      background: #f8fafc;
      border-radius: 6px;
      padding: 6px;
      transition: all 0.2s ease;
    }
    .stat-item:nth-child(1) { background: #dbeafe; }
    .stat-item:nth-child(2) { background: #dcfce7; }
    .stat-item:nth-child(3) { background: #fef9c3; }
    .stat-item:nth-child(4) { background: #fee2e2; }
    .stat-label {
      color: #475569;
      font-size: 8px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .stat-value {
      color: #1e293b;
      font-size: 14px;
      font-weight: 600;
    }
    .sidebar-switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      padding: 0 2px;
    }
    .switch-label {
      font-weight: 600;
      color: #1e293b;
      font-size: 15px;
      user-select: none;
    }
    .route-item {
      font-size: 14px;
      padding: 0px;
      margin:0 0 6px 0;
      height: auto;
      width: 100%;
      cursor: pointer;
    }
    .route-summary {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 0px;
      transition: all 0.3s ease;
      color: #1e293b;
      font-size: 12px;
      line-height: 1.2;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .route-summary:hover {
      background: #f3f4f6;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }
    .route-summary.active {
      background-color: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }
    .route-summary .route-name {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .route-summary.active .route-name { color: #fff; }
    .route-summary .route-name img,
    .route-summary.active .route-name img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      filter: none;
    }
    .route-summary.active .route-name img {
      filter: brightness(0) invert(1);
    }
    .route-summary .route-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      font-size: 14px;
      color: #475569;
    }
    .route-summary .route-stats .stat-item {
      background: #f9fafb;
      border-radius: 6px;
      padding: 6px;
      transition: all 0.3s ease;
    }
    .route-summary .route-stats .stat-item:hover {
      background: #f3f4f6;
    }
    .route-summary .route-stats .stat-label {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 8px;
      color: #6b7280;
    }
    .route-summary .route-stats .stat-value {
      font-weight: 700;
      color: #111827;
      transition: color 0.2s;
    }
    .route-summary.active .route-stats .stat-item {
      background: rgba(255,255,255,0.92);
    }
    .route-summary.active .route-stats .stat-label {
      color: #2563eb;
    }
    .route-summary.active .route-stats .stat-value {
      color: #2563eb;
    }
  `;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        fontFamily: "'Inter', sans-serif",
        background: "#f6f8fa",
      }}
    >
      <style>{sidebarStyles}</style>
      {loading && <LoadingScreen />}
      {error && <ErrorMessage message={error} />}
      <div className="sidebar-react">
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-label">Routes</div>
            <div className="stat-value">{allRouteMetas.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Distance</div>
            <div className="stat-value">{totalDistance.toFixed(1)} km</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Employees</div>
            <div className="stat-value">{totalEmployees}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Avg Occupancy</div>
            <div className="stat-value">{avgOccupancy}</div>
          </div>
        </div>
        <div className="sidebar-switch-row">
          <span className="switch-label">Show All Routes</span>
          <label
            className="switch"
            style={{
              position: "relative",
              display: "inline-block",
              width: 44,
              height: 24,
            }}
          >
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => handleToggleAll(e.target.checked)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              className="slider"
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: showAll ? "#3b82f6" : "#e5e7eb",
                transition: ".3s",
                borderRadius: 24,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  content: '""',
                  height: 18,
                  width: 18,
                  left: showAll ? 23 : 3,
                  bottom: 3,
                  backgroundColor: "#fff",
                  transition: ".3s",
                  borderRadius: "50%",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "block",
                }}
              />
            </span>
          </label>
        </div>
        <div id="route-buttons">
          {displayRoutes.map((route, idx) => (
            <div className="route-item" key={route.routeid}>
              <div
                className={`route-summary${routeVisible[route.routeid] ? " active" : ""
                  }`}
                data-routeid={route.routeid}
                style={{
                  borderLeft: `6px solid ${colors[idx % colors.length]}`,
                }}
                onClick={() => handleToggleRoute(route.routeid)}
              >
                <div className="route-name d-flex justify-content-between">
                  <span>Route {route.routeid} </span>
                  <span className="size-sep">
                    {route.varvehicleType === "s" && (
                      <img
                        src="/images/icons/letter-s.png"
                        alt="Small Vehicle"
                        style={{ cursor: 'pointer', width: '20px', height: '20px'}}
                        title="Small"
                      />
                    )}
                    {route.varvehicleType === "m" && (
                      <img
                        src="/images/icons/letter-m.png"
                        alt="Medium Vehicle"
                        style={{ cursor: 'pointer', width: '20px', height: '20px', margin: '0 8px' }}
                        title="Medium"
                      />
                    )}
                    {route.varvehicleType === "l" && (
                      <img
                        src="/images/icons/letter-l.png"
                        alt="Large Vehicle"
                        style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                        title="Large"
                      />
                    )}
                  </span>
                  <span>
                    {route.PlannedGuard === 1 && (
                      <img
                        src="/images/icons/add_guard.png"
                        alt="Guard Required"
                        style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                        title="Guard Required"
                      />
                    )}
                    {route.swapped === "true" && (
                      <img
                        src="/images/icons/swap.png"
                        alt="Swapped Route"
                        style={{
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer'
                        }}
                        title="Swap"
                      />
                    )}
                  </span>
                </div>
                <div className="route-stats">
                  <div className="stat-item">
                    <div className="stat-label">Distance</div>
                    <div className="stat-value">
                      {route.totaldist && !isNaN(parseFloat(route.totaldist))
                        ? `${parseFloat(route.totaldist).toFixed(1)} km`
                        : "—"}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Occupancy</div>
                    <div className="stat-value">
                      {/* Display totalStop (planned occupancy) if available */}
                      {route.totalStop !== undefined && !isNaN(parseInt(route.totalStop, 10))
                        ? `${parseInt(route.totalStop, 10)}`
                        : "—"}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Duration</div>
                    <div className="stat-value">
                      {route.duration && !isNaN(parseInt(route.duration, 10))
                        ? `${parseInt(route.duration, 10)} min`
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MapContainer
        center={[22.5937, 78.9629]}
        zoom={6}
        style={{ height: "100vh", width: "100vw", zIndex: 1 }}
        zoomControl={false}
      // scrollWheelZoom={true}
      >
        <FitMapToRoutes routes={routesForMap} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        <ZoomControl position="bottomright" />
        {routesForMap.map((route) => (
          <LayerGroup key={route.routeid}>
            {route.geometry && (
              <Polyline
                positions={polylineUtil
                  .decode(route.geometry)
                  .map((coord) => [coord[0], coord[1]])}
                color={
                  colors[
                  allRouteMetas.findIndex(
                    (meta) => meta.RouteID === route.routeid,
                  ) % colors.length
                  ]
                }
                weight={5}
                opacity={1}
              />
            )}
            {route.stops &&
              route.stops.map((stop, sidx) => (
                <Marker
                  key={`${route.routeid}-stop-${sidx}`}
                  position={[
                    parseFloat(stop.locationY),
                    parseFloat(stop.locationX),
                  ]}
                  icon={createColoredMarker(
                    colors[
                    allRouteMetas.findIndex(
                      (meta) => meta.RouteID === route.routeid,
                    ) % colors.length
                    ],
                    stop.stopNo,
                  )}
                >
                  <Popup>
                    <div style={{ minWidth: 220, maxWidth: 260 }}>
                      <div style={{ fontWeight: 600, color: "#3b82f6" }}>
                        Stop{" "}
                        <span
                          style={{
                            background: "#e0e7ff",
                            color: "#3730a3",
                            borderRadius: 6,
                            padding: "2px 8px",
                            fontSize: 13,
                            marginLeft: 4,
                          }}
                        >
                          {stop.stopNo}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: "#111827",
                          marginBottom: 10,
                          marginTop: 2,
                        }}
                      >
                        {stop.address}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            color: "#64748b",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          Emp Code:
                        </span>
                        <span
                          style={{
                            color: "#0ea5e9",
                            fontSize: 13,
                            fontWeight: 600,
                            marginLeft: 8,
                          }}
                        >
                          {stop.empCode || "-"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 3,
                        }}
                      >
                        <span
                          style={{
                            color: "#64748b",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          ETA:
                        </span>
                        <span
                          style={{
                            color: "#0ea5e9",
                            fontSize: 13,
                            fontWeight: 600,
                            marginLeft: 8,
                          }}
                        >
                          {stop.eta || "-"}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            {route.facility &&
              route.facility.facilityGeoY &&
              route.facility.facilityGeoX && (
                <Marker
                  key={`${route.routeid}-facility`}
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
                  <Popup>
                    <b>Facility</b>
                  </Popup>
                </Marker>
              )}
          </LayerGroup>
        ))}
      </MapContainer>
    </div>
  );
}
