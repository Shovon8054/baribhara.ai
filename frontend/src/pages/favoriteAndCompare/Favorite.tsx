import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  getFavorites,
  removeFavorite,
} from "../../services/favorite.service";

const Favorite = () => {
    const navigate = useNavigate();
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await getFavorites();

      setFavorites(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (propertyId: string) => {
    try {
      await removeFavorite(propertyId);

      setFavorites((prev) =>
        prev.filter((item) => item.id !== propertyId)
      );

      alert("Removed from favorites");
    } catch (error) {
      console.log(error);
    }
  };

  if (favorites.length === 0) {
    return (
      <h2 className="text-center mt-10">
        No favorite properties yet.
      </h2>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

    {/* Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Favorites
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>
      </div>
      {/* =============================================AI BUTTON==================================================== */}
      <div className="flex flex-wrap items-center gap-3">
        {/* AI Comparison Button - Classic Elegant Design */}
        <button
          onClick={() => {/* AI Comparison logic */}}
          disabled={favorites.length < 2}
          className="
          group
          relative
          px-5 py-2.5 
          rounded-lg 
          bg-gradient-to-r from-purple-600 to-pink-600 
          text-white text-sm font-medium 
          hover:from-purple-700 hover:to-pink-700 
          shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 
          transition-all duration-300 
          flex items-center gap-2
          disabled:opacity-40 
          disabled:cursor-not-allowed 
          disabled:hover:shadow-lg
          overflow-hidden
          "
        >
          {/* Shine Effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          
          {/* Sparkle Icon */}
          <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          
          <span className="relative z-10">AI Comparison</span>
          
          {/* Classic Badge */}
          <span className="relative z-10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-white/20 text-white rounded-full border border-white/10">
            Beta
          </span>
          
          {/* Tooltip */}
          {favorites.length < 2 && (
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Need 2+ favorites to compare
            </span>
          )}
        </button>

{/* ================================================================================================== */}

        {/* Browse More Button - Classic Design */}
        <button
          onClick={() => navigate('/properties')}
          className="
          px-5 py-2.5 
          rounded-lg 
          border border-slate-600 
          text-slate-300 text-sm font-medium 
          hover:bg-slate-700/50 
          hover:border-cyan-500/30 
          hover:text-white 
          transition-all duration-300 
          flex items-center gap-2
          group
          "
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse More
        </button>
      </div>
    </div>

    {/* Favorites Grid */}
    {favorites.length === 0 ? (
      <div className="text-center py-20 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50">
        <div className="w-20 h-20 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/20">
          <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No favorites yet
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Start saving properties you love and they'll appear here
        </p>
        <button
          onClick={() => navigate('/properties')}
          className="mt-6 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
        >
          Browse Properties
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {favorites.map((property) => (
          <div
            key={property.id}
            className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-400"
          >
            {/* Image */}
            <div className="relative overflow-hidden h-56 sm:h-64 bg-slate-900/50">
              <img
                src={`http://localhost:8081${property.images?.[0]}`}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/uploads/properties/image-unavailable.svg";
                }}
              />
              
              {/* Price Badge */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg shadow-cyan-500/30">
                ৳ {typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
              </div>
              
              {/* Property Type Badge */}
              {property.property_type && (
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-cyan-400 px-3 py-1 rounded-lg text-xs font-medium border border-cyan-500/20 shadow-lg">
                  {property.property_type}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300">
                {property.title}
              </h2>

              <div className="flex items-center gap-1.5 mt-1.5">
                <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-slate-400 truncate">{property.location}</p>
              </div>

              {/* Features */}
              <div className="mt-4 flex items-center justify-between py-3 px-4 bg-slate-900/30 rounded-xl border border-slate-700/30">
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

              {/* Action Buttons - Classic & Elegant */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to={`/view-property/${property.id}`}
                  className="
                  px-3 py-2
                  bg-gradient-to-r from-cyan-500 to-indigo-500
                  text-white
                  text-xs
                  font-medium
                  rounded-lg
                  hover:from-cyan-600 hover:to-indigo-600
                  shadow-lg shadow-cyan-500/20
                  hover:shadow-cyan-500/40
                  transition-all
                  duration-300
                  flex items-center justify-center gap-1.5
                  group/btn
                  "
                >
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </Link>

                <button
                  onClick={() => handleRemove(property.id)}
                  className="
                  px-3 py-2
                  bg-slate-700/30
                  text-slate-400
                  text-xs
                  font-medium
                  rounded-lg
                  border border-slate-600/30
                  hover:bg-red-500/10
                  hover:text-red-400
                  hover:border-red-500/30
                  transition-all
                  duration-300
                  flex items-center justify-center gap-1.5
                  group/btn
                  "
                >
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  );
};

export default Favorite;
