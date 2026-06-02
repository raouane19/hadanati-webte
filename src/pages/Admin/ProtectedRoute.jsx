import { Navigate } from "react-router-dom";

// Wraps any admin page — redirects to login if no token present
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedRoute;