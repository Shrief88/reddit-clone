import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const RequireAuth = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mx-auto animate-spin"/>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default RequireAuth;
