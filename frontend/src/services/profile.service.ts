import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/profile");

  return response.data;
};

export const getMyProperties = async () => {
  const response = await api.get("/profile/properties");

  return response.data;
};