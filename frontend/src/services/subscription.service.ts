import api from "../api/axios";

export interface Subscription {
    id?: string;
    user_id: string;
    plan: "FREE" | "PREMIUM" | "BUSINESS";
    is_active: boolean;
    stripe_customer_id?: string | null;
    stripe_subscription_id?: string | null;
    expires_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export const getSubscription = async () => {
    const response = await api.get("/subscription");
    return response.data.data as Subscription;
};

export const upgradeToPremium = async () => {
    const response = await api.post(
        "/subscription/upgrade"
    );

    return response.data.data as Subscription;
};

export const cancelSubscription = async () => {
    const response = await api.patch(
        "/subscription/cancel"
    );

    return response.data.data as Subscription;
};