import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiLogOut, FiMenu, FiStar, FiUser, FiX } from 'react-icons/fi';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4 px-4 sm:px-8 lg:px-12 flex items-center justify-between z-50">
      {/* Logo Section */}
      <Link to="/form" className="flex items-center space-x-3 group">
        <div className="relative">
          <img 
            src="/akubo.jpg" 
            alt="Akubo Logo"
            className="h-12 rounded-full w-auto transform group-hover:scale-110 transition-all duration-300"
          />
          <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
        </div>
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#22864D] to-green-500 bg-clip-text text-transparent">
            Akubo Software
          </span>
          <p className="text-xs font-semibold text-gray-500 -mt-1">Fundraising Plan Portal</p>
        </div>
      </Link>

      <div className="hidden lg:flex items-center space-x-8">
        <Link 
          to="/form"
          className="text-md text-[#001033] hover:text-green-600 transition-colors font-medium relative group"
        >
          Home
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link 
          to="/plan"
          className="text-md text-[#001033] hover:text-green-600 transition-colors font-medium relative group"
        >
          Plan
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link 
          to="/report"
          className="text-md text-[#001033] hover:text-green-600 transition-all font-medium relative group"
        >
          Report
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        
        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
          {user && (
            <div className='flex flex-col'>
              <p className="text-sm text-gray-600">
                {user.organization_name}
              </p>
              <span className="flex gap-1 text-xs text-green-900">
                <p><FiUser/></p>
                <p>{user.user_name}</p>
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#22864D] to-green-500 hover:from-red-700 hover:to-[#650303] text-white px-3 py-2 rounded-xl hover:shadow-xl transition-all font-medium"
          >
            <FiLogOut className='w-4 h-4'/>
          </button>
        </div>
      </div>

      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden text-[#001033] p-2"
      >
        {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg lg:hidden">
          <div className="px-4 py-4 space-y-4">
            <Link 
              to="/form"
              className="block text-[#001033] hover:text-green-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/plan"
              className="block text-[#001033] hover:text-green-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Plan
            </Link>
            <Link 
              to="/report"
              className="block text-[#001033] hover:text-green-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Report
            </Link>
            
            {user && (
              <div className="text-sm text-gray-600 py-2 border-t border-gray-100">
                Logged in as: {user.user_name}
              </div>
            )}
            
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-[#22864D] to-green-500 hover:from-red-700 hover:to-[#650303] text-white py-3 rounded-lg text-center"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;