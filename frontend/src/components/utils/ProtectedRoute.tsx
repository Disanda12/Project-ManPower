import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token'); // Checks if user is logged in

  if (!isAuthenticated) {
    // We save the 'location' (the page they wanted) into the redirect state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;