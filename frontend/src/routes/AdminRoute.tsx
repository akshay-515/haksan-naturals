import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export { AdminRoute };