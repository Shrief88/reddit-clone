import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";

import IUser from "@/models/user";
import useToken from "./useToken";

const useAuth = () => {
  const [cookies] = useCookies(["accessToken"]);
  const accessToken = cookies["accessToken"];
  const { axiosClientAuth } = useToken();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!accessToken) {
        return null;
      }
      const response = await axiosClientAuth.get("/users/me");
      return response.data.user as IUser;
    },
  });

  return { user, isLoading };
};

export default useAuth;
