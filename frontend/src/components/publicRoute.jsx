import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (token && user) {
    return user.role === "admin"
      ? <Navigate to="/admin-dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return <Outlet />;
}

