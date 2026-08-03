import api from "../api/axios";

export const createProperty = async (formData: FormData) => {
  const response = await api.post("/property", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getAllProperties = async () => {
  const response = await api.get("/property");
  return response.data.data;
};

export const deleteProperty = async (propertyId: string) => {
  const response = await api.delete(`/property/${propertyId}`);
  return response.data;
};
