import { useState } from "react";
import { aiSearch } from "../services/ai.service";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number | string;
  bedrooms: number;
  bathrooms: number;
  area: number | string;
  property_type?: string;
  images?: string[];
}

const AISearch = () => {
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await aiSearch(query.trim());
      setProperties(response.data ?? []);
    } catch (error) {
      console.error("AI search failed:", error);
      setProperties([]);
      alert("Search failed. Please check that the backend and Gemini API key are configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="mt-8">

    {/* Search Bar - Highlighted */}
    <div className="relative">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 rounded-2xl blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 rounded-2xl opacity-30"></div>
        
        {/* Search Container */}
        <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl border-2 border-cyan-500/50 p-4 sm:p-5 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Need a family apartment under 25k in Dhanmondi with parking..."
                        className="
                        w-full
                        pl-11 pr-4 py-3.5
                        bg-slate-900/80
                        border-2 border-cyan-500/30
                        rounded-xl
                        text-sm text-white
                        placeholder:text-slate-400
                        focus:outline-none
                        focus:ring-4
                        focus:ring-cyan-500/40
                        focus:border-cyan-400
                        transition-all
                        duration-300
                        hover:border-cyan-400/50
                        shadow-inner shadow-cyan-500/5
                        "
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") void handleSearch();
                        }}
                    />
                    {loading && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                    className="
                    px-8 py-3.5
                    bg-gradient-to-r from-cyan-500 to-cyan-600
                    text-white
                    text-sm
                    font-semibold
                    rounded-xl
                    hover:from-cyan-600 hover:to-cyan-700
                    shadow-lg shadow-cyan-500/30
                    hover:shadow-cyan-500/50
                    transition-all
                    duration-300
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    disabled:hover:shadow-lg
                    flex items-center justify-center gap-2
                    min-w-[120px]
                    relative
                    overflow-hidden
                    group
                    "
                >
                    {/* Button Shine Effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Searching...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span>Search</span>
                        </>
                    )}
                </button>
            </div>

            {/* Suggestions */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mr-1">
                    Quick Ideas:
                </span>
                {[
                    ["Family Apartment", "Need a family apartment under 25000 in Dhanmondi"],
                    ["Bachelor Flat", "Looking for bachelor flat under 15000 in Mirpur"],
                    ["Furnished Apartment", "Need a furnished apartment with lift in Uttara"],
                ].map(([label, suggestion]) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => setQuery(suggestion)}
                        className="
                        px-3.5 py-1.5
                        bg-slate-900/60
                        text-slate-300
                        text-xs
                        font-medium
                        rounded-full
                        border border-slate-700
                        hover:bg-slate-700/60
                        hover:border-cyan-500/40
                        hover:text-white
                        hover:shadow-lg hover:shadow-cyan-500/10
                        transition-all
                        duration-200
                        "
                    >
                        {label}
                    </button>
                ))}
            </div>
            
            {/* Decorative Element - Glow Dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-500 rounded-full blur-sm animate-pulse animation-delay-1000"></div>
        </div>
    </div>

    {/* Results Header */}
    {properties.length > 0 && (
        <div className="flex items-center justify-between mt-6 mb-4">
            <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm text-slate-400">
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                </span>
            </div>
            <button
                onClick={() => {
                    setQuery("");
                    // Optionally clear results
                }}
                className="text-xs text-slate-500 hover:text-cyan-400 transition-colors duration-200"
            >
                Clear results
            </button>
        </div>
    )}

    {/* Properties Grid */}
    {properties.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 mt-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/30">
                <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
                Start Your Search
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
                Describe your ideal property above and let our AI find the perfect matches for you.
            </p>
        </div>
    )}

    {/* Loading State */}
    {loading && properties.length === 0 && (
        <div className="text-center py-20 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 mt-6">
            <div className="w-16 h-16 mx-auto border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-slate-400">Searching for properties...</p>
        </div>
    )}

    {/* Results Grid */}
    {properties.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-4">
            {properties.map((property) => (
                <div
                    key={property.id}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 group"
                >
                    <div className="relative overflow-hidden h-56 sm:h-64">
                        <img
                            src={property.images?.[0] || "/uploads/properties/image-unavailable.svg"}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(event) => {
                                event.currentTarget.src = "/uploads/properties/image-unavailable.svg";
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
                    <div className="p-5 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight line-clamp-1">
                            {property.title}
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm text-slate-400 truncate">{property.location}</p>
                        </div>
                        <p className="text-2xl font-bold text-cyan-400 mt-3">
                            ৳ {typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
                        </p>
                        <div className="mt-4 flex items-center justify-between py-3 px-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="text-sm font-medium text-slate-300">{property.bedrooms} Bed</span>
                            </div>
                            <div className="w-px h-6 bg-slate-700"></div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-slate-300">{property.bathrooms} Bath</span>
                            </div>
                            <div className="w-px h-6 bg-slate-700"></div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                </svg>
                                <span className="text-sm font-medium text-slate-300">{property.area} sqft</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )}
    
    {/* Add animation delay for the second dot */}
    <style>{`
        .animation-delay-1000 {
            animation-delay: 1000ms;
        }
    `}</style>
</div>
  );
};

export default AISearch;
