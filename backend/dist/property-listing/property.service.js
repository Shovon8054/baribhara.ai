"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = __importDefault(require("../db/dbConnection"));
class PropertyService {
    async createProperty(property) {
        const { title, description, price, bedrooms, bathrooms, area, location, latitude, longitude, property_type, furnished = false, family_bachelor = "ANY", parking = false, lift = false, pet_friendly = false, availability = true, amenities = [], nearby_facilities = [], images = [], owner_id, } = property;
        const result = await dbConnection_1.default.query(`
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
        return result.rows[0];
    }
    ;
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
}
exports.default = new PropertyService();
