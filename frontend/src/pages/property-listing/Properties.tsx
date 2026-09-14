import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProperties, searchProperties } from "../../services/property.service";
import SearchFilter from "../../components/SearchFilter";
import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from "../../utils/imageUrl";

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
      setProperties(response.data || response || []);
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
      setProperties(response.data || response || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden pb-16">
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[130px] -z-10" />
      <div className="pointer-events-none absolute top-40 right-10 w-[450px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none absolute bottom-20 left-1/3 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        
        {/* =========================================================
            HEADER BAR
        ========================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                All Properties
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {loading ? "Searching listings..." : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} available for rent`}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/create-property')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
        </div>

        {/* =========================================================
            SEARCH & FILTER CONSOLE
        ========================================================= */}
        <SearchFilter onSearch={handleSearch} />

        {/* =========================================================
            PROPERTIES GRID / STATES
        ========================================================= */}
        {loading ? (
          /* High-end Skeleton Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden h-[420px] flex flex-col">
                <div className="h-52 bg-slate-800/60 w-full" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-5 bg-slate-800/70 rounded-lg w-3/4" />
                    <div className="h-3.5 bg-slate-800/50 rounded w-1/2" />
                    <div className="h-3 bg-slate-800/40 rounded w-full" />
                  </div>
                  <div className="h-10 bg-slate-800/60 rounded-xl w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-12 sm:p-16 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0b1328] border border-slate-800 flex items-center justify-center mb-4 shadow-inner">
              <svg className="w-8 h-8 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No matching properties found</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              We couldn't find any listings matching your active filters. Try loosening your price or location constraints.
            </p>
            <button
              onClick={loadProperties}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Properties Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={getImageUrl(property.images?.[0])}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />

                  {/* Gradient bottom shadow on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Property Type Badge (Top-Left) */}
                  {property.property_type && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-md">
                        {property.property_type}
                      </span>
                    </div>
                  )}

                  {/* Availability Badge (Top-Right) */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md shadow-md ${
                      property.availability
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                        : "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${property.availability ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                      {property.availability ? "Available" : "Occupied"}
                    </span>
                  </div>

                  {/* Price Tag (Bottom-Left) */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/70 text-cyan-400 text-base font-extrabold shadow-lg flex items-center gap-1">
                      ৳ {typeof property.price === "number" ? property.price.toLocaleString() : property.price}
                      <span className="text-[11px] text-slate-400 font-normal"> / mo</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight line-clamp-1 group-hover:text-cyan-300 transition-colors duration-200">
                      {property.title}
                    </h2>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
                      <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="truncate">{property.location}</p>
                    </div>

                    {/* Description */}
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {property.description}
                    </p>

                    {/* Spec Strip */}
                    <div className="mt-4 flex items-center justify-between bg-[#0b1328] rounded-xl px-3.5 py-2.5 border border-slate-800 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span><strong className="text-white font-semibold">{property.bedrooms}</strong> {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
                      </div>
                      <span className="w-px h-3.5 bg-slate-800" />
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><strong className="text-white font-semibold">{property.bathrooms}</strong> {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
                      </div>
                      <span className="w-px h-3.5 bg-slate-800" />
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                        <span><strong className="text-white font-semibold">{property.area}</strong> sqft</span>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button 
                    onClick={() => navigate(`/view-property/${property.id}`)}
                    className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Property Details</span>
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
