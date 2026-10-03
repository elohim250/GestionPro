import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PageLoader from "./PageLoader.jsx";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader text="Chargement..." />;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;