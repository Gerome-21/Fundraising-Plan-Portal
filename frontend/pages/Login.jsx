import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: '',
    user_name: '',
    pin: ''
  });

  const handleChange = (e) => {
    const { placeholder, value } = e.target;
    
    if (placeholder === 'Organization Name') {
      setFormData(prev => ({ ...prev, organization_name: value }));
    } else if (placeholder === 'User Name') {
      setFormData(prev => ({ ...prev, user_name: value }));
    } else if (placeholder === '6-digit PIN') {
      const numericValue = value.replace(/[^a-zA-Z0-9]/g, '');
      if (numericValue.length <= 6) {
        setFormData(prev => ({ ...prev, pin: numericValue }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.organization_name || !formData.user_name || !formData.pin) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.pin.length !== 6) {
      toast.error('PIN must be exactly 6 digits');
      setLoading(false);
      return;
    }

    const success = await login(
      formData.organization_name,
      formData.user_name,
      formData.pin
    );

    if (success) {
      navigate('dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 md:p-0">
      <div className="flex flex-col md:flex-row w-full max-w-7xl shadow-2xl bg-white overflow-hidden min-h-screen">

        {/* LEFT SECTION - FORM*/}
        <div className="w-full md:w-2/5 lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white">
          {/* LOGO*/}
          <div className="mb-6">
            <img 
              src="/akubo.jpg" 
              alt="Akubo Logo" 
              className="h-12 w-auto object-contain rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#121212]">
            Welcome to Akubo
          </h1>
          <p className="text-[#6A6A6A] text-md mt-1 mb-5">Log in your account</p>

          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <div>
              <input 
                type="text" 
                placeholder="Organization Name" 
                value={formData.organization_name}
                onChange={handleChange}
                className="w-full text-md px-2 py-2 border border-[#6A6A6A] rounded-lg focus:ring-2 focus:ring-[#22864D]/30 focus:border-[#22864D] outline-none transition placeholder:text-sm"
                disabled={loading}
              />
            </div>
            
            <div>
              <input 
                type="text" 
                placeholder="User Name" 
                value={formData.user_name}
                onChange={handleChange}
                className="w-full text-md px-2 py-2 border border-[#6A6A6A] rounded-lg focus:ring-2 focus:ring-[#22864D]/30 focus:border-[#22864D] outline-none transition placeholder:text-sm"
                disabled={loading}
              />
            </div>
            
            <div>
              <input 
                type="password" 
                maxLength="6" 
                placeholder="6-digit PIN" 
                value={formData.pin}
                onChange={handleChange}
                className="w-full text-md px-2 py-2 border border-[#6A6A6A] rounded-lg focus:ring-2 focus:ring-[#22864D]/30 focus:border-[#22864D] outline-none transition placeholder:text-sm"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between text-xs mt-2">
              <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-3 h-3 rounded border-gray-400 text-[#22864D] focus:ring-[#22864D]"
                />
                <span>Remember account</span>
              </label>
              <a 
                href="#" 
                className="text-[#22864D] font-medium hover:underline hover:underline-offset-2"
              >
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#22864D] hover:bg-[#22864D]/90 text-white font-bold py-3.5 rounded-lg text-md transition duration-200 shadow-md hover:shadow-lg mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Logging in...' : 'Log in account'}
            </button>
          </form>

          {/* <p className="text-xs text-gray-600 text-center mt-4">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="text-[#22864D] font-semibold hover:underline hover:underline-offset-2"
              >
                Register
              </a>
            </p> */}
        </div>

        {/* RIGHT SECTION */}
        <div 
          className="w-full md:w-3/5 lg:w-3/5 flex flex-col md:items-center p-10 text-white relative 
          bg-[url('/landingbg.svg')] bg-cover bg-center bg-no-repeat"
        >
          <div className="relative z-10 w-full">
            <h2 className="text-xl lg:text-5xl font-semibold">
              Fundraising Plan Portal
            </h2>
           <p className="text-white text-md mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br/>Dolor sit amet, consectetur adipiscing. elit </p>
          </div>

          <img
            src="/image.png"
            alt="Illustration"
            className="ml-22 mt-20 w-full rotate-[-25deg]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;