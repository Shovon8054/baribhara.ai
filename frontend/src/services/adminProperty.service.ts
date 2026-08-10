import api from "../api/axios";

export const getAdminProperties = async () => {
    const response = await api.get("/admin/properties");
    return response.data.data;
};

export const deleteAdminProperty = async (propertyId: string) => {
    const response = await api.delete(
        `/admin/properties/${propertyId}`
    );

    return response.data;
};