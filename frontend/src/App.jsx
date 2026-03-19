import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from '../context/UserContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../routes/ProtectedRoute';
import Homepage from '../pages/Homepage';

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#fff',
              color: '#103d24',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
            error: {
              duration: 4000,
            },
            loading: {
              duration: 2000,
            }
          }}
        />
        <Routes>
          {/* Public Pages*/}
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {/* User Pages - Protected Routes */}
          <Route element={
            <ProtectedRoute>
              <Layout/>
            </ProtectedRoute>
          }>
            <Route path='/home' element={<Homepage/>}/> 
            <Route path='/plan' element={<Dashboard/>}/> 
            <Route path='/report' element={<div>Report Page (Coming Soon)</div>}/> 
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;