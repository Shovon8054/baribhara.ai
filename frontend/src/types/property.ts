export interface PropertyDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;

  property_type: string;

  furnished: boolean;

  family_bachelor: string;

  parking: boolean;
  lift: boolean;
  pet_friendly: boolean;

  availability: boolean;

  amenities: string[];

  nearby_facilities: string[];

  images: string[];

  full_name: string;
  email: string;
  phone: string;
}