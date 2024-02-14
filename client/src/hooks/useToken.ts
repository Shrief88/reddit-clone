import { axiosClientWithToken } from "@/api/axios";

const useToken = () => {
  const token = localStorage.getItem("token");

  const axiosClientAuth = axiosClientWithToken(token as string);

  return { axiosClientAuth };
};

export default useToken;
