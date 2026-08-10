import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getAdminUsers,
    blockUser,
    unblockUser,
} from "../../services/adminUser.service";

interface User {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    role: "TENANT" | "OWNER" | "ADMIN";
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
}

const AdminUsers = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Get users
    const fetchUsers = async () => {

        try {

            setLoading(true);

            const data = await getAdminUsers();

            setUsers(data || []);

        } catch (error: any) {

            console.error("Failed to fetch users:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load users"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/signin");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.role !== "ADMIN") {
                navigate("/home");
                return;
            }
        } catch {
            navigate("/signin");
            return;
        }

        fetchUsers();
    }, [navigate]);

    // Block / Unblock
    const handleStatusChange = async (
        user: User
    ) => {

        try {

            setActionLoading(user.id);

            if (user.is_active) {

                await blockUser(user.id);

                toast.success(
                    `${user.full_name} has been blocked`
                );

            } else {

                await unblockUser(user.id);

                toast.success(
                    `${user.full_name} has been unblocked`
                );
            }

            // Refresh users
            await fetchUsers();

        } catch (error: any) {

            console.error(
                "Failed to update user status:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update user status"
            );

        } finally {

            setActionLoading(null);

        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter((user) =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-500">
                        Loading users...
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
                        Manage Users
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View and manage all registered users
                    </p>

                </div>

                {/* Search Bar and User count */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white border rounded-xl p-5 mb-6">

                    <div className="flex-1 w-full sm:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users by name, email, phone or role..."
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
                                Total Users
                            </p>
                            <p className="text-2xl font-bold text-gray-800">
                                {filteredUsers.length}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Users Table */}
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        User
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Email
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Phone
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Role
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {filteredUsers.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={6}
                                            className="text-center py-10 text-gray-500"
                                        >
                                            {searchTerm ? "No users found matching your search." : "No users found."}
                                        </td>

                                    </tr>

                                ) : (

                                    filteredUsers.map((user) => (

                                        <tr
                                            key={user.id}
                                            className="hover:bg-gray-50 transition"
                                        >

                                            {/* User */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                                                        {user.full_name
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <p className="font-semibold text-gray-800">
                                                            {user.full_name}
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            {user.id}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* Email */}

                                            <td className="px-6 py-4 text-gray-600">
                                                {user.email}
                                            </td>

                                            {/* Phone */}

                                            <td className="px-6 py-4 text-gray-600">
                                                {user.phone || "Not provided"}
                                            </td>

                                            {/* Role */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "OWNER"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>

                                            </td>

                                            {/* Status */}

                                            <td className="px-6 py-4">

                                                {user.is_active ? (

                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                                                        Active

                                                    </span>

                                                ) : (

                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">

                                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>

                                                        Blocked

                                                    </span>

                                                )}

                                            </td>

                                            {/* Action */}

                                            <td className="px-6 py-4">

                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(user)
                                                    }
                                                    disabled={
                                                        actionLoading === user.id
                                                    }
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-50 disabled:cursor-not-allowed ${user.is_active
                                                        ? "bg-red-600 hover:bg-red-700"
                                                        : "bg-green-600 hover:bg-green-700"
                                                        }`}
                                                >

                                                    {actionLoading === user.id
                                                        ? "Processing..."
                                                        : user.is_active
                                                            ? "Block"
                                                            : "Unblock"}

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminUsers;