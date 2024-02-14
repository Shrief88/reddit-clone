import { useQuery } from "@tanstack/react-query";

import IUser from "@/models/user";
import useToken from "./useToken";

const useAuth = () => {
  const token = localStorage.getItem("token");
  const { axiosClientAuth } = useToken();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!token) {
        return null;
      }
      const response = await axiosClientAuth.get("/users/me");
      return response.data.user as IUser;
    },
  });

  return { user, isLoading };
};

export default useAuth;
