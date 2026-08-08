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
        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* =========================
          USER INFORMATION
      ========================= */}

            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    My Profile
                </h1>

                <button
                    onClick={() => navigate("/edit-profile")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Edit Profile
                </button>

                <button
                    onClick={() => navigate("/subscription")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Subscribe
                </button>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">

                    {/* Profile Image */}
                    <div className="flex justify-center mb-8">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">

                            {user?.profile_image ? (
                                <img
                                    src={`http://localhost:8081${user.profile_image}`}
                                    alt={user?.name || "Profile"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-4xl text-gray-500">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* User Information */}
                    <div className="grid sm:grid-cols-2 gap-6">

                        {/* Full Name */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Full Name
                            </p>

                            <p className="text-base font-semibold text-gray-800">
                                {user?.name || "Not provided"}
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Email
                            </p>

                            <p className="text-base font-semibold text-gray-800">
                                {user?.email || "Not provided"}
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Phone
                            </p>

                            <p className="text-base font-semibold text-gray-800">
                                {user?.phone || "Not provided"}
                            </p>
                        </div>

                        {/* Role */}
                        <div>
                            <p className="text-sm text-gray-500 mb-1">
                                Role
                            </p>

                            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-600">
                                {user?.role || "Not provided"}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* =========================
          MY PROPERTIES
      ========================= */}

            <div>

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        My Properties
                    </h2>
                    <button
                        onClick={() => navigate('/create-property')}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Property
                    </button>

                    <span className="text-gray-500">
                        {properties.length}{" "}
                        {properties.length === 1
                            ? "Property"
                            : "Properties"}
                    </span>

                </div>

                {propertyLoading ? (
                    <p>Loading properties...</p>
                ) : properties.length === 0 ? (

                    <div className="border rounded-xl p-10 text-center">
                        <p className="text-gray-500">
                            You haven't created any properties yet.
                        </p>
                    </div>

                ) : (

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        {properties.map((property) => (

                            <div
                                key={property.id}
                                className="border rounded-2xl overflow-hidden bg-white shadow-sm"
                            >

                                {/* IMAGE */}

                                {property.images?.length > 0 ? (

                                    <img
                                        src={`http://localhost:8081${property.images[0]}`}
                                        alt={property.title}
                                        className="w-full h-52 object-cover"
                                    />

                                ) : (

                                    <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                                        <p className="text-gray-500">
                                            No Image
                                        </p>
                                    </div>

                                )}

                                {/* CONTENT */}

                                <div className="p-5">

                                    <h3 className="text-xl font-bold">
                                        {property.title}
                                    </h3>

                                    <p className="text-gray-500 mt-1">
                                        {property.location}
                                    </p>

                                    <p className="text-green-600 text-lg font-bold mt-3">
                                        ৳{" "}
                                        {Number(
                                            property.price
                                        ).toLocaleString()}
                                    </p>

                                    <div className="flex gap-4 text-sm text-gray-600 mt-3">

                                        <span>
                                            🛏 {property.bedrooms}
                                        </span>

                                        <span>
                                            🚿 {property.bathrooms}
                                        </span>

                                        <span>
                                            📐 {property.area}
                                        </span>

                                    </div>

                                    <p className="mt-2 text-sm">
                                        Type:{" "}
                                        <span className="font-medium">
                                            {property.property_type}
                                        </span>
                                    </p>

                                    <p className="mt-2 text-sm">
                                        Status:{" "}
                                        <span
                                            className={
                                                property.availability
                                                    ? "text-green-600 font-medium"
                                                    : "text-red-600 font-medium"
                                            }
                                        >
                                            {property.availability
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>
                                    </p>

                                    {/* BUTTONS */}

                                    <div className="flex gap-3 mt-5">

                                        <Link
                                            to={`/view-property/${property.id}`}
                                            className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                        >
                                            View
                                        </Link>

                                        <button
                                            onClick={() =>
                                                handleDelete(property.id)
                                            }
                                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                                        >
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