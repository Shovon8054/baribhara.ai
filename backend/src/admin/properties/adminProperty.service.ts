import pool from "../../db/dbConnection.js";

class AdminPropertyService {

    // Get all properties
    async getAllProperties() {
        const result = await pool.query(`
            SELECT
                p.id,
                p.title,
                p.description,
                p.price,
                p.bedrooms,
                p.bathrooms,
                p.area,
                p.location,
                p.property_type,
                p.amenities,
                p.nearby_facilities,
                p.images,
               
                p.owner_id,
                p.created_at,

                u.full_name AS owner_name,
                u.email AS owner_email

            FROM properties p

            LEFT JOIN users u
                ON p.owner_id = u.id

            ORDER BY p.created_at DESC
        `);

        return result.rows;
    }


    // Delete property
    async deleteProperty(propertyId: string) {

        const result = await pool.query(
            `
            DELETE FROM properties
            WHERE id = $1
            RETURNING id, title
            `,
            [propertyId]
        );

        if (result.rows.length === 0) {
            throw new Error("Property not found");
        }

        return result.rows[0];
    }
}

export default new AdminPropertyService();