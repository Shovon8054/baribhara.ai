import pool from "../db/dbConnection.js";
class PropertyService {
    async createProperty(property) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const { title, description, price, bedrooms, bathrooms, area, location, latitude, longitude, property_type, furnished = false, family_bachelor = "ANY", parking = false, lift = false, pet_friendly = false, availability = true, amenities = [], nearby_facilities = [], images = [], owner_id, } = property;
            const result = await client.query(`
      INSERT INTO properties
      (
        title,
        description,
        price,
        bedrooms,
        bathrooms,
        area,
        location,
        latitude,
        longitude,
        property_type,
        furnished,
        family_bachelor,
        parking,
        lift,
        pet_friendly,
        availability,
        amenities,
        nearby_facilities,
        images,
        owner_id
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      )
      RETURNING *;
      `, [
                title,
                description,
                price,
                bedrooms,
                bathrooms,
                area,
                location,
                latitude,
                longitude,
                property_type,
                furnished,
                family_bachelor,
                parking,
                lift,
                pet_friendly,
                availability,
                amenities,
                nearby_facilities,
                images,
                owner_id,
            ]);
            // Roles are stored as uppercase values (TENANT, OWNER, ADMIN).
            // Promote only a tenant; never overwrite an administrator role.
            await client.query(`
      UPDATE users
      SET role = 'OWNER'
      WHERE id = $1
      AND role = 'TENANT'
      RETURNING id, role
      `, [owner_id]);
            await client.query("COMMIT");
            return result.rows[0];
        }
        catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getAllProperties() {
        const result = await pool.query(`
    SELECT
      id,
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      location,
      property_type,
      furnished,
      family_bachelor,
      parking,
      lift,
      pet_friendly,
      availability,
      amenities,
      nearby_facilities,
      images,
      views,
      favorites_count,
      owner_id,
      created_at
    FROM properties
    ORDER BY created_at DESC
  `);
        return result.rows;
    }
    async deleteProperty(propertyId, ownerId) {
        // Check ownership
        const property = await pool.query(`
    SELECT images
    FROM properties
    WHERE id = $1
    AND owner_id = $2
    `, [propertyId, ownerId]);
        if (property.rows.length === 0) {
            throw new Error("Property not found or unauthorized");
        }
        await pool.query(`
    DELETE FROM properties
    WHERE id = $1
    `, [propertyId]);
        return property.rows[0];
    }
    async searchProperties(query) {
        let sql = `
    SELECT *
    FROM properties
    WHERE availability = true
  `;
        const values = [];
        if (query.location) {
            values.push(`%${query.location}%`);
            sql += ` AND location ILIKE $${values.length}`;
        }
        if (query.minPrice) {
            values.push(Number(query.minPrice));
            sql += ` AND price >= $${values.length}`;
        }
        if (query.maxPrice) {
            values.push(Number(query.maxPrice));
            sql += ` AND price <= $${values.length}`;
        }
        if (query.bedrooms) {
            values.push(Number(query.bedrooms));
            sql += ` AND bedrooms = $${values.length}`;
        }
        if (query.bathrooms) {
            values.push(Number(query.bathrooms));
            sql += ` AND bathrooms = $${values.length}`;
        }
        if (query.minArea) {
            values.push(Number(query.minArea));
            sql += ` AND area >= $${values.length}`;
        }
        if (query.maxArea) {
            values.push(Number(query.maxArea));
            sql += ` AND area <= $${values.length}`;
        }
        if (query.property_type) {
            values.push(String(query.property_type).toUpperCase());
            sql += ` AND property_type = $${values.length}`;
        }
        if (query.family_bachelor) {
            values.push(String(query.family_bachelor).toUpperCase());
            sql += ` AND family_bachelor IN ($${values.length}, 'ANY')`;
        }
        if (query.furnished !== undefined) {
            values.push(String(query.furnished).toLowerCase() === "true");
            sql += ` AND furnished = $${values.length}`;
        }
        if (query.parking !== undefined) {
            values.push(String(query.parking).toLowerCase() === "true");
            sql += ` AND parking = $${values.length}`;
        }
        if (query.lift !== undefined) {
            values.push(String(query.lift).toLowerCase() === "true");
            sql += ` AND lift = $${values.length}`;
        }
        if (query.pet_friendly !== undefined) {
            values.push(String(query.pet_friendly).toLowerCase() === "true");
            sql += ` AND pet_friendly = $${values.length}`;
        }
        // Sorting
        switch (query.sort) {
            case "price_asc":
                sql += ` ORDER BY price ASC`;
                break;
            case "price_desc":
                sql += ` ORDER BY price DESC`;
                break;
            case "area_asc":
                sql += ` ORDER BY area ASC`;
                break;
            case "area_desc":
                sql += ` ORDER BY area DESC`;
                break;
            case "oldest":
                sql += ` ORDER BY created_at ASC`;
                break;
            default:
                sql += ` ORDER BY created_at DESC`;
        }
        const result = await pool.query(sql, values);
        return result.rows;
    }
}
export default new PropertyService();
