import api from "../api/axios";

export const getPropertyDetails = async (id: string) => {
  const response = await api.get(`/property-details/${id}`);

  return response.data.data;
};