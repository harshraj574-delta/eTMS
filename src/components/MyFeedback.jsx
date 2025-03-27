import React, { useState, useEffect } from "react";
import Sidebar from "./Master/SidebarMenu";
import Notifications from "./Master/Notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import "../components/css/style.css";
import Header from "./Master/Header";
import { apiService } from "../services/api";
import sessionManager from '../utils/SessionManager.js';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import { Paginator } from 'primereact/paginator';

const MyFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketReplies, setTicketReplies] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [categoryDropDown, setCategoryDropDown] = useState([]);
  const [complaintTypeDropDown, setComplaintTypeDropDown] = useState([]);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [isRaiseFeedbackOpen, setIsRaiseFeedbackOpen] = useState(false); // State for Raise Feedback offcanvas
  const [feedbackText, setFeedbackText] = useState(''); // State for feedback text
  const [reopenRemark, setReopenRemark] = useState(''); // State for the remark entered in the offcanvas

  const handleReopen = (ticketNo) => {
    setSelectedTicket(ticketNo); // Set the selected ticket number
    setIsOffcanvasOpen(true); // Open the offcanvas
  };
  useEffect(() => {
    fetchFeedbackData();
    fetchCategories();
    refreshData();
    //fetchComplaintType();
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
        throw new Error('ComplaintCategoryID is not available. Please select a category first.');
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

    const ticketNo = selectedTicket; // Assuming you have the selected ticket number
    const desc = feedbackText; // Use the feedbackText state for the description
    const actionid = 0; // Set the appropriate action ID if needed
    const statusid = 0; // Set the appropriate status ID if needed
    const FeedTypeId = document.querySelector('.form-select').value; // Get selected complaint type ID
    const RaisedDate = new Date().toISOString(); // Current date as raised date
    const RaisedById = sessionManager.getUserSession()?.ID; // Assuming you have the user ID from the session
    const RouteId = ""; // Set the appropriate route ID if needed

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
      // Optionally, you can show a success message or close the offcanvas
      setIsRaiseFeedbackOpen(false);
      refreshData(); // Refresh data if needed
    } catch (error) {
      console.error("Error submitting feedback:", error);
      // Optionally, show an error message to the user
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
      setReopenRemark('');
      setIsOffcanvasOpen(false); // Close the offcanvas
      // Optionally, refresh data or show a success message
    } catch (error) {
      console.error("Error submitting reopen remark:", error);
      // Optionally, show an error message to the user
    }
  };


  const RaisedDateBodyTemplate = (feedback) => {
    return <>
      {new Date(feedback.RaisedDate).toLocaleDateString()}
    </>
  };

  // const StatusData = ({ Status }) => {
  //   const statusClass = Status.toLowerCase() === "open" ? "badge_warning" : "badge_muted";
  
  //   return (
  //     <span className={`badgee ${statusClass}`}>
  //       {Status}
  //     </span>
  //   );
  // };
  

  const StatusData = ({ Status }) => {
    return <Badge value={Status} severity={Status.toLowerCase() === "open "? "warning" : "secondary"} />;
  };

  const ActionData = ({Action}) => {
    return <Badge value={Action} severity={Action.toLowerCase() === "re-open" ? "danger" : "info"} />;
  }

  // const ActionData = ({ Action }) => (
  //   <Badge value={Action} severity={Action.toLowerCase() === "re-open" ? "danger" : "info"} />
  // );
  


  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <Header pageTitle={"My Feedback"} showNewButton={true} />

      {/* Sidebar */}
      <Sidebar />

      {/* Middle Content */}
      <div className="middle">
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col">
                <div className="cardx p-3 bg-secondary text-white">
                  <h3>
                    <strong>16</strong>
                  </h3>
                  <span className="subtitle_sm">Total Feedbacks</span>
                </div>
              </div>
              <div className="col">
                <div className="cardx p-3">
                  <h3>
                    <strong className="text-warning">04</strong>
                  </h3>
                  <span className="subtitle_sm">Open Tickets</span>
                </div>
              </div>
              <div className="col">
                <div className="cardx p-3">
                  <h3>
                    <strong className="text-dark text-opacity-50">0</strong>
                  </h3>
                  <span className="subtitle_sm">Closed Tickets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="row">
          <div className="col-12">
            <div className="card_tb">

              {/* <DataTable value={feedbackData} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} filterDisplay="row" loading={loading} emptyMessage="No customers found." showGridlines stripedRows>
                <Column sortable filter filterPlaceholder="Search by Ticket No" field="TicketNo" header="Ticket No"></Column>
                <Column sortable body={RaisedDateBodyTemplate} header="Shift Date"></Column> 
                <Column sortable field="TypeName" header="Type"></Column>
                <Column sortable field="Desrp" header="Description"></Column>
                <Column sortable field="RouteId" header="Route ID"></Column>
                <Column sortable field="ActionBy" header="Last Action By"></Column>
                <Column sortable header="Status" body={StatusData}></Column>
                <Column sortable header="Action"></Column>
              </DataTable> */}


              <table className="table mt-5" id="example">
                <thead>
                  <tr>
                    {/* <th width="4%"></th> */}
                    <th>Ticket No.</th>
                    <th>Shift Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Route ID</th>
                    <th>Last Action By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="text-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : feedbackData.length > 0 ? (
                    feedbackData.map((feedback, index) => (
                      <tr
                        key={index}
                        className={
                          feedback.Status.toLowerCase() === "closed"
                            ? "column"
                            : ""
                        }
                      >
                        <td>
                          <a
                            href="#!"
                            className="btn-text"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#ticketNumber"
                            aria-controls="offcanvasRight"
                            onClick={() =>
                              fetchTicketReplies(feedback.TicketNo)
                            }
                          >
                            <span className="ms-3">{feedback.TicketNo}</span>
                          </a>
                        </td>
                        <td>
                          {new Date(feedback.RaisedDate).toLocaleDateString()}
                        </td>
                        <td>{feedback.TypeName}</td>
                        <td title={feedback.Desrp} style={{ maxWidth: '200px', overflow: 'hidden', cursor: 'pointer', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {feedback.Desrp}
                        </td>
                        <td>{feedback.RouteId}</td>
                        <td>{`${feedback.ActionBy}`}</td>
                        <td>
                          <span
                            className={`badgee ${feedback.Status.toLowerCase() === "open"
                              ? "badge_warning"
                              : "badge_muted"
                              }`}
                          >
                            {feedback.Status}
                          </span>
                        </td>
                        <td>
                          <button
                            data-bs-toggle="offcanvas"
                            data-bs-target="#raise_Reopen"
                            aria-controls="offcanvasRightReope"
                            className={`btn btn-sm ${feedback.Status.toLowerCase() === "closed"
                              ? "btn-outline-success"
                              : "btn-outline-danger"}`}
                            onClick={() => feedback.ReOpenStatus && handleReopen(feedback.TicketNo)}
                            disabled={!feedback.ReOpenStatus}
                          >
                            <span style={{ whiteSpace: 'nowrap' }}>{feedback.StatusText}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No feedback data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* // Offcanvas component reopen*/}
      <div className={`offcanvas offcanvas-end ${isOffcanvasOpen ? 'show' : ''}`} tabindex="-1" id="raise_Reopen" aria-labelledby="offcanvasRightReope"
        onHide={() => { setIsOffcanvasOpen(false); refreshData(); }}>
        <div class="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 class="subtitle fw-normal">Re-open Remark</h5>
          <button type="button" class="btn-close btn-close-white" onClick={() => setIsOffcanvasOpen(false)} data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body px-4">
          <div class="row">
            <div className="col-12 mb-3">
              <label className="form-label">Ticket No:</label>
              <input type="text" className="form-control" value={selectedTicket || ''} readOnly /> {/* Display the selected ticket number */}
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Please Enter Reason for Reopening this Ticket:</label>
              <textarea class="form-control" rows="3" placeholder="Please Select"
                value={reopenRemark} // Bind the textarea value to the state
                onChange={(e) => setReopenRemark(e.target.value)} // Update state on change
              ></textarea>
            </div>
          </div>
        </div>
        <div class="offcanvas-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="offcanvas" onClick={() => setIsOffcanvasOpen(false)}>Cancel</button>
          <button class="btn btn-success mx-3" onClick={handleReopenSave}>Save</button>
        </div>
      </div>

      {/* // Offcanvas component reopen */}
      {/* <!-- Raise Feedback Rightbar --> */}
      <div
        class={`offcanvas offcanvas-end ${isRaiseFeedbackOpen ? 'show' : ''}`}
        tabindex="-1"
        id="raise_Feedback"
        aria-labelledby="offcanvasRightLabel"
        onHide={() => { setIsRaiseFeedbackOpen(false); refreshData(); }}
      >
        <div class="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 class="subtitle fw-normal">Raise Feedback</h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="offcanvas" onClick={() => { setIsRaiseFeedbackOpen(false); refreshData(); }}
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body px-4">
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Category</label>
              <select class="form-select" onChange={(e) => handleCategorySelect(e.target.value)}>
                <option value="">Please Select</option>
                {categoryDropDown.map((category, index) => (
                  //<option key={category.id} value={category.id}>
                  <option key={`${category.id}-${index}`} value={category.id}>
                    {category.Category}
                  </option>
                ))}
              </select>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Complaint Type</label>
              <select class="form-select">
                <option value="">Please Select</option>
                {complaintTypeDropDown.map((type, index) => (
                  //<option key={type.id} value={type.id}>
                  <option key={`${type.id}-${index}`} value={type.id}>
                    {type.CompName}
                  </option>
                ))}
              </select>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Travel Date</label>
              <input type="date" className="form-control" />
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Trip Id (Optional)</label>
              <select class="form-select">
                <option selected>Please Select</option>
              </select>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Feedback</label>
              <textarea
                class="form-control"
                rows="3"
                placeholder="Please Select"
                value={feedbackText} // Bind the textarea value to the state
                onChange={(e) => setFeedbackText(e.target.value)} // Update state on change
              ></textarea>
            </div>
          </div>
        </div>
        <div class="offcanvas-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="offcanvas" onClick={() => { setIsRaiseFeedbackOpen(false); refreshData(); }}>
            Cancel
          </button>
          <button class="btn btn-success mx-3" onClick={handleSubmitFeedback}>Submit</button>
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
