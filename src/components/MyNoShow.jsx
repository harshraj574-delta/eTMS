import React from "react";
import Sidebar from './Master/SidebarMenu';
import Notifications from './Master/Notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/style.css';
import Header from './Master/Header';
const MyNoShow = () => {
    return(
    <div className="container-fluid p-0">
       {/* Header */}
       <Header pageTitle={"My No Shows"} />

         {/* Sidebar */}
          <Sidebar />

    </div>
);
};
export default MyNoShow;