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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Manage Users
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                View and manage all registered users
                            </p>
                        </div>
                    </div>

                    {/* Total Users Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        {filteredUsers.length} Users
                    </span>
                </div>

                {/* Search Bar */}
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-5 mb-6 hover:border-cyan-500/30 transition-all duration-300">
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
                                    placeholder="Search users by name, email, phone or role..."
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
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Total Users</p>
                                <p className="text-2xl font-bold text-white">{filteredUsers.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl shadow-cyan-500/5">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/50 border-b border-slate-700/50">
                                <tr>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                                        Email
                                    </th>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                                        Phone
                                    </th>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-slate-400">
                                            {searchTerm ? "No users found matching your search." : "No users found."}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                                            {/* User */}
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center font-semibold text-white shadow-lg shadow-cyan-500/20">
                                                        {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white text-sm">{user.full_name}</p>
                                                        <p className="text-xs text-slate-500">{user.id}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email - Hidden on mobile */}
                                            <td className="px-4 sm:px-6 py-4 text-slate-300 text-sm hidden sm:table-cell">
                                                {user.email}
                                            </td>

                                            {/* Phone - Hidden on mobile */}
                                            <td className="px-4 sm:px-6 py-4 text-slate-400 text-sm hidden md:table-cell">
                                                {user.phone || "Not provided"}
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 sm:px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${user.role === "OWNER"
                                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.role === "OWNER" ? "bg-purple-400" : "bg-blue-400"
                                                        }`}></span>
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 sm:px-6 py-4">
                                                {user.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                                        Blocked
                                                    </span>
                                                )}
                                            </td>

                                            {/* Action */}
                                            <td className="px-4 sm:px-6 py-4">
                                                <button
                                                    onClick={() => handleStatusChange(user)}
                                                    disabled={actionLoading === user.id}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${user.is_active
                                                            ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
                                                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                                                        }`}
                                                >
                                                    {actionLoading === user.id ? (
                                                        <span className="flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Processing...
                                                        </span>
                                                    ) : user.is_active ? (
                                                        "Block"
                                                    ) : (
                                                        "Unblock"
                                                    )}
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