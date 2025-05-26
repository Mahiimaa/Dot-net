import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false, roles = [] }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  console.log("ProtectedRoute - Current path:", location.pathname);
  console.log("ProtectedRoute - Auth state:", { isAuthenticated, loading, userRole: user?.role });
  console.log("ProtectedRoute - Requirements:", { adminOnly, roles });

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && user?.role !== "Admin") {
    console.log("ProtectedRoute - Not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    console.log("ProtectedRoute - Doesn't have required role, redirecting to home");
    return <Navigate to="/" replace />;
  }
  console.log("ProtectedRoute - Access granted");
  return children;
};

export default ProtectedRoute;