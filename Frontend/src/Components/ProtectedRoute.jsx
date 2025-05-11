import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, roles = [] }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // Show loading indicator while checking authentication
  if (loading) {
    return <div className="text-center py-6">Loading...</div>;
  }

  // Redirect to /login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to / if user lacks required role
  if (adminOnly && user?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;