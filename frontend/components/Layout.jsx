import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      {/* Main content*/}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar/>
        <div className={"flex-1 overflow-y-auto pt-1 transition-all duration-300"}>
          <div className="p-6 min-h-full bg-[#F5F5F5]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;