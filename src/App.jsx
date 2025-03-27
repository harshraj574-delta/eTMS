import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/Login'
import MyFeedback from './components/MyFeedback'
import MyNoShow from './components/MyNoShow'
import {  Routes, Route } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dashboard from './components/Dashboard'
import MySchedule from './components/MySchedule'
import ManageEmployee from './components/ManageEmployee'
import ReplicateSchedule from './components/ReplicateSchedule'
import DriverMaster from './components/DriverMaster'
import VehicleMaster from './components/VehicleMaster'
import VendorMaster from './components/VendorMaster'
import GuardMaster from './components/GuardMaster'
import VehicleTypeMaster from './components/VehicleTypeMaster'
import AdhocManagement from './components/AdhocManagement'
import "primereact/resources/themes/saga-blue/theme.css"

// Deepak
import Location from './components/MasterPages/Location';
import FacilityMaster from './components/MasterPages/FacilityMaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
function App() {
  return (

    <>
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/myfeedback' element={<MyFeedback/>} />
      <Route path='/mynoshow' element={<MyNoShow/>} />
      <Route path='/Dashboard' element={<Dashboard/>} />
      <Route path='/MySchedule' element={<MySchedule/>} />
      <Route path='/ManageEmployee' element={<ManageEmployee />} />
      <Route path='/ReplicateSchedule' element={<ReplicateSchedule/>}/>
      <Route path='/DriverMaster' element={<DriverMaster/>}/>
      <Route path='/VehicleMaster' element={<VehicleMaster/>}/>
      <Route path='/VendorMaster' element={<VendorMaster/>}/>   
      <Route path='/GuardMaster' element={<GuardMaster/>}/>    
      <Route path='/VehicleTypeMaster' element={<VehicleTypeMaster/>}/> 
      <Route path='/AdhocManagement' element={<AdhocManagement/>}/>

      {/* Deepak */}
      <Route path='/Location' element={<Location/>} />
      <Route path='/FacilityMaster' element={<FacilityMaster/>} />
    </Routes>

    </>
    
  )
}

export default App
