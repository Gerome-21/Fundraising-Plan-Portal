import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import supabase from '../src/supabase-connect';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('akubo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (organization_name, user_name, pin) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('organization_name', organization_name)
        .eq('user_name', user_name)
        .eq('pin', pin);

      if (error) {
        console.error('Login error:', error);
        toast.error('An error occurred during login');
        return false;
      }

      if (!data || data.length === 0) {
        toast.error('Invalid credentials');
        return false;
      }

      const userData = data[0];
      
      const { pin: _, ...userWithoutPin } = userData;
      setUser(userWithoutPin);
      localStorage.setItem('akubo_user', JSON.stringify(userWithoutPin));
      toast.success('Login successful!');
      return true;
      
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('akubo_user');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};