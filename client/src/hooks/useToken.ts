import { useCookies } from "react-cookie";

import { axiosClientWithToken } from "@/api/axios";

const useToken = () => {
  const [cookies] = useCookies(["accessToken"]);
  const accessToken = cookies["accessToken"];

  const axiosClientAuth = axiosClientWithToken(accessToken);

  return { axiosClientAuth };
};

export default useToken;
