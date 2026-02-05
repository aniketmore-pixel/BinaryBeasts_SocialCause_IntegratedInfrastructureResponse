import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return children;

  return user.role === "USER"
    ? <Navigate to="/citizen-portal" replace />
    : <Navigate to="/analytics" replace />;
};

export default PublicRoute;
