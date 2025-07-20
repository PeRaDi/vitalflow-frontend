import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://vital-flow.live:5001",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      response.data.data &&
      response.data.data.access_token
    ) {
      window.localStorage.setItem(
        "access_token",
        response.data.data.access_token
      );
    }
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Invalid authentication token."
    ) {
      window.localStorage.setItem("auth-status", "signed-out");
      window.location.href = "/home";
      return;
    }
    return Promise.reject(error);
  }
);

export default api;
