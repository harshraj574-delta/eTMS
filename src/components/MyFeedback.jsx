import React, { useState, useEffect } from "react";
import Sidebar from "./Master/SidebarMenu";
import Notifications from "./Master/Notifications";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import * as bootstrap from "bootstrap"; // Add this line to import Bootstrap as a namespace
import "../components/css/style.css";
import Header from "./Master/Header";
import { apiService } from "../services/api";
import sessionManager from "../utils/SessionManager.js";
import { toastService } from "../services/toastService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // Renamed to avoid conflict with your Sidebar component
import { Button } from "primereact/button"; // Import Button component from PrimeReact
import { InputText } from "primereact/inputtext"; // Import InputText component from PrimeReact
import { InputTextarea } from "primereact/inputtextarea"; // Import InputTextarea component from PrimeReact
import { Offcanvas } from "bootstrap";
import { api } from "../services/axios/api.js";

const MyFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketReplies, setTicketReplies] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [categoryDropDown, setCategoryDropDown] = useState([]);
  const [complaintTypeDropDown, setComplaintTypeDropDown] = useState([]);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isRaiseFeedbackOpen, setIsRaiseFeedbackOpen] = useState(false); // State for Raise Feedback offcanvas
  const [feedbackText, setFeedbackText] = useState(""); // State for feedback text
  const [reopenRemark, setReopenRemark] = useState(""); // State for the remark entered in the offcanvas
  const [feedbackFilter, setFeedbackFilter] = useState("total"); // "all", "open", "closed", "total"
  const [feedbackCount, setFeedbackCount] = useState({
    total: 0,
    open: 0,
    closed: 0,
  });
  const [addRaiseFeedback, setAddRaiseFeedback] = useState(false);

  const handleReopen = (ticketNo) => {
    setSelectedTicket(ticketNo); // Set the selected ticket number
    setIsOffcanvasOpen(true); // Open the offcanvas
  };
  useEffect(() => {
    fetchFeedbackData();
    fetchCategories();
    fetchFeedbackCount();

    // Add event listeners for Bootstrap offcanvas events
    const reopenOffcanvas = document.getElementById("raise_Reopen");
    if (reopenOffcanvas) {
      reopenOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
        setIsOffcanvasOpen(false);
        refreshData();
      });
    }

    const feedbackOffcanvas = document.getElementById("raise_Feedback");
    if (feedbackOffcanvas) {
      feedbackOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
        setIsRaiseFeedbackOpen(false);
        refreshData();
      });
    }

    const ticketOffcanvas = document.getElementById("ticketNumber");
    if (ticketOffcanvas) {
      ticketOffcanvas.addEventListener("hidden.bs.offcanvas", () => {
        // Reset ticket replies when the offcanvas is closed
        setTicketReplies([]);
      });
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (reopenOffcanvas) {
        reopenOffcanvas.removeEventListener("hidden.bs.offcanvas", () => {});
      }
      if (feedbackOffcanvas) {
        feedbackOffcanvas.removeEventListener("hidden.bs.offcanvas", () => {});
      }
      if (ticketOffcanvas) {
        ticketOffcanvas.removeEventListener("hidden.bs.offcanvas", () => {});
      }
    };
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const data = await apiService.Spr_sprSelectFeedBack({});
      setFeedbackData(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      // You might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketReplies = async (ticketNo) => {
    try {
      console.log("Fetching replies for ticket:", ticketNo); // Added log
      const replies = await apiService.Spr_sprSelectReply({
        ticketNo: ticketNo,
      });
      console.log("Received replies:", replies); // Added log
      setTicketReplies(replies);
      setSelectedTicket(ticketNo);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const facID = sessionStorage.getItem("FacilityID"); // assuming facID is stored in sessionStorage
      const result = await apiService.Spr_GetComplaintCategory({ facID });
      console.log("Category DropDown Data:", result);
      setCategoryDropDown(result);
      // Set the first category ID as ComplaintCategoryID
      if (result.length > 0) {
        const ComplaintCategoryID = result[0].id; // Get the ID of the first category
        sessionStorage.setItem("ComplaintCategoryId", ComplaintCategoryID); // Store it in session storage
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchComplaintType = async (selectedCategoryId) => {
    try {
      const ComplaintCategoryID = selectedCategoryId; // Use the selected category ID directly

      // Check if ComplaintCategoryID is valid
      if (!ComplaintCategoryID) {
        throw new Error(
          "ComplaintCategoryID is not available. Please select a category first."
        );
      }

      const result = await apiService.Spr_GetComplaintType({
        ComplaintCategoryID,
      });
      console.log("Complaint Type DropDown Data:", result);
      setComplaintTypeDropDown(result); // Update the complaint type dropdown
    } catch (error) {
      console.error("Error fetching complaint types:", error);
    }
  };
  const handleCategorySelect = (categoryId) => {
    if (categoryId) {
      fetchComplaintType(categoryId); // Call with the selected category ID
    } else {
      setComplaintTypeDropDown([]); // Clear complaint types if no category is selected
    }
  };
  // Function to refresh data
  const refreshData = () => {
    fetchFeedbackData(); // Refresh feedback data
    fetchCategories(); // Refresh categories
  };
  const handleSubmitFeedback = async () => {
    // Get the specific complaint type select element instead of using generic selector
    //const FeedTypeId = document.getElementById("complaintTypeSelect").value;

    // Check if required fields are filled
    const selectedCategory = document.getElementById("categorySelect").value;
    if (!selectedCategory) {
      toastService.warn("Please select a category type");
      return;
    }

    if (!feedbackText) {
      toastService.warn("Please enter feedback text");
      return;
    }

    const ticketNo = selectedTicket; // Assuming you have the selected ticket number
    const desc = feedbackText; // Use the feedbackText state for the description
    const actionid = 0; // Set the appropriate action ID if needed
    const statusid = 0; // Set the appropriate status ID if needed
    const FeedTypeId = document.querySelector(".form-select").value; // Get selected complaint type ID
    const RaisedDate = new Date().toISOString(); // Current date as raised date
    const RaisedById = sessionManager.getUserSession()?.ID; // Assuming you have the user ID from the session
    const RouteId = ""; // Set the appropriate route ID if needed
    // Clear the fields after submission
    document.getElementById("categorySelect").value = "";
    document.getElementById("complaintTypeSelect").value = "";
    document.getElementById("travelDate").value = "";
    document.getElementById("tripIdSelect").value = "";
    setFeedbackText(""); // Clear feedback text
    setIsRaiseFeedbackOpen(false); // Close the offcanvas
    const offcanvasElement = document.getElementById("raise_Feedback");
    const closeButton = offcanvasElement.querySelector(
      '[data-bs-dismiss="offcanvas"]'
    );
    if (closeButton) {
      closeButton.click();
    }
    const params = {
      ticketNo,
      desc,
      actionid,
      statusid,
      FeedTypeId,
      RaisedDate,
      RaisedById,
      RouteId,
    };

    try {
      const response = await apiService.sprInsertFeedBackDetails(params);
      console.log("Feedback submitted successfully:", response);
      toastService.success("Feedback submitted successfully!");
      const offcanvasElement = document.getElementById("raise_Reopen");
      const closeButton = offcanvasElement.querySelector(
        '[data-bs-dismiss="offcanvas"]'
      );
      if (closeButton) {
        closeButton.click();
      }
      refreshData(); // Refresh data if needed
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Optionally, show an error message to the user
      toastService.error("Error submitting feedback. Please try again.");
    }
  };
  const handleReopenSave = async () => {
    const params = {
      ticketNo: selectedTicket, // Assuming you have the selected ticket number
      desc: reopenRemark, // Use the remark entered by the user
      actionid: sessionManager.getUserSession()?.ID, // Set the appropriate action ID if needed
      statusid: 0, // Set the appropriate status ID if needed
    };

    try {
      const response = await apiService.Spr_sprInsertReopen(params);
      console.log("Reopen Remark submitted successfully:", response);
      // Reset the remark state
      setReopenRemark("");
      setIsOffcanvasOpen(false); // Close the offcanvas
      document.getElementById("reopenRemark").value = ""; // Clear the textarea
      refreshData(); // Refresh data if needed

      // Optionally, refresh data or show a success message
    } catch (error) {
      console.error("Error submitting reopen remark:", error);
      // Optionally, show an error message to the user
    }
  };

  // Add this function to handle opening the Raise Feedback offcanvas
  const handleOpenRaiseFeedback = () => {
    setIsRaiseFeedbackOpen(true);
  };
  // Function to fetch feedback count
  const fetchFeedbackCount = async (credentials = {}) => {
    try {
      const empid = sessionManager.getUserSession()?.ID;

      // Set endDate and startDate from credentials or defaults
      const endDate = credentials.endDate
        ? new Date(credentials.endDate)
        : new Date();
      let startDate = credentials.startDate
        ? new Date(credentials.startDate)
        : new Date(endDate);

      if (!credentials.startDate) {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      // Format dates as "YYYY-MM-DD 00:00:00.000"
      const sDate = `${startDate.toISOString().split("T")[0]} 00:00:00.000`;
      const eDate = `${endDate.toISOString().split("T")[0]} 00:00:00.000`;

      let resultArr = await apiService.getFeedbackcount({
        empid,
        sdate: sDate,
        edate: eDate,
      });

      // If response is a string, parse it
      if (typeof resultArr === "string") {
        try {
          resultArr = JSON.parse(resultArr);
          console.log("Parsed Feedback Count Result:", resultArr);
        } catch (parseError) {
          console.error("Error parsing feedback count JSON:", parseError);
          resultArr = [];
        }
      }

      // resultArr is an array, so get the first object
      const result =
        Array.isArray(resultArr) && resultArr.length > 0 ? resultArr[0] : {};

      setFeedbackCount({
        total: result.Totolfeedback || 0, // spelling exactly as in API response
        open: result.OpenCount || 0,
        closed: result.ClosedCount || 0,
      });
    } catch (error) {
      setFeedbackCount({ total: 0, open: 0, closed: 0 });
    }
  };
  const handleNewButtonClick = () => {
    const offcanvasElement = document.getElementById("raise_Feedback");
    if (offcanvasElement) {
      const offcanvas = new Offcanvas(offcanvasElement);
      offcanvas.show();
    }
    // optional: resetFormValues();
  };
  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <Header
        pageTitle={"My Feedback"}
        showNewButton={true}
        //onNewClick={handleOpenRaiseFeedback} // This now has a defined function
        onNewButtonClick={handleNewButtonClick}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Middle Content */}
      <div className="middle">
        {/* <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col">
                <div
                  className="cardx p-3 bg-secondary text-white"
                  style={{ cursor: "pointer" }}
                  onClick={() => setFeedbackFilter("total")}
                >
                  <h3>
                    <strong className="text-white">
                      {feedbackCount.total}
                    </strong>
                  </h3>
                  <span className="subtitle_sm text-white">
                    Total Feedbacks
                  </span>
                </div>
              </div>
              <div className="col">
                <div
                  className="cardx p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setFeedbackFilter("open")}
                >
                  <h3>
                    <strong className="text-warning">
                      {feedbackCount.open}
                    </strong>
                  </h3>
                  <span className="subtitle_sm">Open Tickets</span>
                </div>
              </div>
              <div className="col">
                <div
                  className="cardx p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setFeedbackFilter("closed")}
                >
                  <h3>
                    <strong className="text-dark text-opacity-50">
                      {feedbackCount.closed}
                    </strong>
                  </h3>
                  <span className="subtitle_sm">Closed Tickets</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col">
                <div
                  className={`cardx p-3 ${
                    feedbackFilter === "total"
                      ? "bg-secondary text-white"
                      : "bg-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setFeedbackFilter("total")}
                >
                  <h3>
                    <strong
                      className={
                        feedbackFilter === "total" ? "text-white" : "text-dark"
                      }
                    >
                      {feedbackCount.total}
                    </strong>
                  </h3>
                  <span
                    className={`subtitle_sm ${
                      feedbackFilter === "total" ? "text-white" : "text-dark"
                    }`}
                  >
                    Total Feedbacks
                  </span>
                </div>
              </div>
              <div className="col">
                <div
                  className={`cardx p-3 ${
                    feedbackFilter === "open"
                      ? "bg-secondary text-white"
                      : "bg-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setFeedbackFilter("open")}
                >
                  <h3>
                    <strong
                      className={
                        feedbackFilter === "open" ? "text-warning" : "text-dark"
                      }
                    >
                      {feedbackCount.open}
                    </strong>
                  </h3>
                  <span
                    className={`subtitle_sm ${
                      feedbackFilter === "open" ? "text-white" : "text-dark"
                    }`}
                  >
                    Open Tickets
                  </span>
                </div>
              </div>
              <div className="col">
                <div
                  className={`cardx p-3 ${
                    feedbackFilter === "closed"
                      ? "bg-secondary text-white"
                      : "bg-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setFeedbackFilter("closed")}
                >
                  <h3>
                    <strong
                      className={
                        feedbackFilter === "closed"
                          ? "text-white text-opacity-50"
                          : "text-dark"
                      }
                    >
                      {feedbackCount.closed}
                    </strong>
                  </h3>
                  <span
                    className={`subtitle_sm ${
                      feedbackFilter === "closed" ? "text-white" : "text-dark"
                    }`}
                  >
                    Closed Tickets
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Feedback Table */}
        <div className="row">
          <div className="col-12">
            <div className="card_tb">
              <DataTable
                value={
                  feedbackFilter === "total"
                    ? feedbackData // Total feedbacks ka data (ya sabhi)
                    : feedbackFilter === "open"
                    ? feedbackData.filter(
                        (item) =>
                          item.Status && item.Status.toLowerCase() === "open"
                      )
                    : feedbackFilter === "closed"
                    ? feedbackData.filter(
                        (item) =>
                          item.Status && item.Status.toLowerCase() === "closed"
                      )
                    : feedbackData
                }
                paginator
                rows={50}
                rowsPerPageOptions={[50, 100, 150, 200]}
                loading={loading}
                emptyMessage="No feedback data available"
                className="p-datatable-sm"
                rowClassName={(data) =>
                  data && data.Status && data.Status.toLowerCase() === "closed"
                    ? "column"
                    : ""
                }
              >
                <Column
                  header="Ticket No."
                  body={(rowData) => (
                    <a
                      href="#!"
                      className="btn-text"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#ticketNumber"
                      aria-controls="offcanvasRight"
                      onClick={() => fetchTicketReplies(rowData.TicketNo)}
                    >
                      <span className="ms-3">{rowData.TicketNo}</span>
                    </a>
                  )}
                />
                <Column
                  field="RaisedDate"
                  header="Shift Date"
                  body={(rowData) =>
                    new Date(rowData.RaisedDate).toLocaleDateString()
                  }
                />
                <Column field="TypeName" header="Type" />
                <Column
                  field="Desrp"
                  header="Description"
                  body={(rowData) => (
                    <div
                      className="position-relative"
                      title={rowData.Desrp} // Using native HTML title for tooltip
                      style={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        cursor: "pointer",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      // Remove the ref and onMouseLeave handlers that use bootstrap
                    >
                      {rowData.Desrp}
                    </div>
                  )}
                />
                <Column field="RouteId" header="Route ID" />
                <Column field="ActionBy" header="Last Action By" />
                <Column
                  field="Status"
                  header="Status"
                  body={(rowData) => (
                    <span
                      className={`badgee ${
                        rowData &&
                        rowData.Status &&
                        rowData.Status.toLowerCase() === "open"
                          ? "badge_warning"
                          : "badge_muted"
                      }`}
                    >
                      {rowData && rowData.Status ? rowData.Status : "N/A"}
                    </span>
                  )}
                />
                <Column
                  header="Action"
                  body={(rowData) => (
                    <button
                      data-bs-toggle="offcanvas"
                      data-bs-target="#raise_Reopen"
                      aria-controls="offcanvasRightReope"
                      className={`btn btn-sm ${
                        rowData &&
                        rowData.Status &&
                        rowData.Status.toLowerCase() === "closed"
                          ? "btn-outline-success"
                          : "btn-outline-danger"
                      }`}
                      onClick={() =>
                        rowData &&
                        rowData.ReOpenStatus &&
                        handleReopen(rowData.TicketNo)
                      }
                      disabled={!rowData.ReOpenStatus}
                    >
                      <span style={{ whiteSpace: "nowrap" }}>
                        {rowData.StatusText}
                      </span>
                    </button>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      {/* // Offcanvas component reopen*/}
      <div
        className={`offcanvas offcanvas-end ${isOffcanvasOpen ? "show" : ""}`}
        tabIndex="-1"
        id="raise_Reopen"
        aria-labelledby="offcanvasRightReope"
      >
        <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 className="subtitle fw-normal">Re-open Remark</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setIsOffcanvasOpen(false)}
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body px-4">
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label">Ticket No:</label>
              <input
                type="text"
                className="form-control"
                value={selectedTicket || ""}
                readOnly
              />{" "}
              {/* Display the selected ticket number */}
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">
                Please Enter Reason for Reopening this Ticket:
              </label>
              <textarea
                id="reopenRemark"
                className="form-control"
                rows="3"
                placeholder="Please Select"
                value={reopenRemark} // Bind the textarea value to the state
                onChange={(e) => setReopenRemark(e.target.value)} // Update state on change
              ></textarea>
            </div>
          </div>
        </div>
        <div className="offcanvas-footer">
          <button
            className="btn btn-outline-secondary"
            data-bs-dismiss="offcanvas"
            onClick={() => setIsOffcanvasOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-success mx-3"
            onClick={() => {
              handleReopenSave();
              setIsOffcanvasOpen(false);
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* // Offcanvas component reopen */}

      {/* New My Feedback Prime Sidebar */}
      {/* <PrimeSidebar visible={addRaiseFeedback} position="right" 
    showCloseIcon={false} 
    dismissable={false} 
    style={{width:'25%'}}
>
<div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
        <h6 className="sidebarTitle">Dummy Prime Sidebar</h6>
        <Button 
            icon="pi pi-times" 
            className="p-button-rounded p-button-text" 
            onClick={() => {setAddRaiseFeedback(false)}} 
        />
    </div>
    <div className="sidebarBody">
      Dummy
    </div>
    <div className="sidebar-fixed-bottom position-absolute pe-3">
        <div className="d-flex gap-3 justify-content-end">
            <Button label="Cancel" className="btn btn-outline-secondary"/>
            <Button label="Save" className="btn btn-success"/>
        </div>
    </div>
</PrimeSidebar> */}
      {/* New My Feedback Prime Sidebar */}

      {/* <!-- Raise Feedback Rightbar --> */}
      <div
        className={`offcanvas offcanvas-end ${
          isRaiseFeedbackOpen ? "show" : ""
        }`}
        tabIndex="-1"
        id="raise_Feedback"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 className="subtitle fw-normal">Raise Feedback</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            onClick={() => {
              // Clear the fields when the offcanvas is closed
              document.querySelector("#categorySelect").value = "";
              document.querySelector("#complaintTypeSelect").value = "";
              document.querySelector("#travelDate").value = "";
              document.querySelector("#tripIdSelect").value = "";
              setFeedbackText(""); // Clear feedback text
              setIsRaiseFeedbackOpen(false);
              refreshData();
            }}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body px-4">
          <div className="row">
            <div className="col-12 mb-3">
              <label className="form-label" htmlFor="categorySelect">
                Category
              </label>
              <select
                id="categorySelect"
                className="form-select"
                onChange={(e) => handleCategorySelect(e.target.value)}
              >
                <option value="">Please Select</option>
                {categoryDropDown.map((category, index) => (
                  //<option key={category.id} value={category.id}>
                  <option key={`${category.id}-${index}`} value={category.id}>
                    {category.Category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label" htmlFor="complaintTypeSelect">
                Complaint Type
              </label>
              <select id="complaintTypeSelect" className="form-select">
                <option value="">Please Select</option>
                {complaintTypeDropDown.map((type, index) => (
                  //<option key={type.id} value={type.id}>
                  <option key={`${type.id}-${index}`} value={type.id}>
                    {type.CompName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label" htmlFor="travelDate">
                Travel Date
              </label>
              <input type="date" id="travelDate" className="form-control" />
            </div>
            <div className="col-12 mb-3" style={{ display: "none" }}>
              <label className="form-label" htmlFor="tripIdSelect">
                Trip Id (Optional)
              </label>
              <select id="tripIdSelect" className="form-select" defaultValue="">
                <option value="">Please Select</option>
              </select>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label" htmlFor="feedbackTextArea">
                Feedback
              </label>
              <textarea
                id="feedbackTextArea"
                className="form-control"
                rows="3"
                placeholder="Please Select"
                value={feedbackText} // Bind the textarea value to the state
                onChange={(e) => setFeedbackText(e.target.value)} // Update state on change
              ></textarea>
            </div>
          </div>
        </div>
        <div className="offcanvas-footer">
          <button
            className="btn btn-outline-secondary"
            data-bs-dismiss="offcanvas"
            onClick={() => {
              setIsRaiseFeedbackOpen(false);
              refreshData();
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-success mx-3"
            onClick={handleSubmitFeedback}
          >
            Submit
          </button>
        </div>
      </div>
      {/* <!-- Raise Feedback Rightbar  --> */}
      {/* <!-- Ticket Number Rightbar  --> */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="ticketNumber"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title subtitle_sm">
            <small className="overline_text d-block text-secondary">
              Ticket No. - {selectedTicket}
            </small>
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {ticketReplies.map((reply, index) => (
            <div className="ticketBx" key={index}>
              <small>
                {new Date(reply.UpdatedAt).toLocaleString()}
                <span>
                  By {reply.empCode} - {reply.empName}
                </span>
              </small>
              <p>{reply.Descp}</p>
            </div>
          ))}
        </div>
      </div>
      {/* <!-- Ticket Number Rightbar  -->*/}
      <Notifications />
    </div>
  );
};

export default MyFeedback;
