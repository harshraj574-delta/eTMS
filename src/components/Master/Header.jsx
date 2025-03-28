import React from "react";
import PropTypes from 'prop-types';
import sessionManager from '../../utils/SessionManager';
const Header = ({pageTitle,showAdhocButton=false,showNewButton=false,onNewButtonClick}) => {
// Get user data from SessionManager
const userData = sessionManager.getUserSession();
const employeeName = userData.empName || 'Guest';
return (
    <div className="header">
    <div className="logo"><img src="images/logo.svg" alt="" /></div>
    <div className="header-mid">
      {/* <div className="breadcrumb-cnt">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item text1-body"><a href="#">Etms</a></li>
          <li className="breadcrumb-item text1-body active" aria-current="page">{pageTitle}</li>
        </ol>
        <span className="subtitle"><strong className="text-grey5">{pageTitle}</strong></span>
      </div> */}
      {showAdhocButton && (
      <button className="btn btn-primary ms-auto" data-bs-toggle="offcanvas" data-bs-target="#addAdhoc" aria-controls="addAdhoc">
        <span className="material-icons me-2">add_circle</span> add Adhoc</button>
      )}
       {showNewButton && (
      <button className="btn btn-primary ms-auto" data-bs-toggle="offcanvas" data-bs-target="#raise_Feedback" onClick={onNewButtonClick} aria-controls="offcanvasRight">
        <span className="material-icons me-2">add_circle</span> New
      </button>
      )}
      <ul className="link-right">
        <li><a href="#!"><span className="material-icons">grid_view</span></a></li>
        <li><a href="#!" className="company_logo"><img src="images/logo.svg" alt="" /></a></li>
        <li><a href="#!" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
          <span className="notifications-value"><span className="material-icons">notifications</span></span>
        </a></li>
        <li className="dropdown">
          <a href="#!" data-bs-toggle="offcanvas" data-bs-target="#profileSidebar" aria-controls="profileSidebar">
            <img src="public\images\solar--user-circle-outline.svg" alt="" /> {employeeName}
         </a>

        </li>
      </ul>
    </div>
  </div>
);
};
Header.propTypes = {
    pageTitle: PropTypes.string.isRequired,
    showAdhocButton: PropTypes.bool,
    showNewButton: PropTypes.bool,
    onNewButtonClick: PropTypes.func,
  };
export default Header;