import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { axiosClient, axiosClientWithToken } from "@/api/axios";

import IUser from "@/models/user";

const useAuth = () => {
  const [cookies] = useCookies(["accessToken"]);
  const accessToken = cookies["accessToken"];
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!accessToken) {
        return null;
      }
      const response = await axiosClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.user as IUser;
    },
  });

  const axiosClientAuth = axiosClientWithToken(accessToken);

  return { user, isLoading, axiosClientAuth };
};

export default useAuth;
