import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const RiStats = ({ filter }) => {
  // console.log("-----", JSON.stringify(filter));
  const [statsData, setStatsData] = useState({});
  const [cancelData, setCancelData] = useState([]);
  const [vuCountData, setVuCountData] = useState({});


  useEffect(() => {
    const fetchGetChart_VUcount = async () => {
      try {
        const obj = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: filter.locationid || "", // selCity
          facilityid: filter?.facilityid || "", // selFacility
          vendorid: filter?.vendorid || "", // selVendor
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
  // Fetch Route Count Stats
  useEffect(() => {
    const fetchRouteCount = async () => {
      try {
        const obj = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: filter.locationid || null, // selCity
          facilityid: filter?.facilityid || null, // selFacility
          vendorid: filter?.vendorid || null, // selVendor
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

  // Fetch Cancel Reallocation
  useEffect(() => {
    const fetchCancelData = async () => {
      try {
        const credentials = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: 1, // selCity
          facilityid: filter?.facilityid || null, // selFacility
          vendorid: filter?.vendorid || null, // selVendor
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

  // Safely extract and format values for display
  //console.log("thjis ", cancelData);
  const cancellationPer = cancelData?.CancellationPer ?? 0;
  const reallocationPer = cancelData?.reallocationPer ?? 0;
  return (
    <div className="row d-flex align-items-center">
      <div className="col-12 d-flex align-items-center">
        <div className="cardNew w-100">
          <ul className="dashboardStats pt-2 pb-3">
            <li>
              <h3>
                <strong>{statsData.totalroute ?? 0}</strong>
                <span className="subtitle_sm">Routes</span>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                
                
                {statsData.routediffStatus === "down" ? "<FiTrendingUp className="me-1" />" : "<FiTrendingDown className="me-1" />" }
                 {statsData.RouteDiffPer ?? 0}
              </span> */}

              <span
                className={`overline_text d-flex align-items-center ${statsData.routediffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.routediffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.RouteDiffPer ?? 0} %
              </span>

              <span className="overline_text text-warning">
                {statsData.totalemployee ?? 0} Employees
              </span>
              <div className="d-flex justify-content-between align-items-center">
                <span className="badge bg-primary-subtle rounded-pill text-dark my-2 me-2">
                  {statsData.malecount ?? 0} Male
                </span>
                <span className="badge bg-danger-subtle rounded-pill text-dark">
                  {statsData.femalecount ?? 0} Female
                </span>
              </div>
            </li>
            <li>
              <h3>
                <strong>
                  {statsData.AvgOccupancy ?? 0}{" "}
                  <small className="fs-6 text-muted">%</small>
                </strong>
              </h3>
              <span className="subtitle_sm">Avg. Occupany</span>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.AvgOccupancyDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.AvgOccupancyDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.AvgOccupancyDiff ?? 0} %
              </span>
              {/* <span className="overline_text text-warning">
                {statsData.totalvehicle ?? 0} Number of Vehicles
              </span> */}
            </li>
            {/* <li>
              <h3>
                <strong>
                  {`${cancellationPer.toFixed(2)}`}{" "}
                  <small className="fs-6 text-muted">%</small>
                </strong>
              </h3>
              <span className="subtitle_sm">Trip Cancellation</span>
              <span className="overline_text d-flex text-danger align-items-center">
                <FiTrendingDown className="me-1" /> 85%
              </span>
              <span className="overline_text text-success">
                {`${reallocationPer}%`} reallocated
              </span>
            </li> */}

            <li>
              <h3>
                <strong>{statsData.guardCount ?? 0}</strong>
              </h3>
              <span className="subtitle_sm">Guards Deployed</span>
              {/* <span className="overline_text d-flex">
                <span className="text-success me-1">
                  <FiTrendingUp className="me-1" />{" "}
                  {statsData.LastGuardDeployed ?? 0}%
                </span>{" "}
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.gaurddiffstatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.gaurddiffstatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.guarddiffper ?? 0} %
              </span>
              {/* <span className="overline_text text-warning">
                {statsData.GuardDeployed ?? 0} Deployment
              </span> */}
            </li>
            <li>
              <h3>
                <strong>
                  {statsData.OTD ?? 0}{" "}
                  <small className="fs-6 text-muted">%</small>
                </strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span className="subtitle_sm">OTD</span>
              <span
                className={`overline_text d-flex align-items-center ${statsData.OTDDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.OTDDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.OTDDiff ?? 0} %
              </span>

            </li>
            <li>
              <h3>
                <strong>
                  {statsData.OTA ?? 0}{" "}
                  <small className="fs-6 text-muted">%</small>
                </strong>
              </h3>
              <span className="subtitle_sm">OTA</span>
              {/* <span className="overline_text d-flex text-danger align-items-center">
                <FiTrendingDown className="me-1" /> 85%
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.OTADiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.OTADiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.OTADiff ?? 0} %
              </span>

            </li>
            <li>
              <h3>
                <strong>{statsData.totalcompleted ?? 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span className="subtitle_sm">Completed</span>
              <span
                className={`overline_text d-flex align-items-center ${statsData.completedPerDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.completedPerDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.completedPerDiff ?? 0} %
              </span>

            </li>
            <li>
              <h3>
                <strong>{statsData.AvgTripHour || 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-danger align-items-center">
                  <FiTrendingDown className="me-1" /> 85%
                </span> */}
              <span className="subtitle_sm">Avg Trip Time</span>
              <span
                className={`overline_text d-flex align-items-center ${statsData.AvgTripTimeDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.AvgTripTimeDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.AvgTripTimeDiff ?? 0}
              </span>

            </li>

            <li>
              <h3>
                <strong>{statsData.totalAdhocTrip ?? 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span className="subtitle_sm">
                Single Emp. Trips
              </span>
              <span
                className={`overline_text d-flex align-items-center ${statsData.SingleEmpTripPerDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.SingleEmpTripPerDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.SingleEmpTripPerDiff ?? 0} %
              </span>

            </li>
            <li>
              <h3>
                <strong>{statsData.totalnoshow ?? 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span className="subtitle_sm">No Shows</span>
              <span
                className={`overline_text d-flex align-items-center ${statsData.noshowPerDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.noshowPerDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.noshowPerDiff ?? 0} %
              </span>

            </li>
            <li>
              <h3>
                <strong>{statsData.guardCount || 0}</strong>
              </h3>
              <span className="subtitle_sm">Escorted trips</span>
            </li>
            <li>
              <h3>
                <strong>{vuCountData?.SeatUtilizationPer || 0}%</strong>
              </h3>
              <span className="subtitle_sm">Seat Utilisation</span>
            </li>
            <li>
              {/* <span className="overline_text">Daily Refusal Rate is 1.5%</span> */}
              <h3>
                <strong>{cancelData?.TripRejectedcount || 0}</strong>
              </h3>
              <span className="subtitle_sm">Trips Rejected <br /> by Drivers</span>
            </li>
            <li>
              {/* <span className="overline_text">Daily Refusal Rate is 2%</span> */}
              <h3>
                <strong>{cancelData?.Triprefusalcount || 0}</strong>
              </h3>
              <span className="subtitle_sm">Trips Refused <br /> by Vendor</span>
            </li>

          </ul>
        </div>
      </div>
      <div className="col-5 d-none">
        <div className="cardNew w-100  p-0">
          <ul className="mb-2 last_stats">
            <li>
              <h3>
                <strong>
                  {statsData.OTD ?? 0}{" "}
                  <small className="fs-6 text-muted">%</small>
                </strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.OTDDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.OTDDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.OTDDiff ?? 0} %
              </span>
              <span className="subtitle_sm">OTD</span>
            </li>
            <li>
              <h3>
                <strong>
                  {statsData.OTA ?? 0}{" "}
                  <small className="fs-6 text-muted">%</small>
                </strong>
              </h3>
              {/* <span className="overline_text d-flex text-danger align-items-center">
                <FiTrendingDown className="me-1" /> 85%
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.OTADiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.OTADiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.OTADiff ?? 0} %
              </span>
              <span className="subtitle_sm">OTA</span>
            </li>
            <li>
              <h3>
                <strong>{statsData.totalcompleted ?? 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.completedPerDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.completedPerDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.completedPerDiff ?? 0} %
              </span>
              <span className="subtitle_sm">Completed</span>
            </li>
          </ul>
        </div>
        <div className="cardNew w-100  p-0 d-none">
          <ul className="last_stats">
            {/* <li>
              <h3>
                <strong>
                  {(() => {
                    const total = statsData.AvgTripHour ?? 0;
                    const hrs = Math.floor(total);
                    const mins = Math.round((total - hrs) * 60);
                    return `${hrs} hr${hrs !== 1 ? "s" : ""} ${
                      mins > 0 ? mins + " mins" : ""
                    }`;
                  })()}
                </strong>
              </h3>
              <span className="subtitle_sm text-primary">Avg Trip Time</span>
            </li> */}

            {/* {statsData.AvgTripHour > 0 && (
              <li>
                <h3>
                  <strong>
                    {(() => {
                      const total = statsData.AvgTripHour;
                      const hrs = Math.floor(total);
                      const mins = Math.round((total - hrs) * 60);
                      return (
                        <>
                          {hrs > 0 && `${hrs} hr${hrs > 1 ? "s" : ""}`}
                          {mins > 0 && (
                            <>
                              {" "}
                              {`${mins}`}{" "}
                              <small className="text-muted fs-6">{`Mins`}</small>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </strong>
                </h3>
                <span className="overline_text d-flex text-danger align-items-center">
                  <FiTrendingDown className="me-1" /> 85%
                </span>
                <span className="subtitle_sm text-primary">Avg Trip Time</span>
              </li>
            )} */}


            <li>
              <h3>
                <strong>{statsData.AvgTripHour || 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-danger align-items-center">
                  <FiTrendingDown className="me-1" /> 85%
                </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.AvgTripTimeDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.AvgTripTimeDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.AvgTripTimeDiff ?? 0}
              </span>
              <span className="subtitle_sm text-primary">Avg Trip Time</span>
            </li>

            <li>
              <h3>
                <strong>{statsData.totalAdhocTrip ?? 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.SingleEmpTripPerDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.SingleEmpTripPerDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.SingleEmpTripPerDiff ?? 0} %
              </span>
              <span className="subtitle_sm text-warning">
                Single Emp. Trips
              </span>
            </li>
            <li>
              <h3>
                <strong>{statsData.totalnoshow ?? 0}</strong>
              </h3>
              {/* <span className="overline_text d-flex text-success align-items-center">
                <FiTrendingUp className="me-1" /> 85%
              </span> */}
              <span
                className={`overline_text d-flex align-items-center ${statsData.noshowPerDiffStatus === "down"
                  ? "text-danger"
                  : "text-success"
                  }`}
              >
                {statsData.noshowPerDiffStatus === "down" ? (
                  <FiTrendingDown className="me-1" />
                ) : (
                  <FiTrendingUp className="me-1" />
                )}
                {statsData.noshowPerDiff ?? 0} %
              </span>
              <span className="subtitle_sm text-danger">No Shows</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiStats;
