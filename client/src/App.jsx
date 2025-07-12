import React from 'react'
import { Outlet } from "react-router-dom";
import StackItNavbar from './components/Navbar';
const App = () => {
  return (
    <>
    <div className=' grid grid-rows-[auto_1fr] min-h-screen'>
       < StackItNavbar />
       <div className='container mx-auto px-4 py-8'>
      <Outlet/>
      </div>
      </div>
    </>
  )
}

export default App
