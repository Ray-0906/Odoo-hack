import React from 'react'
import { Outlet } from "react-router-dom";
import StackItNavbar from './components/Navbar';
import { useLocation } from 'react-router-dom';
const App = () => {
   const location = useLocation();
  return (
    <>
    <div >
         <StackItNavbar loc={location} />
       <div className=' mx-auto pt-16 '>
      <Outlet/>
      </div>
      </div>
    </>
  )
}

export default App
