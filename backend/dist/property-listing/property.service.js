"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../db/dbConnection"));
class PropertyService {
    async createProperty(property) {
        const client = await dbConnection_1.default.connect();
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
        const result = await dbConnection_1.default.query(`
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
        const property = await dbConnection_1.default.query(`
    SELECT images
    FROM properties
    WHERE id = $1
    AND owner_id = $2
    `, [propertyId, ownerId]);
        if (property.rows.length === 0) {
            throw new Error("Property not found or unauthorized");
        }
        await dbConnection_1.default.query(`
    DELETE FROM properties
    WHERE id = $1
    `, [propertyId]);
        return property.rows[0];
    }
}
exports.default = new PropertyService();
