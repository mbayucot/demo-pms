import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const instance = axios.create();
instance.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  return config;
});

export default instance;
