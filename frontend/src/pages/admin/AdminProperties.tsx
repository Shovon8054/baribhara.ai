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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Manage Properties
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View and manage all properties listed on the platform.
                    </p>
                </div>

                {/* Search Bar and Statistics */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white border rounded-xl p-5 mb-8 shadow-sm">
                    <div className="flex-1 w-full sm:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search properties by title, location, type, or owner..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                            <p className="text-gray-500 text-sm">
                                Total Properties
                            </p>
                            <p className="text-3xl font-bold text-gray-800">
                                {filteredProperties.length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                {filteredProperties.length === 0 ? (
                    <div className="bg-white border rounded-xl p-12 text-center">

                        <h2 className="text-xl font-semibold text-gray-700">
                            {searchTerm ? "No Properties Found Matching Your Search" : "No Properties Found"}
                        </h2>

                        <p className="text-gray-500 mt-2">
                            {searchTerm ? "Try adjusting your search terms." : "There are currently no properties listed."}
                        </p>

                    </div>
                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {filteredProperties.map((property) => (

                            <div
                                key={property.id}
                                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >

                                {/* Property Image */}
                                <div className="h-52 bg-gray-200">

                                    {property.images &&
                                        property.images.length > 0 ? (

                                        <img
                                            src={`http://localhost:8081${property.images[0]}`}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>

                                    )}

                                </div>

                                {/* Property Information */}
                                <div className="p-5">

                                    <div className="flex justify-between items-start gap-3">

                                        <h2 className="text-lg font-bold text-gray-800">
                                            {property.title}
                                        </h2>

                                    </div>

                                    <p className="text-sm text-gray-500 mt-2">
                                        📍 {property.location}
                                    </p>

                                    <p className="text-xl font-bold text-blue-600 mt-4">
                                        ৳{Number(
                                            property.price
                                        ).toLocaleString()}
                                    </p>

                                    {/* Basic Details */}
                                    <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-gray-600">

                                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                                            <p className="font-semibold">
                                                {property.bedrooms}
                                            </p>

                                            <p className="text-xs">
                                                Beds
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                                            <p className="font-semibold">
                                                {property.bathrooms}
                                            </p>

                                            <p className="text-xs">
                                                Baths
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                                            <p className="font-semibold">
                                                {property.area}
                                            </p>

                                            <p className="text-xs">
                                                sqft
                                            </p>
                                        </div>

                                    </div>

                                    {/* Property Type */}
                                    <div className="mt-4 text-sm">

                                        <p className="text-gray-600">
                                            <strong>
                                                Type:
                                            </strong>{" "}
                                            {property.property_type}
                                        </p>

                                        <p className="text-gray-600 mt-1">
                                            <strong>
                                                Furnished:
                                            </strong>{" "}
                                            {property.furnished
                                                ? "Yes"
                                                : "No"}
                                        </p>

                                    </div>

                                    {/* Owner */}
                                    <div className="border-t mt-4 pt-4">

                                        <p className="text-xs text-gray-400 uppercase">
                                            Property Owner
                                        </p>

                                        <p className="font-semibold text-gray-700 mt-1">
                                            {property.owner_name ||
                                                "Unknown"}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {property.owner_email ||
                                                "No email"}
                                        </p>

                                    </div>


                                    {/* Delete */}
                                    <button
                                        onClick={() =>
                                            handleDelete(property)
                                        }
                                        disabled={
                                            deleteLoading ===
                                            property.id
                                        }
                                        className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {deleteLoading ===
                                            property.id
                                            ? "Deleting..."
                                            : "Delete Property"}
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