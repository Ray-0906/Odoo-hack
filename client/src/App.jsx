import React from 'react'
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div>
       <div className="text-2xl text-center text-blue-500">Hello Tailwind!</div>
      <Outlet/>
    </div>
  )
}

export default App
