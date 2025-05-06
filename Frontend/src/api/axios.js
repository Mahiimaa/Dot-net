import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5127",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Axios Request Headers:", config.headers);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;