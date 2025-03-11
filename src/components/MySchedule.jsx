import React, { useState, useEffect } from "react";
import Sidebar from "./Master/SidebarMenu";
import Header from "./Master/Header";
import Notifications from "./Master/Notifications";
import sessionManager from "../utils/SessionManager.js";
import { apiService } from "../services/api";

const addDay = (dateString, days) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setDate(date.getDate() + days + 1);
  return date.toISOString().split("T")[0];
};
const generateWeekDays = (fromDate) => {
  const days = [];
  // Convert fromDate string to Date object
  const startDate = new Date(fromDate);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Start directly from fromDate instead of calculating start of week
  const startOfWeek = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);

    days.push({
      day: dayNames[currentDate.getDay()],
      date: `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}`,
      fullDate: currentDate.toISOString().split("T")[0],
    });
  }

  return days;
};

const MySchedule = () => {
  const facID = sessionManager.getUserSession().FacilityID;
  const empid = sessionManager.getUserSession().ID;
  const [processes, setProcesses] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [mgrscheduledata, setMgrscheduledata] = useState([]);
  const [weekDays, setWeekDays] = useState([]);
  const [loginfacility, setloginfacility] = useState([]);
  const [selectedloginfacility, setSelectedloginfacility] = useState("");
  const [selectedlogoutfacility, setSelectedlogoutfacility] = useState("");
  const [mgrassociate, setMgrassociate] = useState([]);
  const [LoginNewShiftPickup, setLoginNewShiftPickup] = useState([]);
  const [LoginNewShiftDrop, setLoginNewShiftDrop] = useState([]);
  const [LoginWeekEndShiftPickup, setLoginWeekEndShiftPickup] = useState([]);
  const [LoginWeekEndShiftDrop, setLoginWeekEndShiftDrop] = useState([]);
  const [isEmployeeShiftOpen, setIsEmployeeShiftOpen] = useState(false); // State for offcanvas visibility
  //const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee details
  const [weekendDays, setWeekendDays] = useState({
    sat: true,
    sun: true,
  });
  const handleEmployeeShiftClick = (employee) => {
    //setSelectedEmployee(employee); // Set the selected employee details
    setIsEmployeeShiftOpen(true); // Open the offcanvas
  };
  // Initialize lockDetails with default values
  const [lockDetails, setLockDetailsState] = useState({
    AdhocMaxDay: "",
    DayNames: "",
    DelayBuffer: "",
    DelayBufferDrop: "",
    LockHrs: "",
    Lockpickhrs: "",
    dropLockDateTime: "",
    lockDiffDays: 0,
    lockEDate: "",
    lockSDate: "",
    lockdrophrs: "",
    lockweekenddrop: "",
    lockweekendpick: "",
    lockweekenddrophrs: "",
    pickLockDateTime: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchMgrSchedule();
    fetchScheduleDetails();
    const fromDate = document.getElementById("fromDate").value; // Replace with your fromDate
    const days = generateWeekDays(fromDate);
    setWeekDays(days);
    fetchLockDetails();
    fetchFacilityDetails();
  }, []);

  const fetchMgrAssociate = async () => {
    try {
      const response = await apiService.GetMgrAssociate({
        mgrId: empid,
        ProcessId: document.getElementById("ddlProcess").value,
      });
      console.log("Mgr Associate", response);
      setMgrassociate(response);
    } catch (error) {
      console.error("Error fetching manager associates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLockDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.GetLockDetails({
        facID: facID,
      });

      if (response && response[0]) {
        setLockDetailsState({
          AdhocMaxDay: response[0].AdhocMaxDay || "",
          DayNames: response[0].DayNames || "",
          DelayBuffer: response[0].DelayBuffer || "",
          DelayBufferDrop: response[0].DelayBufferDrop || "",
          LockHrs: response[0].LockHrs || "",
          Lockpickhrs: response[0].Lockpickhrs || "",
          dropLockDateTime: response[0].dropLockDateTime || "",
          lockDiffDays: response[0].lockDiffDays || 0,
          lockEDate: response[0].lockEDate || "",
          lockSDate: response[0].lockSDate
            ? addDay(response[0].lockSDate, 1)
            : "",
          lockdrophrs: response[0].lockdrophrs || "",
          lockweekenddrop: response[0].lockweekenddrop || "",
          lockweekendpick: response[0].lockweekendpick || "",
          lockweekenddrophrs: response[0].lockweekenddrophrs || "",
          pickLockDateTime: response[0].pickLockDateTime || "",
        });
      }
    } catch (error) {
      console.error("Error fetching lock details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilityDetails = async () => {
    try {
      setLoading(true);

      let empid = 0;

      if (
        !sessionManager.isBackupManager() &&
        sessionManager.getUserSession().ManagerId === "0"
      ) {
        empid = empid;
      } else {
        empid = -1;
      }

      const response = await apiService.SelectFacilityByGroup({
        empid: empid,
      });

      console.log("Facility Details", response);
      if (response) {
        setloginfacility(response);
        setSelectedloginfacility(response[0]?.Id || ""); // Set default value for login facility
        setSelectedlogoutfacility(response[0]?.Id || ""); // Set default value for logout facility
        console.log("loginfacility", response);
      }
    } catch (error) {
      console.error("Error fetching facility details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMgrSchedule = async () => {
    try {
      setLoading(true);
      let mgrid = empid;
      if (document.getElementById("ddlManager").value !== "") {
        mgrid = document.getElementById("ddlManager").value;
      }
      const mgrscheduledata = await apiService.GetMgrSchedule({
        mgrid: mgrid,
        sdate: document.getElementById("fromDate").value,
      });
      setMgrscheduledata(mgrscheduledata);
    } catch (error) {
      console.error("Error fetching manager schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true);
      const params = {
        backupmgrid: empid,
      };

      const managerResponse = await apiService.GetBackupMgrId(params);

      //console.log("managerResponse",managerResponse);
      if (managerResponse) {
        setManagers(managerResponse);
      }

      const ProjectResponse = await apiService.GetSpocAssignedProcess({
        empid: empid,
        type: "M",
      });

      if (ProjectResponse) {
        setProcesses(ProjectResponse);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllShiftData = async (processId, facilityId) => {
    try {
      const [pickupWeekday, dropWeekday, pickupWeekend, dropWeekend] =
        await Promise.all([
          apiService.GetShiftsbyDays({
            facilityid: facilityId,
            type: "P",
            weekday: 0,
            ProcessId: processId,
          }),
          apiService.GetShiftsbyDays({
            facilityid: facilityId,
            type: "D",
            weekday: 0,
            ProcessId: processId,
          }),
          apiService.GetShiftsbyDays({
            facilityid: facilityId,
            type: "P",
            weekday: 1,
            ProcessId: processId,
          }),
          apiService.GetShiftsbyDays({
            facilityid: facilityId,
            type: "D",
            weekday: 1,
            ProcessId: processId,
          }),
        ]);

      setLoginNewShiftPickup(pickupWeekday);
      setLoginNewShiftDrop(dropWeekday);
      setLoginWeekEndShiftPickup(pickupWeekend);
      setLoginWeekEndShiftDrop(dropWeekend);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  };

  const handleProcessChange = async (e) => {
    const newProcessId = e.target.value;
    setSelectedProcess(newProcessId);

    const facilityId = document.getElementById("ddlNewLoginFacility").value;

    await Promise.all([
      fetchAllShiftData(newProcessId, facilityId),
      fetchMgrAssociate(),
    ]);
  };

  const handleManagerChange = (e) => {
    setSelectedManager(e.target.value);
    fetchMgrSchedule();
  };

  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25); // Show 7 employees per page

  // Calculate pagination indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = mgrscheduledata.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(mgrscheduledata.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Add this function to handle date changes
  const handleFromDateChange = (e) => {
    const newDate = e.target.value;

    // You can add validation or additional logic here if needed
  };

  const onchangedFromDate = (e) => {
    const newDate = e.target.value;
    fetchMgrSchedule();
    const days = generateWeekDays(newDate);
    setWeekDays(days);
  };

  // Add these handler functions
  const handleToDateChange = (e) => {
    // Add any validation logic here if needed
    const newDate = e.target.value;

    console.log("To date changed:", e.target.value);
  };

  const handleLoginFacilityChange = (e) => {
    setSelectedloginfacility(e.target.value);
  };

  const handleLogoutFacilityChange = (e) => {
    setSelectedlogoutfacility(e.target.value);
  };

  const handleSubmit = async () => {
    const selectedEmployees = mgrassociate
      .filter((emp) => emp.isChecked)
      .map((emp) => emp.EmployeeID);

    const params = {
      empID: selectedEmployees, // Assuming you have the employee ID from the session
      fromDate: lockDetails.lockSDate,
      toDate: addDay(lockDetails.lockSDate, lockDetails.lockDiffDays - 2),
      facilityIn: selectedloginfacility,
      facilityOut: selectedlogoutfacility,
      logIn: document.getElementById("ddlNewLoginShift").value,
      logOut: document.getElementById("ddlNewLogoutShift").value,
      WeeklyOff: weekendDays.sat || weekendDays.sun ? "1" : "0", // Example logic for weekly off
      userID: sessionManager.getUserSession().ID, // Assuming you have the user ID from the session
      weekendlogin: weekendDays.sat ? "1" : "0",
      weekendlogout: weekendDays.sun ? "1" : "0",
      pickadflag: "1", // Replace with actual logic if needed
      dropadflag: "1", // Replace with actual logic if needed
    };

    try {
      const response = await apiService.InsertNewSchedule(params);
      console.log("Schedule saved successfully:", response);
      // Optionally, you can close the offcanvas or reset the form here
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  return (
    <div className="container-fluid p-0">
      <Header pageTitle="My Schedule" showNewButton={true} />
      <Sidebar />

      {/* Middle Section */}
      <div className="middle">
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-4">
                <button type="button" className="btn btn-dark me-3">
                  Replicate Schedule
                </button>
                <button type="button" className="btn btn-light">
                  Roster Bulk Upload
                </button>
              </div>
              <div className="col-1">
                <label className="form-label">Manager</label>
              </div>
              <div className="col-2">
                <select
                  className="form-select"
                  id="ddlManager"
                  value={selectedManager}
                  onChange={handleManagerChange}
                >
                  {managers.map((manager) => (
                    <option key={manager.MgrId} value={manager.MgrId}>
                      {manager.ManagerName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-1">
                <label className="form-label">From Date</label>
              </div>
              <div className="col-2">
                <input
                  type="date"
                  className="form-control"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  id="fromDate"
                  onChange={onchangedFromDate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="row">
          <div className="col-12">
            <div className="card_tb">
              <div className="table-responsive">
                <table className="table" id="mgrschedule">
                  <thead>
                    <tr>
                      <th>Schedule</th>
                      {weekDays.map((day, index) => (
                        <th key={index}>
                          <span className="badge rounded-pill text-bg-dark fs-13">
                            {day.day}
                          </span>{" "}
                          {day.date}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="arrows">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((employee, index) => (
                        <tr key={index} className={index > 0 ? "column" : ""}>
                          <td>
                            <span className="text-muted">
                              {employee.EmpName}
                            </span>
                            {employee.geoCode !== "Y" && (
                              <span className="material-icons md-18 text-danger mx-2">
                                location_off
                              </span>
                            )}
                            {employee.tptReq !== "Y" && (
                              <span className="material-icons md-18 text-danger">
                                no_transfer
                              </span>
                            )}
                          </td>
                          {/* Time slots */}
                          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                            <td key={day} id={employee.EmployeeID}>
                              <a href="#!" onClick={()=>handleEmployeeShiftClick(employee)}>
                                {
                                  employee[`SETime${day}`]
                                    .split("!")[0]
                                    .split("<BR>")[0]
                                }
                                <br />
                                {
                                  employee[`SETime${day}`]
                                    .split("!")[0]
                                    .split("<BR>")[1]
                                }
                              </a>
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Pagination controls */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Showing {indexOfFirstItem + 1} to{" "}
                    {Math.min(indexOfLastItem, mgrscheduledata.length)} of{" "}
                    {mgrscheduledata.length} entries
                  </div>

                  <nav aria-label="Schedule pagination">
                    <ul className="pagination mb-0">
                      {/* Previous button */}
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>

                      {/* Page numbers */}
                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${currentPage === index + 1 ? "active" : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}

                      {/* Next button */}
                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Sidebar */}
      <Notifications />
      {/* Profile Sidebar */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="profileSidebar"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-body position-relative p-0">
          <button
            type="button"
            className="btn-close text-reset btn-close-fixed"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
          <div className="d-flex justify-content-start align-items-start p-3">
            <img src="images/ali.png" className="me-3" alt="" />
            <div>
              <h5 className="subtitle_sm">John Doe</h5>
              <ul className="personal_info">
                <li>
                  <span className="material-icons">email</span> john@example.com
                </li>
                <li>
                  <span className="material-icons">call</span> 9627552410
                </li>
              </ul>
              <button className="btn btn-outline-secondary pi_btn">
                View Profile
              </button>
              <button className="btn btn-outline-danger pi_btn">Logout</button>
            </div>
          </div>
          {/* Add more profile sidebar content */}
        </div>
      </div>

      {/* <!-- Employee Shift Detail --> */}
      <div
        class={`offcanvas offcanvas-end ${isEmployeeShiftOpen ? 'show' : ''}`}
        tabindex="-1"
        id="Employee_Shift"
        aria-labelledby="offcanvasRightLabel"
         data-bs-backdrop="true"
      >
        <div class="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 class="subtitle fw-normal">
            Employee Shift Detail - TMP Sharat Jain
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close" onClick={() => setIsEmployeeShiftOpen(false)}
          ></button>
        </div>
        <div class="offcanvas-body px-4">
          <div class="row">
            <div class="col-12">
              <div class="alert  alert-light offcanvas_alert" role="alert">
                <small>
                  * Login. Last Updated By - Sharat Jain (TMP123) | At - Jan 3
                  2025 3:16 PM
                </small>
                <small>
                  * Logout. Last Updated By - Sharat Jain (TMP123) | At - Jan 3
                  2025 3:16 PM
                </small>
              </div>
            </div>
            <div class="col-12 mb-3">
              <ul class="offcanvas_list">
                <li>
                  <small>Employee ID</small> TMP123
                </li>
                <li>
                  <small>Name</small> Sharat Jain
                </li>
                <li>
                  <small>Shift Date</small> Friday, January 3, 2025
                </li>
              </ul>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label">Select Log-In</label>
              <select class="form-select">
                <option selected>GGN</option>
              </select>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label">Select Log-Out</label>
              <select class="form-select">
                <option selected>GGN</option>
              </select>
            </div>
            <div class="col-6">
              <select class="form-select">
                <option>Select</option>
              </select>
            </div>
            <div class="col-6">
              <select class="form-select">
                <option>Select</option>
              </select>
            </div>
          </div>
        </div>
        <div class="offcanvas-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="offcanvas" onClick={() => setIsEmployeeShiftOpen(false)}>
            Cancel
          </button>
          <button class="btn btn-success mx-3">Submit</button>
        </div>
      </div>
      {/* {<!-- Employee Shift Detail  -->} */}
      {/* New Schedule Modal */}
      <div
        className="offcanvas offcanvas-end offcanvas_long"
        tabIndex="-1"
        id="raise_Feedback"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 className="subtitle fw-bold">New Schedule</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {/* Cut Off Timings */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-warning">
                <div className="card-body d-flex justify-content-start align-items-center cutoff p-0">
                  <div className="overline_textB">Cut Off Timings </div>
                  <div>
                    <small className="fw-bold fs-11 me-2">Weekday</small>
                    <small className="fs-11">Pick </small>
                    <span className="overline_textB text-danger me-4">
                      {lockDetails?.Lockpickhrs || "0"} Hrs
                    </span>
                    <small className="fs-11">Drop </small>
                    <span className="overline_textB text-danger">
                      {lockDetails?.lockdrophrs || "0"} Mins
                    </span>
                  </div>
                  <div className="ms-5">
                    <small className="fw-bold fs-11 me-2">Weekend</small>
                    <small className="fs-11">Pick </small>
                    <span className="overline_textB text-danger me-4">
                      {lockDetails?.lockweekendpick || "0"} Hrs
                    </span>
                    <small className="fs-11">Drop </small>
                    <span className="overline_textB text-danger">
                      {lockDetails?.lockweekenddrophrs || "0"} Mins
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Form */}
          <div className="row mb-4">
            <div className="col">
              <label className="form-label">Process Name</label>
              <select
                id="ddlProcess"
                className="form-select"
                value={selectedProcess}
                onChange={handleProcessChange}
              >
                <option value="0">Select Project</option>
                {processes.map((process) => (
                  <option key={process.id} value={process.id}>
                    {process.processName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="form-label">From</label>
              <input
                type="date"
                className="form-control"
                value={lockDetails?.lockSDate}
                onChange={handleFromDateChange}
                id="txtNewfromDate"
              />
            </div>
            <div className="col">
              <label className="form-label">To</label>
              <input
                type="date"
                className="form-control"
                value={addDay(
                  lockDetails?.lockSDate,
                  lockDetails?.lockDiffDays - 2
                )}
                onChange={handleToDateChange}
                id="txtNewtoDate"
              />
            </div>
            <div className="col">
              <label className="form-label">Login Facility</label>
              <select
                className="form-select"
                value={selectedloginfacility}
                onChange={handleLoginFacilityChange}
                id="ddlNewLoginFacility"
                disabled
              >
                {loginfacility.map((loginfacility) => (
                  <option key={loginfacility.Id} value={loginfacility.Id}>
                    {loginfacility.facilityName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col">
              <label className="form-label">Logout Facility</label>
              <select
                className="form-select"
                value={selectedlogoutfacility}
                onChange={handleLogoutFacilityChange}
                id="ddlNewLogoutFacility"
                disabled
              >
                {loginfacility.map((loginfacility) => (
                  <option key={loginfacility.Id} value={loginfacility.Id}>
                    {loginfacility.facilityName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className="form-check form-check-inline ps-0">
                <button
                  type="button"
                  className="btn btn-light rounded-pill px-3"
                >
                  Weekly Off
                </button>
              </div>
              <div className="form-check form-check-inline me-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Mon"
                  value="Mon"
                />
                <label className="form-check-label" htmlFor="Mon">
                  Mon
                </label>
              </div>
              <div className="form-check form-check-inline me-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Tue"
                  value="Tue"
                />
                <label className="form-check-label" htmlFor="Tue">
                  Tue
                </label>
              </div>
              <div className="form-check form-check-inline me-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Wed"
                  value="Wed"
                />
                <label className="form-check-label" htmlFor="Wed">
                  Wed
                </label>
              </div>
              <div className="form-check form-check-inline me-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Thu"
                  value="Thu"
                />
                <label className="form-check-label" htmlFor="Thu">
                  Thu
                </label>
              </div>
              <div className="form-check form-check-inline me-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Fri"
                  value="Fri"
                />
                <label className="form-check-label" htmlFor="Fri">
                  Fri
                </label>
              </div>
              <div className="form-check form-check-inline me-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Sat"
                  value="Sat"
                  checked={weekendDays.sat}
                  onChange={(e) =>
                    setWeekendDays((prev) => ({
                      ...prev,
                      sat: e.target.checked,
                    }))
                  }
                />
                <label className="form-check-label" htmlFor="Sat">
                  Sat
                </label>
              </div>
              <div className="form-check form-check-inline me-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="Sun"
                  value="Sun"
                  checked={weekendDays.sun}
                  onChange={(e) =>
                    setWeekendDays((prev) => ({
                      ...prev,
                      sun: e.target.checked,
                    }))
                  }
                />
                <label className="form-check-label" htmlFor="Sun">
                  Sun
                </label>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-4">
              <div className="card form_card border-0">
                <div className="card-header">Weekdays</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label">Login Shift</label>
                      <select
                        className="form-select"
                        defaultValue="0"
                        id="ddlNewLoginShift"
                      >
                        <option value="0">Select</option>
                        <option value="N/A">N/A</option>
                        {LoginNewShiftPickup.map((loginnewshiftpickup) => (
                          <option
                            key={loginnewshiftpickup.shiftTime}
                            value={loginnewshiftpickup.shiftTime}
                          >
                            {loginnewshiftpickup.shiftTime}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label">Logout Shift</label>
                      <select
                        className="form-select"
                        defaultValue="0"
                        id="ddlNewLogoutShift"
                      >
                        <option value="0">Select</option>
                        <option value="N/A">N/A</option>
                        {LoginNewShiftDrop.map((loginnewshiftdrop) => (
                          <option
                            key={loginnewshiftdrop.shiftTime}
                            value={loginnewshiftdrop.shiftTime}
                          >
                            {loginnewshiftdrop.shiftTime}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card form_card border-0">
                <div className="card-header">Weekends</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label">Login Shift</label>
                      <select
                        className="form-select"
                        defaultValue={weekendDays.sat ? "N/A" : "0"}
                        id="ddlNewLoginWeekEndShift"
                        disabled={weekendDays.sat && weekendDays.sun}
                      >
                        <option value="0">Select</option>
                        <option value="N/A">N/A</option>
                        {LoginWeekEndShiftPickup.map((loginweekendshiftpickup) => (
                          <option
                            key={loginweekendshiftpickup.shiftTime}
                            value={loginweekendshiftpickup.shiftTime}
                          >
                            {loginweekendshiftpickup.shiftTime}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label">Logout Shift</label>
                      <select
                        className="form-select"
                        defaultValue={weekendDays.sun ? "N/A" : "0"}
                        id="ddlNewLogoutWeekEndShift"
                        disabled={weekendDays.sat && weekendDays.sun}
                      >
                        <option value="0">Select</option>
                        <option value="N/A">N/A</option>
                        {LoginWeekEndShiftDrop.map((loginweekendshiftdrop) => (
                          <option
                            key={loginweekendshiftdrop.shiftTime}
                            value={loginweekendshiftdrop.shiftTime}
                          >
                            {loginweekendshiftdrop.shiftTime}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Table start --> */}
          {mgrassociate.length > 0 && (
            <table
              className="tb_raiseAdhoc table table-borderless table-hover"
              id="tblMgrAssociate"
            >
              <thead>
                <tr>
                  <th width="4%">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexCheckDefault"
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setMgrassociate((prev) =>
                          prev.map((item) => ({
                            ...item,
                            isChecked: isChecked, // Add isChecked property to each item
                          }))
                        );
                      }}
                    />
                  </th>
                  <th>Employee</th>
                  <th>Gender</th>
                  <th>Process</th>
                  <th>Manager</th>
                  <th>Facility</th>
                </tr>
              </thead>
              <tbody>
                {mgrassociate.map((mgrassociate) => (
                  <tr key={mgrassociate.EmployeeID}>
                    <td>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={mgrassociate.isChecked || false} // Use isChecked property
                        onChange={() => {
                          setMgrassociate((prev) =>
                            prev.map((item) =>
                              item.EmployeeID === mgrassociate.EmployeeID
                                ? { ...item, isChecked: !item.isChecked }
                                : item
                            )
                          );
                        }}
                      />
                    </td>
                    <td>
                      {mgrassociate.EmpName}
                      {mgrassociate.geoCode !== "Y" && (
                        <span className="material-icons md-18 text-danger mx-2">
                          location_off
                        </span>
                      )}
                      {mgrassociate.tptReq !== "Y" && (
                        <span className="material-icons md-18 text-danger">
                          no_transfer
                        </span>
                      )}
                    </td>
                    <td>{mgrassociate.Gender}</td>
                    <td>{mgrassociate.processName}</td>
                    <td>{mgrassociate.Manager}</td>
                    <td>{mgrassociate.facility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add more form fields */}
        <div className="offcanvas-footer">
          <button
            className="btn btn-outline-secondary"
            data-bs-dismiss="offcanvas"
          >
            Cancel
          </button>
          <button className="btn btn-success mx-3" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySchedule;
