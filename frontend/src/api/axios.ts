import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

export const getAllProperties = async () => {
  const response = await api.get("/property");
  return response.data;
};

export default api;