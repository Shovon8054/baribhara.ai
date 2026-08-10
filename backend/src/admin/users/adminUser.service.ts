import pool from "../../db/dbConnection.js";

class AdminUserService {

    // Get all users
    async getAllUsers() {
        const result = await pool.query(`
            SELECT
                id,
                full_name,
                email,
                phone,
                role,
                is_verified,
                is_active,
                created_at,
                updated_at
            FROM users
            WHERE role != 'ADMIN'
            ORDER BY created_at DESC
        `);

        return result.rows;
    }


    // Block user
    async blockUser(userId: string) {

        const result = await pool.query(
            `
            UPDATE users
            SET
                is_active = FALSE,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND role != 'ADMIN'
            RETURNING
                id,
                full_name,
                email,
                phone,
                role,
                is_active
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error("User not found or cannot block admin");
        }

        return result.rows[0];
    }


    // Unblock user
    async unblockUser(userId: string) {

        const result = await pool.query(
            `
            UPDATE users
            SET
                is_active = TRUE,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
              AND role != 'ADMIN'
            RETURNING
                id,
                full_name,
                email,
                phone,
                role,
                is_active
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error("User not found or cannot modify admin");
        }

        return result.rows[0];
    }
}

export default new AdminUserService();