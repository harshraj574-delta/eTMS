import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiService } from '../../services/api';


const SidebarMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const userID = sessionStorage.getItem('ID');
        const response = await apiService.Spr_GetMenuItem({ userID });

        // console.log('Menu Items:', response); 

        // Organize menu items into hierarchy
        const organizedMenu = organizeMenuItems(response);
        setMenuItems(organizedMenu);
      } catch (err) {
        console.error('Failed to fetch menu items:', err);
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Function to organize menu items into parent-child hierarchy
  const organizeMenuItems = (items) => {
    const mainMenu = items.filter(item => item.ParentId === 0 || !item.ParentId);
    const subMenus = items.filter(item => item.ParentId !== 0);

    return mainMenu.map(menuItem => ({
      ...menuItem,
      subItems: subMenus.filter(subItem => subItem.ParentId === menuItem.MenuId)
    }));
  };

  // Render submenu items
  const renderSubMenuItems = (subItems) => {
    if (!subItems || subItems.length === 0) return null;

    return (
      <ul className="submenu">
        {subItems.map(subItem => (
          <li key={subItem.MenuId}>
            <Link
              to={subItem.MenuURL || '#'}
              className={location.pathname === subItem.MenuURL ? 'active' : ''}
            >
              {subItem.IconClass && (
                <span className="material-icons"></span>//{subItem.IconClass}
              )}
              {subItem.MenuName}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  // Render main menu items with their submenus
  const renderMenuItems = (items) => {
    return items.map((item) => (
      <div key={item.MenuId} className="menu-item">
        <div className="accordion-item border-0">
          <a
            href="#!"
            className={`accordion-button ${item.subItems?.length ? '' : 'no-submenu'} overline_textB collapsed`}
            data-bs-toggle={item.subItems?.length ? 'collapse' : ''}
            data-bs-target={`#collapse${item.MenuId}`}
            aria-expanded="false"
            aria-controls={`collapse${item.MenuId}`}
          >
            {item.IconClass && (
              <span className="material-icons">{item.IconClass}</span>
            )}
            {item.MenuName}
          </a>
          {item.subItems?.length > 0 && (
            <div
              id={`collapse${item.MenuId}`}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              {renderSubMenuItems(item.subItems)}
            </div>
          )}
        </div>
      </div>
    ));
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sidebar">
      <div className="accordion mb-5" id="accordionExample">
        {renderMenuItems(menuItems)}
      </div>

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
    </div>
  );
};

export default SidebarMenu;