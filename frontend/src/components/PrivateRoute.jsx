import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PageLoader from "./PageLoader.jsx";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader text="Vérification de votre session..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;