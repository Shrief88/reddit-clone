import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const RequireAuth = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default RequireAuth;
