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

  const login = async (organization_name, user_name) => {
    const org = organization_name.trim();
    const name = user_name.trim();

    try {
      // First, try to find existing user
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('organization_name', org)
        .eq('user_name', name)
        .maybeSingle();

      if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding user:', findError);
        toast.error('An error occurred');
        return false;
      }

      let userData;

      if (existingUser) {
        // User exists - log them in
        userData = existingUser;
        toast.success(`Welcome back, ${userData.user_name}!`);
      } else {
        // User doesn't exist - create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            organization_name: org,
            user_name: name,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          toast.error('Failed to create account');
          return false;
        }

        userData = newUser;
        toast.success(`Welcome, ${userData.user_name}!`);
      }
      const { ...userWithoutSensitive } = userData;
      setUser(userWithoutSensitive);
      localStorage.setItem('akubo_user', JSON.stringify(userWithoutSensitive));
      
      return true;
      
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('akubo_user');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};