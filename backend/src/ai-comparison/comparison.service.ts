import pool from "../db/dbConnection.js";

interface ComparableProperty {
  title: string;
  price: string | number;
  bedrooms: number;
  bathrooms: number;
  area: string | number;
  location: string;
}

class ComparisonService {
  async compareProperties(userId: string): Promise<string> {
    const result = await pool.query<ComparableProperty>(
      `
      SELECT p.title, p.price, p.bedrooms, p.bathrooms, p.area, p.location
      FROM favorites f
      JOIN properties p ON p.id = f.property_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      `,
      [userId]
    );

    const properties = result.rows;
    if (properties.length < 2) {
      throw new Error("Save at least two properties before comparing them");
    }

    const cheapest = properties.reduce((best, property) =>
      Number(property.price) < Number(best.price) ? property : best
    );
    const largest = properties.reduce((best, property) =>
      Number(property.area) > Number(best.area) ? property : best
    );
    const mostBedrooms = properties.reduce((best, property) =>
      property.bedrooms > best.bedrooms ? property : best
    );

    return [
      `Compared ${properties.length} saved properties.`,
      `Best budget option: ${cheapest.title} in ${cheapest.location} at ৳${Number(cheapest.price).toLocaleString()}.`,
      `Largest space: ${largest.title} with ${largest.area} sqft.`,
      `Most bedrooms: ${mostBedrooms.title} with ${mostBedrooms.bedrooms} bedrooms and ${mostBedrooms.bathrooms} bathrooms.`,
    ].join("\n");
  }
}

export default new ComparisonService();
