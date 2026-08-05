import api from "../api/axios";

export const addToFavorites = async (propertyId: string) => {
  const response = await api.post(`/favorites/${propertyId}`);
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get("/favorites");
  return response.data.data;
};

export const removeFavorite = async (propertyId: string) => {
  const response = await api.delete(`/favorites/${propertyId}`);
  return response.data;
};