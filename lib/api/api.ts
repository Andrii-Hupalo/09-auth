import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const nextServer = axios.create({
  baseURL: API_URL
    ? API_URL.endsWith("/")
      ? API_URL + "api"
      : API_URL + "/api"
    : "/api",
  withCredentials: true,
});
