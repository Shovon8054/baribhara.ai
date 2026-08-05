import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { compareProperties } from "../../services/comparison.service";
import { getFavorites, removeFavorite } from "../../services/favorite.service";

interface FavoriteProperty {
  id: string;
  title: string;
  price: number | string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number | string;
  property_type?: string;
  images: string[];
  amenities?: string[];
  nearby_facilities?: string[];
}

type SortOption = "recent" | "price" | "area";

const Favorite = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [comparison, setComparison] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error("Unable to load favorites:", error);
        toast.error("Unable to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const sortedFavorites = useMemo(() => {
    const items = [...favorites];
    if (sortBy === "price") {
      return items.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === "area") {
      return items.sort((a, b) => Number(b.area) - Number(a.area));
    }
    return items;
  }, [favorites, sortBy]);

  const averagePrice = favorites.length
    ? Math.round(favorites.reduce((total, property) => total + Number(property.price), 0) / favorites.length)
    : 0;

  const handleRemove = async (propertyId: string) => {
    try {
      await removeFavorite(propertyId);
      setFavorites((items) => items.filter((property) => property.id !== propertyId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Unable to remove favorite:", error);
      toast.error("Unable to remove favorite.");
    }
  };

  const handleComparison = async () => {
    try {
      setLoadingComparison(true);
      const response = await compareProperties();
      setComparison(response.comparison);
      toast.success("Comparison complete!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to compare properties.");
    } finally {
      setLoadingComparison(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 grid place-items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-400 mt-4">Loading your saved properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Saved Properties</h1>
            <p className="text-sm text-slate-400 mt-1">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} in your collection
            </p>
          </div>
          <Link
            to="/properties"
            className="px-4 py-2 text-sm font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition"
          >
            Browse More
          </Link>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-20 mt-6 bg-slate-900/50 rounded-xl border border-slate-800">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-white">No favorites yet</h3>
            <p className="text-sm text-slate-400 mt-2">Start saving properties you love</p>
            <Link
              to="/properties"
              className="inline-block mt-6 px-6 py-2.5 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition"
            >
              Explore Properties
            </Link>
          </div>
        ) : (
          <>
            {/* AI Compare Section */}
            <div className="mt-6 bg-gradient-to-r from-slate-900/80 to-slate-800/50 rounded-xl border border-slate-800 p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">AI Property Comparison</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {favorites.length >= 2
                      ? `Compare ${favorites.length} properties side by side`
                      : `Add ${2 - favorites.length} more ${favorites.length === 1 ? 'property' : 'properties'} to compare`}
                  </p>
                </div>
                <button
                  onClick={handleComparison}
                  disabled={loadingComparison || favorites.length < 2}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg hover:from-violet-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20"
                >
                  {loadingComparison ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">✨ Compare with AI</span>
                  )}
                </button>
              </div>

              {/* Quick Stats for Comparison */}
              {favorites.length >= 2 && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500">Price Range</p>
                    <p className="text-sm font-medium text-white mt-0.5">
                      ৳ {Math.min(...favorites.map(p => Number(p.price))).toLocaleString()} - 
                      ৳ {Math.max(...favorites.map(p => Number(p.price))).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Avg Bedrooms</p>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {(favorites.reduce((acc, p) => acc + p.bedrooms, 0) / favorites.length).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Avg Area</p>
                    <p className="text-sm font-medium text-white mt-0.5">
                      {(favorites.reduce((acc, p) => acc + Number(p.area), 0) / favorites.length).toFixed(0)} sqft
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Insights - Dynamic */}
            {comparison && (
              <div className="mt-4 bg-gradient-to-r from-violet-950/40 to-purple-950/40 border border-violet-800/30 rounded-xl p-6 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-violet-300">AI Recommendation</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">Live</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {comparison}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison Table - Dynamic */}
            {favorites.length >= 2 && (
              <div className="mt-6 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800">
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase sticky left-0 bg-slate-900">
                          Feature
                        </th>
                        {favorites.map((property) => (
                          <th key={property.id} className="px-4 py-3 text-left text-xs font-medium text-white min-w-[120px]">
                            {property.title.length > 20 ? property.title.substring(0, 20) + '...' : property.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { 
                          label: 'Price', 
                          value: (p: FavoriteProperty) => `৳ ${Number(p.price).toLocaleString()}`,
                          highlight: (p: FavoriteProperty) => Number(p.price) === Math.min(...favorites.map(f => Number(f.price)))
                        },
                        { label: 'Location', value: (p: FavoriteProperty) => p.location },
                        { label: 'Bedrooms', value: (p: FavoriteProperty) => p.bedrooms },
                        { label: 'Bathrooms', value: (p: FavoriteProperty) => p.bathrooms },
                        { label: 'Area', value: (p: FavoriteProperty) => `${p.area} sqft` },
                        { label: 'Type', value: (p: FavoriteProperty) => p.property_type || 'N/A' },
                        { 
                          label: 'Amenities', 
                          value: (p: FavoriteProperty) => {
                            if (!p.amenities || p.amenities.length === 0) return 'N/A';
                            const display = p.amenities.slice(0, 3).join(', ');
                            return p.amenities.length > 3 ? `${display} +${p.amenities.length - 3} more` : display;
                          }
                        },
                      ].map((row, idx) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-slate-900/30' : ''} hover:bg-slate-800/30 transition`}>
                          <td className="px-4 py-3 text-xs font-medium text-slate-400 sticky left-0 bg-inherit">
                            {row.label}
                          </td>
                          {favorites.map((property) => {
                            const isHighlighted = row.highlight && row.highlight(property);
                            return (
                              <td key={property.id} className={`px-4 py-3 text-sm ${isHighlighted ? 'text-emerald-400 font-semibold' : 'text-slate-300'}`}>
                                {row.value(property)}
                                {isHighlighted && (
                                  <span className="ml-1 text-xs text-emerald-500">★</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {sortedFavorites.map((property) => (
                <div key={property.id} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition group">
                  {/* Image */}
                  <div className="relative h-48 bg-slate-800 overflow-hidden">
                    <img
                      src={property.images?.[0] || '/placeholder.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                    />
                    <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded-lg text-sm font-semibold text-white">
                      ৳ {Number(property.price).toLocaleString()}
                    </div>
                    {property.property_type && (
                      <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded-lg text-xs text-slate-300">
                        {property.property_type}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white truncate">{property.title}</h3>
                    <p className="text-sm text-slate-400 truncate mt-1">{property.location}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                      <span>{property.bedrooms} beds</span>
                      <span>•</span>
                      <span>{property.bathrooms} baths</span>
                      <span>•</span>
                      <span>{property.area} sqft</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => navigate(`/view-property/${property.id}`)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRemove(property.id)}
                        className="px-3 py-2 text-sm font-medium text-slate-400 border border-slate-700 rounded-lg hover:border-red-500/50 hover:text-red-400 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorite;