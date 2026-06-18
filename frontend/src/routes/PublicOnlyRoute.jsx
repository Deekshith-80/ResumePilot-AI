import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (isAuthenticated || localStorage.getItem('authToken')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;

