import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/log" />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    if (!payload.isAdmin) {
      // Redirect if the user is not an admin
      return <Navigate to="/log" />;
    }
  } catch (err) {
    console.error("Invalid token:", err);
    return <Navigate to="/log" />;
  }

  // Allow access to the route
  return children;
};

export default ProtectedRoute;
