import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.request.withCredentials) {
        if (error.response.status === 401) {
          window.location.href = "/home";
          window.localStorage["auth-status"] = "signed-out";
          return;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
