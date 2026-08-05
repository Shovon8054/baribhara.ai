import pool from "../db/dbConnection.js";

class DetailsService {
  async getPropertyDetails(id: string) {
    const result = await pool.query(
      `
      SELECT
        p.*,
        u.full_name,
        u.email,
        u.phone,
        u.role
      FROM properties p
      JOIN users u
        ON p.owner_id = u.id
      WHERE p.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Property not found");
    }

    return result.rows[0];
  }
}

export default new DetailsService();