// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { checkAuth } from '../api/auth';

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null); // null = loading, false = not auth

  useEffect(() => {
    const verify = async () => {
      try {
        await checkAuth();
        setAuth(true);
      } catch (err) {
        setAuth(false);
      }
    };
    verify();
  }, []);

  if (auth === null) return <p>Loading...</p>; // show loading while checking
  if (auth === false) return <Navigate to="/" />; // redirect if not auth
  return <Outlet />; // render children if auth
};

export default ProtectedRoute;
