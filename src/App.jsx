import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/Login'
import MyFeedback from './components/MyFeedback'
import MyNoShow from './components/MyNoShow'
import {  Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Dashboard from './components/Dashboard'
import MySchedule from './components/MySchedule'
function App() {


  return (
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/myfeedback' element={<MyFeedback/>} />
      <Route path='/mynoshow' element={<MyNoShow/>} />
      <Route path='/Dashboard' element={<Dashboard/>} />
      <Route path='/MySchedule' element={<MySchedule/>} />
    </Routes>
    
  )
}

export default App
