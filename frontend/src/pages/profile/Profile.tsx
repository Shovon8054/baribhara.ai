import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getProfile,
    getMyProperties,
} from "../../services/profile.service";
import api from "../../api/axios";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    profile_image?: string;
}

interface Property {
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
    created_at: string;
}

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);

    const [loading, setLoading] = useState(true);
    const [propertyLoading, setPropertyLoading] = useState(true);

    // =========================
    // FETCH PROFILE
    // =========================

    const fetchProfile = async () => {
        try {
            const response = await getProfile();

            // Your service returns response.data
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // FETCH MY PROPERTIES
    // =========================

    const fetchMyProperties = async () => {
        try {
            const response = await getMyProperties();

            // Your service returns response.data
            setProperties(response.data || []);
        } catch (error) {
            console.error(
                "Failed to fetch properties:",
                error
            );
        } finally {
            setPropertyLoading(false);
        }
    };

    // =========================
    // DELETE PROPERTY
    // =========================

    const handleDelete = async (propertyId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this property?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/property/${propertyId}`);

            // Remove from UI immediately
            setProperties((prev) =>
                prev.filter(
                    (property) => property.id !== propertyId
                )
            );

            alert("Property deleted successfully.");
        } catch (error: any) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete property."
            );
        }
    };

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        fetchProfile();
        fetchMyProperties();
    }, []);

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">
                    Loading profile...
                </p>
            </div>
        );
    }

    // =========================
    // PROFILE
    // =========================

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* =========================
        USER INFORMATION
    ========================= */}
                <div className="max-w-3xl mx-auto mb-12">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                    My Profile
                                </h1>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    Manage your personal information
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-medium hover:from-cyan-600 hover:to-indigo-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit Profile
                            </button>
                            <button
                                onClick={() => navigate("/subscription")}
                                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-300">

                        {/* Profile Image */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-xl shadow-cyan-500/10">
                                    {user?.profile_image ? (
                                        <img
                                            src={`http://localhost:8081${user.profile_image}`}
                                            alt={user?.name || "Profile"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-white">
                                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Edit Avatar Overlay */}
                                <button
                                    onClick={() => navigate("/edit-profile")}
                                    className="absolute bottom-0 right-0 p-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* User Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30 hover:border-cyan-500/20 transition-colors duration-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Full Name</span>
                                </div>
                                <p className="text-base font-semibold text-white mt-0.5">
                                    {user?.name || "Not provided"}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30 hover:border-cyan-500/20 transition-colors duration-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</span>
                                </div>
                                <p className="text-base font-semibold text-white mt-0.5">
                                    {user?.email || "Not provided"}
                                </p>
                            </div>

                            {/* Phone */}
                            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30 hover:border-cyan-500/20 transition-colors duration-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</span>
                                </div>
                                <p className="text-base font-semibold text-white mt-0.5">
                                    {user?.phone || "Not provided"}
                                </p>
                            </div>

                            {/* Role */}
                            <div className="bg-slate-900/30 rounded-xl p-4 border border-slate-700/30 hover:border-cyan-500/20 transition-colors duration-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</span>
                                </div>
                                <p className="mt-0.5">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                        {user?.role || "Tenant"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================
        MY PROPERTIES
    ========================= */}
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    My Properties
                                </h2>
                                <p className="text-sm text-slate-400 mt-0.5">
                                    {properties.length} {properties.length === 1 ? 'property' : 'properties'} listed
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

                    {/* Properties Grid */}
                    {propertyLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                                <p className="text-sm text-slate-400">Loading properties...</p>
                            </div>
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
                            <div className="w-16 h-16 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/20">
                                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">
                                No properties yet
                            </h3>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-400"
                                >
                                    {/* Image */}
                                    <div className="relative overflow-hidden h-52 sm:h-56 bg-slate-900/50">
                                        {property.images?.length > 0 ? (
                                            <img
                                                src={`http://localhost:8081${property.images[0]}`}
                                                alt={property.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900/50 flex items-center justify-center">
                                                <div className="text-center">
                                                    <svg className="w-10 h-10 text-slate-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-sm text-slate-500">No Image</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Availability Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-lg ${property.availability
                                                    ? "bg-emerald-500/90 backdrop-blur-sm text-white shadow-emerald-500/30"
                                                    : "bg-red-500/90 backdrop-blur-sm text-white shadow-red-500/30"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${property.availability ? "bg-white animate-pulse" : "bg-white"}`}></span>
                                                {property.availability ? "Available" : "Unavailable"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 sm:p-6">
                                        <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300">
                                            {property.title}
                                        </h3>

                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <p className="text-sm text-slate-400 truncate">{property.location}</p>
                                        </div>

                                        <p className="text-2xl font-bold text-cyan-400 mt-3">
                                            ৳ {Number(property.price).toLocaleString()}
                                        </p>

                                        {/* Features */}
                                        <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                {property.bedrooms}
                                            </span>
                                            <span className="w-px h-4 bg-slate-700"></span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {property.bathrooms}
                                            </span>
                                            <span className="w-px h-4 bg-slate-700"></span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                                </svg>
                                                {property.area} sqft
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-slate-400">
                                            Type: <span className="text-white font-medium">{property.property_type}</span>
                                        </p>

                                        {/* Action Buttons */}
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
                                                onClick={() => handleDelete(property.id)}
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
        </div>
    );
};

export default Profile;