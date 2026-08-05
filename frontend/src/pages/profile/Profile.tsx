import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, getMyProperties } from "../../services/profile.service";
import { deleteProperty } from "../../services/property.service";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  availability: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profile = await getProfile();
      setUser(profile.data);

      const myProperties = await getMyProperties();
      setProperties(myProperties.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (property: Property) => {
    if (!window.confirm(`Are you sure you want to delete "${property.title}"?`)) {
      return;
    }

    try {
      await deleteProperty(property.id);
      setProperties((currentProperties) =>
        currentProperties.filter((item) => item.id !== property.id)
      );
      toast.success("Property deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete this property. Please try again.");
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
 <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Profile Card */}

    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 sm:p-5 mb-6 hover:border-cyan-500/30 transition-all duration-300">
        {/* Header - Compact */}
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-cyan-500/20 flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                    My Profile
                </h2>
                <p className="text-[10px] text-slate-400">
                    Manage your account
                </p>
            </div>
        </div>

        {/* Details - Compact Grid */}
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/50">
                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Name</p>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">{user?.name || 'Not set'}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/50">
                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">{user?.email || 'Not set'}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/50">
                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Phone</p>
                <p className="text-xs font-semibold text-white mt-0.5 truncate">{user?.phone || 'Not set'}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700/50">
                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">Role</p>
                <p className="mt-0.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[9px] font-medium">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse"></span>
                        {user?.role || 'Tenant'}
                    </span>
                </p>
            </div>
        </div>
    </div>

        {/* My Properties */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        My Properties
                    </h2>
                    <p className="text-sm text-slate-400">
                        {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
                    </p>
                </div>
            </div>
            <button
                onClick={() => navigate('/create-property')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Property
            </button>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/30">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                    No properties found
                </h3>
                <p className="text-sm text-slate-400">
                    Start by adding your first property
                </p>
                <button
                    onClick={() => navigate('/create-property')}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                >
                    Add Your First Property
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
                        <div className="relative overflow-hidden h-48 sm:h-52">
                            <img
                                src={property.images?.[0] || "/uploads/properties/image-unavailable.svg"}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Availability Badge */}
                            <div className="absolute top-3 right-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-lg ${
                                    property.availability
                                        ? "bg-emerald-500 text-white"
                                        : "bg-red-500 text-white"
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        property.availability ? "bg-white" : "bg-white"
                                    }`}></span>
                                    {property.availability ? "Available" : "Not Available"}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-white tracking-tight line-clamp-1">
                                {property.title}
                            </h3>

                            <div className="flex items-center gap-1.5 mt-1.5">
                                <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-sm text-slate-400 truncate">
                                    {property.location}
                                </p>
                            </div>

                            <p className="text-2xl font-bold text-cyan-400 mt-3">
                                ৳ {property.price?.toLocaleString() || property.price}
                            </p>

                            {/* Property Details */}
                            <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                                {property.bedrooms && (
                                    <>
                                        <span>{property.bedrooms} Beds</span>
                                        <span className="w-px h-3 bg-slate-700"></span>
                                    </>
                                )}
                                {property.bathrooms && (
                                    <>
                                        <span>{property.bathrooms} Baths</span>
                                        <span className="w-px h-3 bg-slate-700"></span>
                                    </>
                                )}
                                {property.area && (
                                    <span>{property.area} sqft</span>
                                )}
                            </div>

                            {/* Action Buttons - Classy & Standard */}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {/* View Details Button */}
                                <button
                                    onClick={() => navigate(`/view-property/${property.id}`)}
                                    className="
                                    px-3 py-1.5
                                    bg-gradient-to-r from-cyan-500 to-cyan-600
                                    text-white
                                    text-[10px]
                                    font-medium
                                    rounded
                                    hover:from-cyan-600 hover:to-cyan-700
                                    shadow-lg shadow-cyan-500/20
                                    hover:shadow-cyan-500/40
                                    transition-all
                                    duration-300
                                    flex items-center justify-center gap-1.5
                                    group/btn
                                    "
                                >
                                    <svg className="w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteProperty(property)}
                                    className="
                                    px-3 py-1.5
                                    bg-slate-700/30
                                    text-slate-400
                                    text-[10px]
                                    font-medium
                                    rounded
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
                                    <svg className="w-3 h-3 transition-transform duration-200 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
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

export default Profile;
