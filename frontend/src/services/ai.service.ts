import api from "../api/axios";

export const aiSearch = async (query: string) => {
  const response = await api.post("/ai/search", {
    query,
  });

  return response.data;
};
