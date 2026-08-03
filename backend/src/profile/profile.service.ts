import pool from "../db/dbConnection";

class ProfileService {
  async getProfile(userId: string) {
    const result = await pool.query(
      `
        SELECT id, full_name AS name, email, phone, role
        FROM users
        WHERE id = $1
      `,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error("User profile not found");
    }

    return result.rows[0];
  }

  async getMyProperties(userId: string) {
    const result = await pool.query(
      `
        SELECT id, title, price, location, bedrooms, bathrooms, area, images, availability
        FROM properties
        WHERE owner_id = $1
        ORDER BY created_at DESC
      `,
      [userId]
    );

    return result.rows;
  }
}

export default new ProfileService();
