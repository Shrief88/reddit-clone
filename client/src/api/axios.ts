import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1";

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export const axiosClientWithToken = (token : string) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
