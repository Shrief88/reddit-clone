import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

import SocketProvider from "@/context/Socket";

const RequireAuth = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return user ? (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default RequireAuth;
