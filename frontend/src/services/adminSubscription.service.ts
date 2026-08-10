import api from "../api/axios";

export const getAdminSubscriptions = async () => {
    const response = await api.get("/admin/subscriptions");

    return response.data.data;
};