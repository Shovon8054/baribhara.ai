import api from "../api/axios";

export const compareProperties = async () => {
  const response = await api.post("/ai/property-comparison");

  return response.data;
};