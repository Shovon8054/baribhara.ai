import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getAdminProperties,
    deleteAdminProperty,
} from "../../services/adminProperty.service";

interface Property {
    id: string;
    title: string;
    description?: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    location: string;
    property_type: string;
    furnished: boolean;
    family_bachelor?: string;
    parking?: boolean;
    lift?: boolean;
    pet_friendly?: boolean;
    availability: boolean;
    images?: string[];

    owner_id: string;
    owner_name?: string;
    owner_email?: string;

    views?: number;
    favorites_count?: number;
    created_at?: string;
}

const AdminProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchProperties = async () => {
        try {
            setLoading(true);

            const data = await getAdminProperties();

            setProperties(data || []);
        } catch (error: any) {
            console.error("Failed to fetch properties:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load properties"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleDelete = async (property: Property) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${property.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(property.id);

            await deleteAdminProperty(property.id);

            setProperties((prev) =>
                prev.filter((item) => item.id !== property.id)
            );

            toast.success("Property deleted successfully");
        } catch (error: any) {
            console.error("Delete property error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete property"
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    // Filter properties based on search term
    const filteredProperties = properties.filter((property) =>
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.property_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-gray-500">
                        Loading properties...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Manage Properties
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                View and manage all properties listed on the platform
                            </p>
                        </div>
                    </div>

                    {/* Total Properties Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        {filteredProperties.length} Properties
                    </span>
                </div>

                {/* Search Bar */}
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-5 mb-8 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex-1 w-full sm:w-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search properties by title, location, type, or owner..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="
                w-full
                px-4 py-2.5 pl-10
                bg-slate-900/50
                border border-slate-700
                rounded-lg
                text-sm text-white
                placeholder:text-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-cyan-500/30
                focus:border-cyan-500
                transition-all
                duration-200
                hover:border-slate-600
              "
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-2.5 text-slate-500 hover:text-white transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Properties</p>
                                <p className="text-3xl font-bold text-white">{filteredProperties.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredProperties.length === 0 ? (
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/20">
                            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-1">
                            {searchTerm ? "No Properties Found" : "No Properties Listed"}
                        </h2>
                        <p className="text-sm text-slate-400">
                            {searchTerm ? "Try adjusting your search terms." : "There are currently no properties on the platform."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                        {filteredProperties.map((property) => (
                            <div
                                key={property.id}
                                className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-400"
                            >
                                {/* Property Image */}
                                <div className="relative overflow-hidden h-52 bg-slate-900/50">
                                    {property.images && property.images.length > 0 ? (
                                        <img
                                            src={`http://localhost:8081${property.images[0]}`}
                                            alt={property.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <svg className="w-10 h-10 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm text-slate-500">No Image</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Property Type Badge */}
                                    {property.property_type && (
                                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-cyan-400 px-3 py-1 rounded-lg text-xs font-medium border border-cyan-500/20 shadow-lg">
                                            {property.property_type}
                                        </div>
                                    )}
                                </div>

                                {/* Property Information */}
                                <div className="p-5 sm:p-6">
                                    <div className="flex justify-between items-start gap-3">
                                        <h2 className="text-lg font-semibold text-white tracking-tight line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300">
                                            {property.title}
                                        </h2>
                                    </div>

                                    <p className="text-sm text-slate-400 mt-1.5 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {property.location}
                                    </p>

                                    <p className="text-2xl font-bold text-cyan-400 mt-3">
                                        ৳ {Number(property.price).toLocaleString()}
                                    </p>

                                    {/* Basic Details */}
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        <div className="bg-slate-900/30 rounded-lg p-2 text-center border border-slate-700/30">
                                            <p className="text-sm font-semibold text-white">{property.bedrooms}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Beds</p>
                                        </div>
                                        <div className="bg-slate-900/30 rounded-lg p-2 text-center border border-slate-700/30">
                                            <p className="text-sm font-semibold text-white">{property.bathrooms}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Baths</p>
                                        </div>
                                        <div className="bg-slate-900/30 rounded-lg p-2 text-center border border-slate-700/30">
                                            <p className="text-sm font-semibold text-white">{property.area}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">sqft</p>
                                        </div>
                                    </div>

                                    {/* Furnished Status */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Furnished:</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${property.furnished
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : "bg-slate-700/30 text-slate-400 border border-slate-600/30"
                                            }`}>
                                            {property.furnished ? "Yes" : "No"}
                                        </span>
                                    </div>

                                    {/* Owner */}
                                    <div className="border-t border-slate-700/50 mt-4 pt-4">
                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Property Owner</p>
                                        <p className="font-semibold text-white mt-1 text-sm">{property.owner_name || "Unknown"}</p>
                                        <p className="text-xs text-slate-400">{property.owner_email || "No email"}</p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(property)}
                                        disabled={deleteLoading === property.id}
                                        className="w-full mt-4 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deleteLoading === property.id ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Deleting...
                                            </span>
                                        ) : (
                                            "Delete Property"
                                        )}
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

export default AdminProperties;