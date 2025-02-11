import React from "react";
import PropTypes from 'prop-types';

const Header = ({pageTitle}) => {
return (
    <div className="header">
    <div className="logo"><img src="images/logo.svg" alt="" /></div>
    <div className="header-mid">
      <div className="breadcrumb-cnt">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item text1-body"><a href="#">Etms</a></li>
          <li className="breadcrumb-item text1-body active" aria-current="page">My Feedback</li>
        </ol>
        <span className="subtitle"><strong className="text-grey5">{pageTitle}</strong></span>
      </div>

      <button className="btn btn-primary ms-auto" data-bs-toggle="offcanvas" data-bs-target="#raise_Feedback" aria-controls="offcanvasRight">
        <span className="material-icons me-2">add_circle</span> New
      </button>

      <ul className="link-right">
        <li><a href="#!"><span className="material-icons">grid_view</span></a></li>
        <li><a href="#!" className="company_logo"><img src="images/accenture-logo.png" alt="" /></a></li>
        <li><a href="#!" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
          <span className="notifications-value"><span className="material-icons">notifications</span></span>
        </a></li>
        <li className="dropdown">
          <a href="#!" data-bs-toggle="offcanvas" data-bs-target="#profileSidebar" aria-controls="profileSidebar">
            <img src="images/ali.png" alt="" /> John Doe
          </a>
        </li>
      </ul>
    </div>
  </div>
);
};
Header.propTypes = {
    pageTitle: PropTypes.string.isRequired,
  };
export default Header;