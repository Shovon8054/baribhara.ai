import pool from "../../db/dbConnection.js";

class AdminSubscriptionService {

    async getAllSubscriptions() {

        const result = await pool.query(`
            SELECT
                s.id,
                s.user_id,
                u.full_name,
                u.email,
                u.role,
                s.plan,
                s.is_active,
                s.stripe_customer_id,
                s.stripe_subscription_id,
                s.expires_at,
                s.created_at,
                s.updated_at

            FROM subscriptions s

            JOIN users u
                ON s.user_id = u.id

            ORDER BY s.created_at DESC
        `);

        return result.rows;
    }
}

export default new AdminSubscriptionService();