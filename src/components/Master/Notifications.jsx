import React from "react";
const Notifications = () => {
return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel" className="subtitle_sm">Notifications</h5>
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        {/* Tabs start */}
        <ul className="nav nav-fill mb-3 sidebarTab" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <a className="nav-link active" id="pills-alerts-tab" data-bs-toggle="pill" data-bs-target="#pills-alerts" type="button" role="tab" aria-controls="pills-alerts" aria-selected="true">Alerts</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className="nav-link" id="pills-announcements-tab" data-bs-toggle="pill" data-bs-target="#pills-announcements" type="button" role="tab" aria-controls="pills-announcements" aria-selected="false">Announcements <span className="new-alert"></span> </a>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div className="tab-pane fade show active" id="pills-alerts" role="tabpanel" aria-labelledby="pills-alerts-tab">
            <div className="no_data">
              <img src="images/notification.png" alt="" />
              <p className="overline_text">You don’t have any notifications</p>
            </div>
            {/* Uncomment and use the following list if there are alerts */}
            {/* <ul className="alert_list">
              <li>
                Welcome to etms John Doe
                <small>We are very delighted to see you here. Please get in touch with us if you have any query or issue regarding emts.</small>
              </li>
              <li>
                Adhoc request approved
                <small>It is a long established fact that a reader will be distracted by the readable content of a page when looking.</small>
              </li>
              <li>
                Your average trip hours report generated
                <small>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.</small>
              </li>
              <li>
                IPM conjuctions
                <small>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece</small>
              </li>
            </ul> */}
          </div>
          <div className="tab-pane fade" id="pills-announcements" role="tabpanel" aria-labelledby="pills-announcements-tab">
            <ul className="alert_list">
              <li>
                Welcome to etms John Doe
                <small>We are very delighted to see you here. Please get in touch with us if you have any query or issue regarding emts.</small>
              </li>
              <li>
                Adhoc request approved
                <small>It is a long established fact that a reader will be distracted by the readable content of a page when looking.</small>
              </li>
              <li>
                Your average trip hours report generated
                <small>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.</small>
              </li>
              <li>
                IPM conjuctions
                <small>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece</small>
              </li>
            </ul>
          </div>
        </div>
        {/* Tabs end */}
      </div>
    </div>
);
};
export default Notifications;