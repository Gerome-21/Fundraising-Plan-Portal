import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const OnboardingModal = ({ isOpen, onComplete, onSkip }) => {
  const [formData, setFormData] = useState({
    organization_name: '',
    user_name: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.organization_name.trim() || !formData.user_name.trim()) {
      toast.error('Please enter both organization name and user name');
      return;
    }

    setLoading(true);
    const cleanedData = {
      organization_name: formData.organization_name.trim(),
      user_name: formData.user_name.trim()
    };

    await onComplete(cleanedData);

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[url('/landingbg.png')] bg-cover bg-center bg-no-repeat px-6 py-5">
          <div className="flex justify-center mb-3">
            <img 
              src="/akubo.jpg" 
              alt="Akubo Logo" 
              className="h-14 w-auto object-contain rounded-full bg-white"
            />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Welcome to Akubo
          </h2>
          <p className="text-gray-100 text-sm text-center mt-1">
            Let's get started with your fundraising journey
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                placeholder="e.g., Akubo Software"
                value={formData.organization_name}
                onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22864D] focus:border-transparent outline-none transition"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your organization's full name
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g., Juan Dela Cruz"
                value={formData.user_name}
                onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22864D] focus:border-transparent outline-none transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                How should we address you?
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#22864D] hover:bg-[#22864D]/90 text-white font-semibold py-2.5 rounded-lg transition duration-200 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Starting...' : 'Start Planning'}
            </button>
            
            <button
              type="button"
              onClick={onSkip}
              className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition"
            >
              Skip for now
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4">
            Your information will be used to personalize your experience
          </p>
        </form>
      </div>
    </div>
  );
};

// Main Component
const PreliminaryForm = () => {
  const navigate = useNavigate();
  const { user, login } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(!user);

  const handleOnboardingComplete = async (userData) => {
    const success = await login(userData.organization_name, userData.user_name);
    if (success) {
      setShowOnboarding(false);
      navigate('/form');
    }
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    navigate('/form');
  };

  if (user && !showOnboarding) {
    navigate('/form');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-500 flex items-center justify-center p-4">
      

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleSkip}
      />
    </div>
  );
};

export default PreliminaryForm;