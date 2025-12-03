import React from "react";
import { Navigate } from "react-router-dom";

// roles = optional array to restrict access to certain roles
const ProtectedRoute = ({ children, roles }) => {
  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("role"); // e.g., "admin", "customer", "rider", "staff"

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // Logged in but not authorized for this page
    return <Navigate to="/" replace />;
  }

  // Logged in and authorized
  return children;
};

export default ProtectedRoute;
