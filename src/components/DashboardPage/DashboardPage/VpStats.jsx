import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
const VpStats = ({ filter }) => {
  console.log("-----", JSON.stringify(filter));
  const [VPstatsData, setVPstatsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelData, setCancelData] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [vuCountData, setVuCountData] = useState({});


  // Fetch Route Count Stats
  // useEffect(() => {
  //   const fetchRouteCounts = async () => {
  //     try {
  //       const obj = {
  //         sDate: filter.sDate,
  //         eDate: filter.eDate,
  //         locationid: filter?.locationid || 1, // Use dynamic locationid
  //         facilityid: filter?.facilityid || null,
  //         vendorid: filter?.vendorid || null,
  //         triptype: filter?.triptype || null,
  //       };
  //       console.log("Filter object sent to API:", obj);
  //       const res = await apiService.get_VProutecount(obj);

  //       console.log("VP Route Count Data ------- X ---------", res);
  //       let data = [];
  //       if (Array.isArray(res)) {
  //         data = res;
  //       } else if (typeof res === "string") {
  //         try {
  //           data = JSON.parse(res);
  //         } catch (e) {
  //           data = [];
  //         }
  //       }
  //       console.log("Parsed data:", data);
  //       if (Array.isArray(data) && data.length > 0) {
  //         setVPstatsData(data[0]);
  //       } else {
  //         setVPstatsData({});
  //       }
  //     } catch (err) {
  //       console.error("Route Count Error", err);
  //       setVPstatsData({});
  //     }
  //   };
  //   fetchRouteCounts();
  // }, [filter]);
  // Fetch Route Count Stats
  // Fetch Route Count Stats
  
  useEffect(() => {
    const fetchGetChart_VUcount = async () => {
      try {
        const obj = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: filter.locationid || "", // selCity
          facilityid: filter?.facilityid || "", // selFacility
          vendorid: filter?.vendorid ||  "", // selVendor
          triptype: filter?.triptype || "", // selectedTripType
        };
        //  console.log("quest GetChart_VUcount Request Object:", obj); // Debu
        const res = await apiService.GetChart_VUcount(obj);
        console.log("Route Count Data for Running late ", res);
        let data = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (typeof res === "string") {
          try {
            data = JSON.parse(res);
          } catch (e) {
            data = [];
          }
        }
        if (Array.isArray(data) && data.length > 0) {
          setVuCountData(data[0]);
        } else {
          setVuCountData({});
        }
      } catch (err) {
        console.error("Route Count Error", err);
        setVuCountData({});
      }
    };
    fetchGetChart_VUcount();
  }, [filter]);

  useEffect(() => {
    const fetchRouteCount = async () => {
      try {
        const obj = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: filter.locationid || "", // selCity
          facilityid: filter?.facilityid || "", // selFacility
          vendorid: filter?.vendorid || "", // selVendor
          triptype: filter?.triptype || "", // selectedTripType
        };
        const res = await apiService.Getchart_RouteCount(obj);
        //console.log("Route Count Data", res);
        let data = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (typeof res === "string") {
          try {
            data = JSON.parse(res);
          } catch (e) {
            data = [];
          }
        }
        if (Array.isArray(data) && data.length > 0) {
          setStatsData(data[0]);
        } else {
          setStatsData({});
        }
      } catch (err) {
        console.error("Route Count Error", err);
        setStatsData({});
      }
    };
    fetchRouteCount();
  }, [filter]);

  useEffect(() => {
    const fetchCancelData = async () => {
      try {
        const credentials = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: 1, // selCity
          facilityid: filter?.facilityid || "", // selFacility
          vendorid: filter?.vendorid || "", // selVendor
          triptype: filter?.triptype || "", // selectedTripType
        };

        const response = await apiService.getchart_CancelReallocation(
          credentials
        );

        let parsed = [];

        // Handle stringified JSON response
        if (typeof response === "string") {
          try {
            parsed = JSON.parse(response);
            //console.log("Parsed string response:", parsed);
          } catch (e) {
            console.error("Failed to parse string response:", e);
            setCancelData(null);
            return;
          }
        } else {
          parsed = response;
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          setCancelData(parsed[0]);
        } else {
          setCancelData(null);
        }
      } catch (error) {
        console.error("API Error:", error);
        setCancelData(null);
      }
    };

    fetchCancelData();
  }, [filter]);
  useEffect(() => {
    const fetchRouteCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        // API call with filter object
        const res = await apiService.get_VProutecount({
          sDate: filter.sDate,
          eDate: filter.eDate,
          locationid: filter?.locationid || 1,
          facilityid: filter?.facilityid || null,
          vendorid: filter?.vendorid || null,
          triptype: filter?.triptype || null,
        });

        // Response handle
        let data = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (typeof res === "string") {
          try {
            data = JSON.parse(res);
          } catch (e) {
            data = [];
          }
        }
        if (Array.isArray(data) && data.length > 0) {
          setVPstatsData(data[0]);
        } else if (typeof res === "object" && res !== null) {
          setVPstatsData(res); // In case API returns object directly
        } else {
          setVPstatsData({});
        }
      } catch (err) {
        setError("API Error");
        setVPstatsData({});
      }
      setLoading(false);
    };
    fetchRouteCounts();
  }, [filter]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  return (
    <>
      <div className="col-12">
        <div className="cardNew w-100 p-2">
          <ul className="">
            {/* <li style={{display:"none"}}>
              <h3>
                <strong>{statsData.totalroute || 0}</strong>
              </h3>
              <span className="subtitle_sm">Total Trips</span>
            
            </li> */}
            {/* <li style={{display:"none"}}>
              <h3>
                <strong>{statsData.totalemployee || 0}</strong>
              </h3>
              <span className="subtitle_sm">Employees</span>
            </li> */}
            {/* <li style={{display:"none"}}>
              <h3>
                <strong>{vuCountData.OntimePer || 0}%</strong>
              </h3>
              <span className="subtitle_sm">On Time Performance</span>
             
            </li> */}
            {/* <li >
              <h3>
                <strong>{vuCountData.VehRunningLate || 0}</strong>
              </h3>
              <span className="subtitle_sm">Vehicles Running Late</span>
             
            </li> */}
            <li>
              <h3>
                <strong>{statsData.guardCount || 0}</strong>
              </h3>
              <span className="subtitle_sm">Escorted trips</span>
            </li>
            <li>
              <h3>
                <strong>{vuCountData.SeatUtilizationPer || 0}%</strong>
              </h3>
              <span className="subtitle_sm">Seat Utilisation</span>
            </li>
            <li>
              {/* <span className="overline_text">Daily Refusal Rate is 1.5%</span> */}
              <h3>
                <strong>{cancelData.TripRejectedcount || 0}</strong>
              </h3>
              <span className="subtitle_sm">Trips Rejected by Drivers</span>
            </li>
            <li>
              {/* <span className="overline_text">Daily Refusal Rate is 2%</span> */}
              <h3>
                <strong>{cancelData.Triprefusalcount || 0}</strong>
              </h3>
              <span className="subtitle_sm">Trips Refused by Vendor</span>
            </li>


          </ul>
        </div>
      </div>
      {/* <div className="col-12 mt-3">
        <div className="cardNew w-100 p-2">
          <ul className="">
            <li>
              <h3>
                <strong>3,042</strong>
              </h3>
              <span className="subtitle_sm">Trips</span>
            </li>
            
            
            <li>
              <h3>
                <strong>{VPstatsData.B2BPer || 'N/A'}</strong>
              </h3>
              <span className="subtitle_sm">Back To Back Trips</span>
            </li>
            
            <li>
              <h3>
                <strong>{VPstatsData.OTAcount || "N/A"}</strong>
              </h3>
              <span className="subtitle_sm">On time arrival</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-12 mt-3">
        <div className="cardNew w-100 p-2">
          <ul className="">
            <li>
              <span className="overline_text">Percentage of total {VPstatsData.PickupPer || 'N/A'}%</span>
              <h3>
                <strong>{VPstatsData.totalpickup  || 'N/A'}</strong>
              </h3>
              <span className="subtitle_sm">Pick Trips</span>
            </li>
            <li>
              <span className="overline_text">Percentage of total {VPstatsData.DropPer || 'N/A'}%</span>
              <h3>
                <strong>{VPstatsData.totaldrop  || 'N/A'}</strong>
              </h3>
              <span className="subtitle_sm">Drop Trips</span>
            </li>
            
            
            <li>
              <span className="overline_text"></span>
              <h3>
                <strong>23,604</strong>
              </h3>
              <span className="subtitle_sm">Total Ratings</span>
            </li>
          </ul>
        </div>
      </div> */}
    </>
  );
};

export default VpStats;
