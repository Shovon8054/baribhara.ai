import api from "../api/axios";

export const getAdminUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data.data;
};

export const blockUser = async (userId: string) => {
    const response = await api.patch(
        `/admin/users/${userId}/block`
    );

    return response.data;
};

export const unblockUser = async (userId: string) => {
    const response = await api.patch(
        `/admin/users/${userId}/unblock`
    );

    return response.data;
};