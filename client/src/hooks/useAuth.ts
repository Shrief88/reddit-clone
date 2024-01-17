import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/api/axios";

import User from "@/models/user";

const useAuth = () => {
  const [cookies] = useCookies(["accessToken"]);
  const accessToken = cookies["accessToken"];
  const { data: user,isLoading } = useQuery({
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
      return response.data.user as User;
    },
  });

  return {user,isLoading};
};

export default useAuth;
