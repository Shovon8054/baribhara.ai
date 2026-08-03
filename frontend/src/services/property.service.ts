import api from "../api/axios";

export const createProperty = async (formData: FormData) => {
  const response = await api.post("/property", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};