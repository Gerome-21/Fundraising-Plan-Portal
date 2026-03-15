import React, { useState } from 'react'
import toast from 'react-hot-toast'
import supabase from '../src/supabase-connect'
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organization_name: '',
    user_name: '',
    pin: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { placeholder, value } = e.target
    
    // Map placeholder to field names
    if (placeholder === 'Organization Name') {
      setFormData(prev => ({ ...prev, organization_name: value }))
    } else if (placeholder === 'User Name') {
      setFormData(prev => ({ ...prev, user_name: value }))
    } else if (placeholder === '6-digit PIN') {
      // Only allow numbers and limit to 6 digits
      const numericValue = value.replace(/[^0-9]/g, '')
      if (numericValue.length <= 6) {
        setFormData(prev => ({ ...prev, pin: numericValue }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.organization_name || !formData.user_name || !formData.pin) {
      toast.error('Please fill in all fields')
      setLoading(false)
      return
    }

    if (formData.pin.length !== 6) {
      toast.error('PIN must be exactly 6 digits')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            organization_name: formData.organization_name,
            user_name: formData.user_name,
            pin: formData.pin
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        toast.error(error.message || 'Error creating account')
      } else {
        toast.success('Account created successfully!')
        setFormData({
          organization_name: '',
          user_name: '',
          pin: ''
        })

        navigate('/')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

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
            Register in Akubo 
          </h1>
          <p className="text-[#6A6A6A] text-md mt-1 mb-5">Create your account</p>

          {/* register form */}
          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            {/* organization name */}
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
            
            {/* user name */}
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
            
            {/* 6-digit PIN */}
            <div>
              <input 
                type="password" 
                inputMode="numeric" 
                maxLength="6" 
                placeholder="6-digit PIN" 
                value={formData.pin}
                onChange={handleChange}
                className="w-full text-md px-2 py-2 border border-[#6A6A6A] rounded-lg focus:ring-2 focus:ring-[#22864D]/30 focus:border-[#22864D] outline-none transition placeholder:text-sm"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-[#22864D] hover:bg-[#22864D]/90 text-white font-bold py-3.5 rounded-lg text-md transition duration-200 shadow-md hover:shadow-lg mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating account...' : 'Register account'}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
              Already have an account?{' '}
              <a 
                href="/" 
                className="text-[#22864D] font-semibold hover:underline hover:underline-offset-2"
              >
                Login
              </a>
            </p>
        </div>

        {/* RIGHT SECTION */}
        <div 
          className="w-full md:w-3/5 lg:w-3/5 flex flex-col md:items-center p-10 text-white relative 
          bg-[url('/landingbg.svg')] bg-cover bg-center bg-no-repeat"
        >
          {/* inner content with overlay effect for readability */}
          <div className="relative z-10 w-full">
            {/* large heading */}
            <h2 className="text-xl lg:text-5xl font-semibold">
              Fundraising Plan Portal
            </h2>
           <p className="text-white text-md mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. <br/>Dolor sit amet, consectetur adipiscing. elit </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register