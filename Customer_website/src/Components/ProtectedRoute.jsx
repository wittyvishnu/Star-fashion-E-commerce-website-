// src/Components/ProtectedRoute.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { useVerifyTokenMutation } from '../redux/services/userSlice';
import Nav from './Nav';

const ProtectedRoute = () => {
  // Get token and the new status from the auth state
  const { token, status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [verifyToken] = useVerifyTokenMutation();

  useEffect(() => {
    // On initial load, if a token exists, try to verify it
    if (token && status === 'idle') {
      verifyToken();
    }
  }, [token, status, dispatch, verifyToken]);

  // While loading (either from login or token verification), show a loading screen
  if (status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }
  
  // If the status is not 'succeeded' AND there is no token, redirect to login
  if (status !== 'succeeded' && !token) {
      return <Navigate to="/account" replace />;
  }

  // If we get here, the user is authenticated
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;