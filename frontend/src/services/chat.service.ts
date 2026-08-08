import api from "../api/axios";

export interface Message {
    id: string;
    content: string;
    sender_id: string;
    receiver_id: string;
    is_read: boolean;
    read_at: string | null;
    created_at: string;
}

export interface ChatUser {
    user_id: string;
    full_name: string;
    profile_image: string | null;
    last_message: string;
    last_message_time: string;
    unread_count: number;
}

// Get all conversations
export const getChatList = async () => {
    const response = await api.get("/chat");

    return response.data.data;
};

// Get messages with a specific user
export const getMessages = async (userId: string) => {
    const response = await api.get(`/chat/${userId}`);

    return response.data.data;
};

// Send message
export const sendMessage = async (
    receiver_id: string,
    content: string
) => {
    const response = await api.post("/chat", {
        receiver_id,
        content,
    });

    return response.data.data;
};

// Mark messages as read
export const markMessagesAsRead = async (
    userId: string
) => {
    const response = await api.patch(
        `/chat/${userId}/read`
    );

    return response.data.data;
};