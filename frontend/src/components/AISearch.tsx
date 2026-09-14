import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { aiSearch } from "../services/ai.service";
import { getImageUrl, DEFAULT_FALLBACK_IMAGE } from "../utils/imageUrl";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number | string;
  bedrooms: number;
  bathrooms: number;
  area: number | string;
  property_type?: string;
  availability?: boolean;
  images?: string[];
  description?: string;
}

const SAMPLE_PROMPTS = [
  { label: "Family Flat in Dhanmondi", query: "Need a 3-bedroom family apartment under 30k in Dhanmondi with parking and lift" },
  { label: "Bachelor Studio in Mirpur", query: "Looking for bachelor-friendly studio or 1-bed flat under 15k in Mirpur" },
  { label: "Luxury Flat in Gulshan", query: "Furnished 3-bedroom luxury apartment with generator in Gulshan" },
  { label: "Affordable House in Uttara", query: "2 bedroom apartment under 22000 in Uttara near metro station" },
];

const AISearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (overrideQuery?: string) => {
    const textToSearch = overrideQuery !== undefined ? overrideQuery : query;
    if (!textToSearch.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const response = await aiSearch(textToSearch.trim());
      setProperties(response.data ?? []);
    } catch (error) {
      console.error("AI search failed:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (promptText: string) => {
    setQuery(promptText);
    handleSearch(promptText);
  };

  return (
    <div className="w-full">
      {/* =========================================================
          PROMPT INPUT CONSOLE
      ========================================================= */}
      <div className="relative group">
        {/* Ambient Halo Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />

        {/* Input Box Card */}
        <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl shadow-black/40 transition-all duration-300 group-hover:border-cyan-500/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Left AI Icon & Input */}
            <div className="relative flex-1 flex items-center">
              <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-cyan-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Describe your desired home (e.g. 3-bed flat in Dhanmondi under 30k with lift)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleSearch();
                }}
                className="w-full py-3 bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none"
              />

              {/* Clear button when typed */}
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors mr-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Right: Search CTA Button */}
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-7 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Ideas / Example Prompts */}
          <div className="mt-3.5 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Try asking:
            </span>

            {SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => handlePromptClick(sample.query)}
                className="px-3 py-1 rounded-xl bg-[#0b1328] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-xs font-medium transition-all duration-200"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          RESULTS AREA
      ========================================================= */}
      <div className="mt-10">

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 px-8 py-6 rounded-3xl shadow-xl">
              <div className="relative w-12 h-12">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-fuchsia-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.2s" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Google Gemini is analyzing your request...</p>
                <p className="text-xs text-slate-400 mt-0.5">Extracting location, budget, and matching database listings</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        {!loading && hasSearched && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-sm sm:text-base font-bold text-white">
                {properties.length} {properties.length === 1 ? "matching property" : "matching properties"} found
              </p>
            </div>

            <button
              onClick={() => {
                setQuery("");
                setProperties([]);
                setHasSearched(false);
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Clear Results
            </button>
          </div>
        )}

        {/* No Results Found */}
        {!loading && hasSearched && properties.length === 0 && (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0b1328] border border-slate-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No properties matched this prompt</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6">
              Try adjusting your price range or specifying a broader area like "Dhanmondi", "Mirpur", or "Gulshan".
            </p>
            <button
              onClick={() => handleSearch("apartments in Dhaka under 40000")}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-all duration-200"
            >
              Try "Apartments in Dhaka under 40,000"
            </button>
          </div>
        )}

        {/* Initial Empty State before Searching */}
        {!loading && !hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                ),
                title: "Conversational Search",
                desc: "Talk like you would to a friend. No complex multi-select checkboxes needed.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: "Smart Extraction",
                desc: "Gemini AI instantly extracts budget caps, bedroom counts, and tenant restrictions.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                ),
                title: "Bilingual English & Bangla",
                desc: "Search in everyday English or Bengali with Dhaka neighborhood awareness.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 sm:p-6 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {feature.icon}
                  </svg>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">{feature.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Results Property Grid */}
        {!loading && properties.length > 0 && (
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

                  {/* Gradient shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  {/* Property Type Badge */}
                  {property.property_type && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-md">
                        {property.property_type}
                      </span>
                    </div>
                  )}

                  {/* Price Tag */}
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
                    {property.description && (
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>
                    )}

                    {/* Spec Strip */}
                    <div className="mt-4 flex items-center justify-between bg-[#0b1328] rounded-xl px-3.5 py-2.5 border border-slate-800 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span><strong className="text-white font-semibold">{property.bedrooms}</strong> Beds</span>
                      </div>
                      <span className="w-px h-3.5 bg-slate-800" />
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><strong className="text-white font-semibold">{property.bathrooms}</strong> Baths</span>
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

                  {/* View Details CTA */}
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

export default AISearch;
