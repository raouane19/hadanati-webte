// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get the user's role from localStorage
  const userRole = localStorage.getItem('userRole');

  // If no role or not allowed, redirect to home
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the child component
  return children;
};

export default ProtectedRoute;