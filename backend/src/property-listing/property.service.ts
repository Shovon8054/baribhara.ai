import pool from "../db/dbConnection";

interface CreateProperty {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  latitude?: number;
  longitude?: number;

  property_type:
    | "APARTMENT"
    | "HOUSE"
    | "FLAT"
    | "STUDIO"
    | "PENTHOUSE"
    | "DUPLEX";

  furnished?: boolean;

  family_bachelor?: "FAMILY" | "BACHELOR" | "ANY";

  parking?: boolean;
  lift?: boolean;
  pet_friendly?: boolean;
  availability?: boolean;

  amenities?: string[];
  nearby_facilities?: string[];
  images?: string[];

  owner_id: string;
}

class PropertyService {
  async createProperty(property: CreateProperty) {
    const {
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
      furnished = false,
      family_bachelor = "ANY",
      parking = false,
      lift = false,
      pet_friendly = false,
      availability = true,
      amenities = [],
      nearby_facilities = [],
      images = [],
      owner_id,
    } = property;

    const result = await pool.query(
      `
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
      `,
      [
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
      ]
    );

    return result.rows[0];
  };
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
}

export default new PropertyService();