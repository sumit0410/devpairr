import axios from "axios";
import { BASE_URL } from "./constants";
import { removeUser } from "./userSlice";
import appStore from "./appStore";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// RESPONSE INTERCEPTOR

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    // TOKEN EXPIRED / INVALID TOKEN

    if (error.response?.status === 401) {
      // remove stored user if needed
      appStore(removeUser());
      // redirect login page
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
