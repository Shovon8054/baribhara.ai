import pool from "../db/dbConnection.js";

class SubscriptionService {

    async getSubscription(userId: string) {
        const result = await pool.query(
            `SELECT id, user_id, plan, is_active, stripe_customer_id, stripe_subscription_id, expires_at, created_at, updated_at FROM subscriptions WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return { user_id: userId, plan: "FREE", is_active: true, stripe_customer_id: null, stripe_subscription_id: null, expires_at: null };
        }

        const subscription = result.rows[0];

        if (subscription.expires_at && new Date(subscription.expires_at) < new Date()) {
            await pool.query(`UPDATE subscriptions SET plan = 'FREE', is_active = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`, [userId]);
            return { ...subscription, plan: "FREE", is_active: false };
        }

        return subscription;
    }

    async createFreeSubscription(userId: string) {
        const result = await pool.query(
            `INSERT INTO subscriptions (user_id, plan, is_active) VALUES ($1, 'FREE', true) ON CONFLICT (user_id) DO NOTHING RETURNING *`,
            [userId]
        );
        if (result.rows.length > 0) return result.rows[0];
        return this.getSubscription(userId);
    }

    async upgradeToPremium(userId: string, expiresAt: Date) {
        const result = await pool.query(
            `INSERT INTO subscriptions (user_id, plan, is_active, expires_at) VALUES ($1, 'PREMIUM', true, $2) ON CONFLICT (user_id) DO UPDATE SET plan = 'PREMIUM', is_active = true, expires_at = $2, updated_at = CURRENT_TIMESTAMP RETURNING *`,
            [userId, expiresAt]
        );
        return result.rows[0];
    }

    async cancelSubscription(userId: string) {
        const result = await pool.query(
            `UPDATE subscriptions SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *`,
            [userId]
        );
        if (result.rows.length === 0) throw new Error("Subscription not found");
        return result.rows[0];
    }

    async isPremium(userId: string) {
        const result = await pool.query(
            `SELECT plan, is_active, expires_at FROM subscriptions WHERE user_id = $1`,
            [userId]
        );
        if (result.rows.length === 0) return false;

        const sub = result.rows[0];
        if (!sub.is_active) return false;
        if (sub.plan !== "PREMIUM") return false;

        if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
            await pool.query(`UPDATE subscriptions SET plan = 'FREE', is_active = false, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`, [userId]);
            return false;
        }

        return true;
    }
}

export default new SubscriptionService();
