import React, { useState, useEffect } from 'react';
import Sidebar from './Master/SidebarMenu';
import Notifications from './Master/Notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/style.css';
import Header from './Master/Header';
import { apiService } from '../services/api';

const MyFeedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketReplies, setTicketReplies] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const handleRevoke = async (statusText) => {
    try {
      console.log('Status Text clicked:', statusText);
      // Add your API call or status update logic here
    } catch (error) {
      console.error('Error handling status change:', error);
    }
  };
  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const data = await apiService.Spr_sprSelectFeedBack({});
      setFeedbackData(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      // You might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketReplies = async (ticketNo) => {
    try {
      console.log('Fetching replies for ticket:', ticketNo); // Added log
      const replies = await apiService.Spr_sprSelectReply({
        ticketNo: ticketNo
      });
      console.log('Received replies:', replies); // Added log
      setTicketReplies(replies);
      setSelectedTicket(ticketNo);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  // const handleRevoke = async (ticketNo) => {
  //   // Implement revoke functionality here
  //   console.log('Revoking ticket:', ticketNo);
  // };

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
                  <h3><strong>16</strong></h3>
                  <span className="subtitle_sm">Total Feedbacks</span>
                </div>
              </div>
              <div className="col">
                <div className="cardx p-3">
                  <h3><strong className="text-warning">04</strong></h3>
                  <span className="subtitle_sm">Open Tickets</span>
                </div>
              </div>
              <div className="col">
                <div className="cardx p-3">
                  <h3><strong className="text-dark text-opacity-50">0</strong></h3>
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
              <table className="table" id="example">
                <thead>
                  <tr>
                    <th width="4%"></th>
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
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : feedbackData.length > 0 ? (
                    feedbackData.map((feedback, index) => (
                      <tr key={index} className={feedback.Status.toLowerCase() === 'closed' ? 'column' : ''}>
                        <td>
                          <a href="#!" className="btn-text" data-bs-toggle="offcanvas" data-bs-target="#ticketNumber" aria-controls="offcanvasRight" onClick={() => fetchTicketReplies(feedback.TicketNo)}>
                            <span className="material-icons">question_answer</span>
                            <span className="new-alert-oi"></span>
                          </a>
                        </td>
                        <td>
                          <a
                            href="#!"
                            className="btn-text"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#ticketNumber"
                            aria-controls="offcanvasRight"
                            onClick={() => fetchTicketReplies(feedback.TicketNo)}
                          >
                            <span className="ms-3">{feedback.TicketNo}</span>
                          </a>
                        </td>
                        <td>{new Date(feedback.RaisedDate).toLocaleDateString()}</td>
                        <td>{feedback.TypeName}</td>
                        <td>{feedback.Desrp}</td>
                        <td>{feedback.RouteId}</td>
                        <td>{`${feedback.ActionBy}`}</td>
                        <td>
                          <span className={`badgee ${feedback.Status.toLowerCase() === 'open' ? 'badge_warning' : 'badge_muted'}`}>
                            {feedback.Status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`btn btn-sm ${feedback.Status.toLowerCase() === 'open' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            onClick={() => handleRevoke(feedback.StatusText)}
                          >
                            {feedback.StatusText}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">No feedback data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Raise Feedback Rightbar --> */}
      <div class="offcanvas offcanvas-end" tabindex="-1" id="raise_Feedback" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 class="subtitle fw-normal">Raise Feedback</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body px-4">
          <div class="row">
            <div class="col-12 mb-3">
              <label class="form-label">Category</label>
              <select class="form-select">
                <option selected>Please Select</option>
              </select>
            </div>
            <div class="col-12 mb-3">
              <label class="form-label">Complaint Type</label>
              <select class="form-select">
                <option selected>Please Select</option>
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
              <textarea class="form-control" rows="3" placeholder="Please Select"></textarea>
            </div>
          </div>
        </div>
        <div class="offcanvas-footer">
          <button class="btn btn-outline-secondary" data-bs-dismiss="offcanvas">Cancel</button>
          <button class="btn btn-success mx-3">Submit</button>
        </div>
      </div>
      {/* <!-- Raise Feedback Rightbar  --> */}
      {/* <!-- Ticket Number Rightbar  --> */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="ticketNumber" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title subtitle_sm">
            <small className="overline_text d-block text-secondary">
              Ticket No. - {selectedTicket}
            </small>
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          {ticketReplies.map((reply, index) => (
            <div className="ticketBx" key={index}>
              <small>
                {new Date(reply.UpdatedAt).toLocaleString()}
                <span>By {reply.empCode} - {reply.empName}</span>
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