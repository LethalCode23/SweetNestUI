import axios from "axios";
import { Environment } from "../Environments/Environment";

const api = axios.create({
  baseURL: Environment.API_URL,
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");
  // console.log('Token en interceptor:', token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;