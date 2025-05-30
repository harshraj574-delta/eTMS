import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiService } from "../../services/api";

const SidebarMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  // Initialize activeMenu as null to prevent initial fluctuation
  const [activeMenu, setActiveMenu] = useState(null);

  // Determine which menu should be active based on current path
  useEffect(() => {
    const path = location.pathname;
    // Check if current path matches any ETMS menu items
    if (["/dashboard", "/Location", "/AdhocManagement", "/ManageEmployee", 
         "/MyAdhocRequest", "/MyFeedback", "/MySchedule", "/ReplicateSchedule"].includes(path)) {
      setActiveMenu("etms");
    } 
    // Check if current path matches any Master menu items
    else if (["/FacilityMaster", "/DriverMaster", "/VehicleMaster", 
              "/VehicleTypeMaster", "/VendorMaster", "/GuardMaster"].includes(path)) {
      setActiveMenu("master");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const userID = sessionStorage.getItem("ID");
        const response = await apiService.Spr_GetMenuItem({ userID });
        const organizedMenu = organizeMenuItems(response);
        setMenuItems(organizedMenu);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Function to organize menu items into parent-child hierarchy
  const organizeMenuItems = (items) => {
    const mainMenu = items.filter(
      (item) => item.ParentId === 0 || !item.ParentId
    );
    const subMenus = items.filter((item) => item.ParentId !== 0);

    return mainMenu.map((menuItem) => ({
      ...menuItem,
      subItems: subMenus.filter(
        (subItem) => subItem.ParentId === menuItem.MenuId
      ),
    }));
  };

  // Toggle menu function
  const toggleMenu = (menuId) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  // ETMS menu items
  const etmsMenuItems = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/Location", name: "Location" },
    { path: "/AdhocManagement", name: "Adhoc Management" },
    { path: "/ManageEmployee", name: "Manage Employee" },
    { path: "/MyAdhocRequest", name: "My Adhoc Request" },
    { path: "/MyFeedback", name: "My Feedback" },
    { path: "/MySchedule", name: "My Schedule" },
    { path: "/ReplicateSchedule", name: "Replicate Schedule" },
    { path: "/ViewMyRoutes", name: "View My Routes" },
  ];

  // Master menu items
  const masterMenuItems = [
    { path: "/FacilityMaster", name: "Facility Master" },
    { path: "/DriverMaster", name: "Driver Master" },
    { path: "/VehicleMaster", name: "Vehicle Master" },
    { path: "/VehicleTypeMaster", name: "Vehicle Type Master" },
    { path: "/VendorMaster", name: "Vendor Master" },
    { path: "/GuardMaster", name: "Guard Master" },
  ];

  return (
    <div className="sidebar">
      {loading ? (
        <div className="sidebar-loader">Loading menu...</div>
      ) : error ? (
        <div className="sidebar-error">Error: {error}</div>
      ) : (
        <>
          <div className="accordion mb-5" id="accordionExample">
            {/* ETMS Menu Section */}
            <div className="accordion-item border-0">
              <a
                href="#!"
                className={`accordion-button overline_textB ${activeMenu === "etms" ? "" : "collapsed"}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu("etms");
                }}
              >
                <span className="material-icons">switch_account</span> My ETMS
              </a>
              <div
                id="collapseOne"
                className={`accordion-collapse collapse ${activeMenu === "etms" ? "show" : ""}`}
              >
                <ul className="submenu">
                  {etmsMenuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.path}
                        className={location.pathname === item.path ? "active" : ""}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Master Menu Section */}
            <div className="accordion-item border-0">
              <a
                href="#!"
                className={`accordion-button overline_textB ${activeMenu === "master" ? "" : "collapsed"}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleMenu("master");
                }}
              >
                <span className="material-icons">settings</span> Master
              </a>
              <div
                id="collapseTwo"
                className={`accordion-collapse collapse ${activeMenu === "master" ? "show" : ""}`}
              >
                <ul className="submenu">
                  {masterMenuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.path}
                        className={location.pathname === item.path ? "active" : ""}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="cardx help p-3">
            <span className="material-icons mb-3">help</span>
            <p className="overline_text_sm">Need help?</p>
            <p className="small mt-2 mb-3">Please connect with our support team.</p>
            <div className="d-grid">
              <button className="btn btn-sm btn-outline-secondary fw-bold">
                <small>GET IN TOUCH</small>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SidebarMenu;
