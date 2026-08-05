import { GoogleGenAI } from "@google/genai";

export type PropertyFilters = Record<string, string | number | boolean>;

class AIService {
  async extractFilters(userQuery: string): Promise<PropertyFilters> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return this.extractFiltersLocally(userQuery);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract property-search filters from this request: ${userQuery}

Return only a JSON object. Supported keys are location, minPrice, maxPrice,
bedrooms, bathrooms, minArea, maxArea, property_type, family_bachelor,
furnished, parking, lift, pet_friendly, and sort. Omit filters that were not requested.
property_type must be exactly one of APARTMENT, HOUSE, FLAT, STUDIO,
PENTHOUSE, or DUPLEX. Treat phrases like "duplex flat" as DUPLEX.`,
        config: { responseMimeType: "application/json" },
      });

      const text = response.text?.trim();
      return text ? this.normalizeFilters(JSON.parse(text) as PropertyFilters) : {};
    } catch (error) {
      console.warn("Gemini search extraction failed; using local fallback.", error);
      return this.extractFiltersLocally(userQuery);
    }
  }

  private extractFiltersLocally(userQuery: string): PropertyFilters {
    const query = userQuery.toLowerCase();
    const filters: PropertyFilters = {};

    const readAmount = (pattern: RegExp) => {
      const match = query.match(pattern);
      if (!match) return undefined;
      const amount = Number(match[1].replace(/,/g, ""));
      const unit = match[2]?.toLowerCase();
      const multiplier = unit === "k" || unit === "thousand" ? 1_000
        : unit === "lakh" || unit === "lac" ? 100_000
          : unit === "m" || unit === "million" ? 1_000_000 : 1;
      return amount * multiplier;
    };

    // Do not treat values followed by sqft/square feet as money (for example, "under 1500 sqft").
    const money = "(?:৳|tk\\.?|bdt|taka)?\\s*(\\d[\\d,]*(?:\\.\\d+)?)(?![\\d,])\\s*(k|thousand|lakh|lac|m|million)?\\b(?!\\s*(?:sq\\.?\\s*ft|sqft|square feet))";
    const maxPrice = readAmount(new RegExp(`(?:under|below|less than|up to|within|maximum|max)\\s*${money}`, "i"));
    const minPrice = readAmount(new RegExp(`(?:over|above|more than|at least|minimum|min|from)\\s*${money}`, "i"));
    const budget = readAmount(new RegExp(`(?:budget(?: of)?|budget is)\\s*${money}`, "i"));
    if (maxPrice !== undefined) filters.maxPrice = maxPrice;
    if (minPrice !== undefined) filters.minPrice = minPrice;
    if (budget !== undefined && maxPrice === undefined) filters.maxPrice = budget;

    const bedrooms = query.match(/(\d+)\s*(?:bed|bedroom)/)?.[1];
    const bathrooms = query.match(/(\d+)\s*(?:bath|bathroom)/)?.[1];
    if (bedrooms) filters.bedrooms = Number(bedrooms);
    if (bathrooms) filters.bathrooms = Number(bathrooms);

    const minArea = query.match(/(?:over|above|more than|at least|minimum|min)\s*(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square feet)/)?.[1];
    const maxArea = query.match(/(?:under|below|less than|up to|within|maximum|max)\s*(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square feet)/)?.[1];
    const exactArea = query.match(/\b(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft|square feet)\b/)?.[1];
    if (minArea) filters.minArea = Number(minArea.replace(/,/g, ""));
    if (maxArea) filters.maxArea = Number(maxArea.replace(/,/g, ""));
    if (exactArea && !minArea && !maxArea) {
      const area = Number(exactArea.replace(/,/g, ""));
      filters.minArea = area;
      filters.maxArea = area;
    }

    if (query.includes("family")) filters.family_bachelor = "FAMILY";
    if (query.includes("bachelor")) filters.family_bachelor = "BACHELOR";
    if (query.includes("unfurnished")) filters.furnished = "false";
    else if (query.includes("furnished")) filters.furnished = "true";
    if (query.includes("without parking") || query.includes("no parking")) filters.parking = "false";
    else if (query.includes("parking")) filters.parking = "true";
    if (query.includes("without lift") || query.includes("no lift")) filters.lift = "false";
    else if (query.includes("lift")) filters.lift = "true";
    if (query.includes("not pet friendly") || query.includes("no pets")) filters.pet_friendly = "false";
    else if (query.includes("pet friendly") || query.includes("pets allowed")) filters.pet_friendly = "true";

    if (query.includes("cheapest") || query.includes("lowest price")) filters.sort = "price_asc";
    else if (query.includes("most expensive") || query.includes("highest price")) filters.sort = "price_desc";
    else if (query.includes("largest") || query.includes("biggest")) filters.sort = "area_desc";
    else if (query.includes("smallest")) filters.sort = "area_asc";
    else if (query.includes("oldest")) filters.sort = "oldest";

    const propertyType = ["penthouse", "duplex", "apartment", "studio", "house", "flat"]
      .find((type) => query.includes(type));
    if (propertyType) filters.property_type = propertyType.toUpperCase();

    const location = query.match(/\b(?:in|at|around)\s+([a-z][a-z\s-]*?)(?=\s+(?:with|under|below|over|above|for|and)\b|$)/i)?.[1]?.trim();
    if (location) filters.location = location;

    return this.normalizeFilters(filters);
  }

  private normalizeFilters(filters: PropertyFilters): PropertyFilters {
    const normalized: PropertyFilters = { ...filters };
    if (typeof normalized.property_type === "string") {
      const value = normalized.property_type.toUpperCase();
      if (value.includes("DUPLEX")) normalized.property_type = "DUPLEX";
      else if (value.includes("PENTHOUSE")) normalized.property_type = "PENTHOUSE";
      else if (value.includes("APARTMENT")) normalized.property_type = "APARTMENT";
      else if (value.includes("STUDIO")) normalized.property_type = "STUDIO";
      else if (value.includes("HOUSE")) normalized.property_type = "HOUSE";
      else if (value.includes("FLAT")) normalized.property_type = "FLAT";
      else delete normalized.property_type;
    }

    if (typeof normalized.family_bachelor === "string") {
      const value = normalized.family_bachelor.toUpperCase();
      if (["FAMILY", "BACHELOR", "ANY"].includes(value)) normalized.family_bachelor = value;
      else delete normalized.family_bachelor;
    }

    for (const key of ["furnished", "parking", "lift", "pet_friendly"] as const) {
      if (typeof normalized[key] === "boolean") normalized[key] = String(normalized[key]);
    }
    return normalized;
  }
}

export default new AIService();
