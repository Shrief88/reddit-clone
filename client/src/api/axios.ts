import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URI;

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export const axiosClientWithToken = (token: string) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
