import pool from "../../db/dbConnection.js";

interface UpdateProfileData {
    userId: string;
    full_name: string;
    phone?: string;
    profile_image?: string;
}

class EditProfileService {
    async updateProfile(
        data: UpdateProfileData
    ) {
        const {
            userId,
            full_name,
            phone,
            profile_image,
        } = data;

        const result = await pool.query(
            `
            UPDATE users
            SET
                full_name = $1,
                phone = $2,
                profile_image = COALESCE(
                    $3,
                    profile_image
                ),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4

            RETURNING
                id,
                email,
                full_name,
                phone,
                role,
                profile_image,
                is_verified,
                is_active,
                created_at,
                updated_at
            `,
            [
                full_name,
                phone || null,
                profile_image || null,
                userId,
            ]
        );

        if (result.rows.length === 0) {
            throw new Error(
                "User not found"
            );
        }

        return result.rows[0];
    }
}

export default new EditProfileService();