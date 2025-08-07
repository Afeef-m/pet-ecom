import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return user.role === "admin"
      ? <Navigate to="/admin-dashboard" replace />
      : <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
