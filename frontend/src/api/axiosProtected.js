import axios from "axios";

const apiProtected = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
});

apiProtected.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (token) config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);

  return config;
});

export default apiProtected;
