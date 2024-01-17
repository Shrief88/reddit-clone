import { useCookies } from "react-cookie";
import { useEffect } from "react";

import { axiosClient } from "@/api/axios";
import { Navigate, Outlet } from "react-router-dom";

import { useAppDispatch } from "@/stateStore";
import { authStateServices } from "@/reducers/authSlice";

const RequireAuth = () => {
  const dispatch = useAppDispatch();

  const [cookies] = useCookies(["accessToken"]);
  const accessToken = cookies["accessToken"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosClient.get("/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const loginResponse = {
          accessToken: accessToken,
          user: response.data.user,
        };
        dispatch(authStateServices.actions.setAuthState(loginResponse));
      } catch (error) {
        console.error(error);
      }
    };

    if (!accessToken) return;
    fetchUserData();
  }, [accessToken, dispatch]);

  return accessToken ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default RequireAuth;
