import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

const ProtectedRoutes = ({ children }) => {
  const { isLoggedIn } = useUser();
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoutes;