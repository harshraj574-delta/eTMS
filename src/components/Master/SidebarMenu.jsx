import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="accordion mb-5" id="accordionExample">
        <div className="accordion-item border-0">              
          <a href="#!" className="accordion-button overline_textB" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <span className="material-icons">switch_account</span> My ETMS
          </a>              
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <ul>
              <a href="/Dashboard" className="active">Dashboard</a>
              <a href="#">Schedules</a>
              <a href="#">ADHOC'S Management</a>
              <a href="./MyNoShow">My No Shows</a>
              <a href="./MyFeedback">My Feedbacks</a>
            </ul>
          </div>
        </div>
        {/* ... Other accordion items ... */}
      </div>

      <div className="cardx help p-3">
        <span className="material-icons mb-3">help</span>
        <p className="overline_text_sm">Need help?</p>
        <p className="small mt-2 mb-3">Please connect with our support team.</p>
        <div className="d-grid">
          <button className="btn btn-sm btn-outline-secondary fw-bold"><small>GET IN TOUCH</small></button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;