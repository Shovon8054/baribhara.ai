import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties, searchProperties } from "../../services/property.service";
import SearchFilter from "../../components/SearchFilter";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  location: string;
  property_type: string;
  availability: boolean;
  images: string[];
}

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties();
      setProperties(response.data || response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: any) => {
    try {
      setLoading(true);
      const response = await searchProperties(filters);
      setProperties(response.data || response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (image?: string) => {
    if (!image) return "/uploads/properties/image-unavailable.svg";
    if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
      return image;
    }
    if (image.startsWith("/uploads")) {
      return image;
    }
    return image.startsWith("/") ? image : `/uploads/properties/${image}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Loading properties...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                All Properties
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
              </p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/create-property')}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
        </div>

        {/* Search Filter */}
        <div className="mb-8">
          <SearchFilter onSearch={handleSearch} />
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/30">
              <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              No properties found
            </h3>
            <p className="text-sm text-slate-400">
              Try adjusting your search filters
            </p>
            <button
              onClick={loadProperties}
              className="mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-56 sm:h-64">
                  <img
                    src={getImageSrc(property.images?.[0])}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/uploads/properties/image-unavailable.svg";
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg shadow-cyan-500/30">
                    ৳ {typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
                  </div>
                  {property.property_type && (
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-cyan-400 px-3 py-1 rounded-lg text-xs font-medium border border-cyan-500/30 shadow-lg">
                      {property.property_type}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight line-clamp-1">
                    {property.title}
                  </h2>

                  <div className="flex items-center gap-1.5 mt-1.5">
                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-slate-400 truncate">
                      {property.location}
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between py-3 px-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-sm font-medium text-slate-300">
                        {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-slate-300">
                        {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                      </span>
                    </div>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      <span className="text-sm font-medium text-slate-300">
                        {property.area} sqft
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/view-property/${property.id}`)}
                    className="
                    w-full
                    mt-5
                    px-6 py-2.5
                    bg-gradient-to-r from-cyan-500 to-cyan-600
                    text-white
                    text-sm
                    font-medium
                    rounded-xl
                    hover:from-cyan-600 hover:to-cyan-700
                    shadow-lg shadow-cyan-500/25
                    hover:shadow-cyan-500/40
                    transition-all
                    duration-300
                    flex items-center justify-center gap-2
                    group/btn
                    "
                  >
                    <span>View Details</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
