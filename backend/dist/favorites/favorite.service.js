import pool from "../db/dbConnection.js";
class FavoriteService {
    async addToFavorites(userId, propertyId) {
        // Check property exists--------------------------
        const property = await pool.query(`
      SELECT id
      FROM properties
      WHERE id = $1
      `, [propertyId]);
        if (property.rows.length === 0) {
            throw new Error("Property not found");
        }
        const result = await pool.query(`
      INSERT INTO favorites
      (
        user_id,
        property_id
      )
      VALUES
      (
        $1,$2
      )
      ON CONFLICT (user_id, property_id) DO NOTHING
      RETURNING *
      `, [userId, propertyId]);
        if (result.rows.length > 0) {
            return { ...result.rows[0], created: true };
        }
        const existingFavorite = await pool.query(`
      SELECT *
      FROM favorites
      WHERE user_id = $1
      AND property_id = $2
      `, [userId, propertyId]);
        return { ...existingFavorite.rows[0], created: false };
    }
    // Get favorites
    async getFavorites(userId) {
        const result = await pool.query(`
      SELECT
        p.*
      FROM favorites f
      JOIN properties p
      ON p.id = f.property_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      `, [userId]);
        return result.rows;
    }
    // Remove favorite
    async removeFavorite(userId, propertyId) {
        const result = await pool.query(`
      DELETE FROM favorites
      WHERE user_id = $1
      AND property_id = $2
      RETURNING *
      `, [userId, propertyId]);
        if (result.rows.length === 0) {
            throw new Error("Favorite not found");
        }
        return result.rows[0];
    }
}
export default new FavoriteService();
