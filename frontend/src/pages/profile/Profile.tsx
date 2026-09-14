import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
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
    is_verified?: boolean;
    created_at?: string;
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
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // =========================
    // FETCH DATA
    // =========================
    const fetchProfile = async () => {
        try {
            const response = await getProfile();
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyProperties = async () => {
        try {
            const response = await getMyProperties();
            setProperties(response.data || []);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setPropertyLoading(false);
        }
    };

    const handleDelete = async (propertyId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this property?"
        );
        if (!confirmed) return;

        try {
            await api.delete(`/property/${propertyId}`);
            setProperties((prev) => prev.filter((p) => p.id !== propertyId));
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to delete property.");
        }
    };

    const copyToClipboard = (text: string, fieldName: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    useEffect(() => {
        fetchProfile();
        fetchMyProperties();
    }, []);

    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })
        : "Member";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#060b18]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12">
                        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-fuchsia-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.2s" }} />
                    </div>
                    <p className="text-sm font-medium text-slate-400 tracking-wide">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const isOwner = user?.role?.toUpperCase() === "OWNER";

    return (
        <div className="min-h-screen bg-[#060b18] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden pb-16">
            {/* Ambient Background Lights */}
            <div className="pointer-events-none absolute top-0 left-1/4 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />
            <div className="pointer-events-none absolute top-40 right-10 w-[450px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] -z-10" />
            <div className="pointer-events-none absolute bottom-20 left-1/3 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] -z-10" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">

                {/* =========================================================
                    1. EXECUTIVE PROFILE HEADER CARD
                ========================================================= */}
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mb-8">
                    {/* Top Accent Gradient Line */}
                    <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500" />

                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            
                            {/* Left: Avatar + Identity Details */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
                                
                                {/* Circular Avatar with Camera Badge */}
                                <div className="relative group flex-shrink-0">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-fuchsia-500 shadow-xl shadow-cyan-500/20">
                                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-950">
                                            {user?.profile_image ? (
                                                <img
                                                    src={getImageUrl(user.profile_image)}
                                                    alt={user?.name || "Profile"}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                                                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Camera Edit Overlay */}
                                    <button
                                        onClick={() => navigate("/edit-profile")}
                                        title="Change profile picture"
                                        className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 shadow-lg hover:bg-cyan-500 hover:text-white hover:border-cyan-400 transition-all duration-200 hover:scale-110 active:scale-95"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Names, Badges, Contact Strip */}
                                <div className="space-y-2 pt-1">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                            {user?.name || "Member"}
                                        </h1>

                                        {/* Role Badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${
                                            isOwner 
                                                ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-sm shadow-cyan-500/10" 
                                                : "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shadow-sm shadow-indigo-500/10"
                                        }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                            {user?.role || "TENANT"}
                                        </span>

                                        {/* Active Status Badge */}
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                            Active
                                        </span>
                                    </div>

                                    {/* Meta strip (Email, Phone, Joined) */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-slate-400 pt-0.5">
                                        {user?.email && (
                                            <span className="flex items-center gap-1.5 text-slate-300">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {user.email}
                                            </span>
                                        )}

                                        {user?.phone && (
                                            <>
                                                <span className="text-slate-600 hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1.5 text-slate-300">
                                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {user.phone}
                                                </span>
                                            </>
                                        )}

                                        {(user?.email || user?.phone) && (
                                            <span className="text-slate-600 hidden sm:inline">•</span>
                                        )}
                                        <span className="flex items-center gap-1.5 text-slate-400">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Joined {memberSince}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:pt-0 flex-shrink-0">
                                <button
                                    onClick={() => navigate("/edit-profile")}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Profile
                                </button>

                                <button
                                    onClick={() => navigate("/subscription")}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-fuchsia-400 hover:to-pink-400 shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    2. BENTO INFORMATION & ACTIVITY GRID
                ========================================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

                    {/* Left 2 Cols: Personal Details Card */}
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl">
                        
                        {/* Section Header */}
                        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-tight">Personal Information</h2>
                                    <p className="text-xs text-slate-400">Your verified account contact details</p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                            >
                                Edit Details
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Details Tiles 2x2 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Full Name */}
                            <div className="bg-[#0b1328]/80 rounded-xl p-4 border border-slate-800/70 hover:border-slate-700/90 transition-all duration-200">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Full Name</span>
                                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-base font-semibold text-white truncate">
                                    {user?.name || "Not provided"}
                                </p>
                            </div>

                            {/* Email Address */}
                            <div className="bg-[#0b1328]/80 rounded-xl p-4 border border-slate-800/70 hover:border-slate-700/90 transition-all duration-200">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email Address</span>
                                    <button
                                        onClick={() => copyToClipboard(user?.email || "", "email")}
                                        title="Copy email"
                                        className="text-slate-500 hover:text-cyan-400 transition-colors"
                                    >
                                        {copiedField === "email" ? (
                                            <span className="text-[10px] text-cyan-400 font-bold">Copied!</span>
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-base font-semibold text-white truncate">
                                    {user?.email || "Not provided"}
                                </p>
                            </div>

                            {/* Phone Number */}
                            <div className="bg-[#0b1328]/80 rounded-xl p-4 border border-slate-800/70 hover:border-slate-700/90 transition-all duration-200">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone Number</span>
                                    <button
                                        onClick={() => copyToClipboard(user?.phone || "", "phone")}
                                        title="Copy phone"
                                        className="text-slate-500 hover:text-cyan-400 transition-colors"
                                    >
                                        {copiedField === "phone" ? (
                                            <span className="text-[10px] text-cyan-400 font-bold">Copied!</span>
                                        ) : (
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-base font-semibold text-white truncate">
                                    {user?.phone || "Not provided"}
                                </p>
                            </div>

                            {/* Account Role */}
                            <div className="bg-[#0b1328]/80 rounded-xl p-4 border border-slate-800/70 hover:border-slate-700/90 transition-all duration-200">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Platform Role</span>
                                    <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-base font-semibold text-white">
                                        {user?.role === "OWNER" ? "Property Owner" : user?.role === "ADMIN" ? "Administrator" : "Tenant"}
                                    </p>
                                    <span className="text-xs text-slate-400">
                                        {user?.role === "OWNER" ? "(Landlord)" : "(Renter)"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right 1 Col: SaaS Plan & Quick Access */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between">
                        <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-bold text-white tracking-tight">Subscription Plan</h3>
                                </div>

                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 uppercase tracking-wide">
                                    Free Tier
                                </span>
                            </div>

                            {/* Plan Benefits Checklist */}
                            <ul className="space-y-3 mb-6 text-xs sm:text-sm text-slate-300">
                                <li className="flex items-center gap-2.5">
                                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>AI Natural Language Search</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Real-Time Landlord & Tenant Chat</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>AI Property Comparison & Insights</span>
                                </li>
                            </ul>
                        </div>

                        {/* Upgrade Banner Button */}
                        <button
                            onClick={() => navigate("/subscription")}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>Upgrade to Pro Plan</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* =========================================================
                    3. PROPERTIES SECTION (Executive Luxury Cards)
                ========================================================= */}
                <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    My Properties
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    {properties.length} {properties.length === 1 ? "property" : "properties"} listed on BariBhara.AI
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/create-property")}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 self-start sm:self-auto"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Property
                        </button>
                    </div>

                    {/* Properties List */}
                    {propertyLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                                <p className="text-xs text-slate-400">Loading your listings...</p>
                            </div>
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-10 sm:p-14 text-center">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0b1328] border border-slate-800 flex items-center justify-center mb-4 shadow-inner">
                                <svg className="w-8 h-8 text-cyan-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1.5">No properties listed yet</h3>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                                Publish your apartments, flats, or commercial spaces to connect directly with tenants.
                            </p>
                            <button
                                onClick={() => navigate("/create-property")}
                                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 inline-flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Your First Property
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 overflow-hidden hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                                        {property.images?.length > 0 ? (
                                            <img
                                                src={getImageUrl(property.images[0])}
                                                alt={property.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#0a1024] flex items-center justify-center text-slate-600">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Status Badge */}
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

                                        {/* Price Overlay */}
                                        <div className="absolute bottom-3 left-3">
                                            <span className="px-3 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-cyan-400 text-sm font-extrabold shadow-lg">
                                                ৳ {Number(property.price).toLocaleString()}
                                                <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                                                {property.title}
                                            </h3>

                                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
                                                <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="truncate">{property.location}</span>
                                            </div>

                                            {/* Specs Strip */}
                                            <div className="mt-4 flex items-center justify-between bg-[#0b1328] rounded-xl px-3 py-2 border border-slate-800 text-xs text-slate-300">
                                                <span className="flex items-center gap-1">
                                                    <span className="text-cyan-400 font-semibold">{property.bedrooms}</span> Beds
                                                </span>
                                                <span className="w-px h-3 bg-slate-800" />
                                                <span className="flex items-center gap-1">
                                                    <span className="text-cyan-400 font-semibold">{property.bathrooms}</span> Baths
                                                </span>
                                                <span className="w-px h-3 bg-slate-800" />
                                                <span className="flex items-center gap-1">
                                                    <span className="text-cyan-400 font-semibold">{property.area}</span> sqft
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-5 grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
                                            <Link
                                                to={`/view-property/${property.id}`}
                                                className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-600/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(property.id)}
                                                className="px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/50 text-slate-400 text-xs font-semibold hover:bg-rose-500/15 hover:text-rose-300 hover:border-rose-500/30 transition-all duration-200 flex items-center justify-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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