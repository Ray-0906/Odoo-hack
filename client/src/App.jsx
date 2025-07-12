import React from 'react'
import { Outlet } from "react-router-dom";
import StackItNavbar from './components/Navbar';
const App = () => {
  return (
    <>
       < StackItNavbar />
      <Outlet/>
    </>
  )
}

export default App
