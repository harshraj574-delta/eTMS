import React from 'react';
import Sidebar from './Master/SidebarMenu';
import Notifications from './Master/Notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/style.css';
import Header from './Master/Header';
const MyFeedback = () => {
  return (
    <div className="container-fluid p-0">
      {/* Header */}
     <Header pageTitle={"My Feedback"} />

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
                  {/* Table rows can be mapped from a data array */}
                  <tr>
                    <td>
                      <a href="#!" className="btn-text" data-bs-toggle="offcanvas" data-bs-target="#ticketNumber" aria-controls="offcanvasRight">
                        <span className="material-icons">question_answer</span><span className="new-alert-oi"></span>
                      </a>
                    </td>
                    <td>
                      <a href="#!" className="btn-text" data-bs-toggle="offcanvas" data-bs-target="#ticketNumber" aria-controls="offcanvasRight">
                        <span className="ms-3">F20230089</span>
                      </a>
                    </td>
                    <td>06/28/2023</td>
                    <td>Vehicle Related Issues</td>
                    <td>vehicle in bad condition</td>
                    <td>223477R0001</td>
                    <td>Sharat Jain - Jun 28 2023 5:49PM</td>
                    <td><span className="badgee badge_warning">Open</span></td>
                    <td><button className="btn btn-sm btn-outline-danger">Revoke</button></td>
                  </tr>
                  {/* Add more rows as needed */}
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
            <input type="date" className="form-control"/>
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
<Notifications />
    </div>
  );
};

export default MyFeedback;