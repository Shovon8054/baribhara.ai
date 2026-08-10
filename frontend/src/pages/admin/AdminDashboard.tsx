import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AdminUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
}

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        // Not logged in
        if (!storedUser) {
            navigate("/signin");
            return;
        }

        try {
            const parsedUser: AdminUser = JSON.parse(storedUser);

            // Not an admin
            if (parsedUser.role !== "ADMIN") {
                navigate("/home");
                return;
            }

            setUser(parsedUser);
        } catch (error) {
            console.error("Invalid user data:", error);

            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");

            navigate("/signin");
        }
    }, [navigate]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-gray-500">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Manage your platform with ease
                            </p>
                        </div>
                    </div>

                    {/* Stats Badge */}
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                            Admin
                        </span>
                    </div>
                </div>

                {/* Management Cards */}
                <div className="mt-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-1 h-6 bg-cyan-400 rounded-full"></div>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Management
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                        {/* Users */}
                        <button
                            onClick={() => navigate("/admin/users")}
                            className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-left hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                                Manage Users
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                View, activate, deactivate and manage users.
                            </p>
                        </button>

                        {/* Properties */}
                        <button
                            onClick={() => navigate("/admin/properties")}
                            className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-left hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                                Manage Properties
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                View and manage all property listings.
                            </p>
                        </button>

                        {/* Subscriptions */}
                        <button
                            onClick={() => navigate("/admin/subscriptions")}
                            className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-left hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                                Subscriptions
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                Monitor Premium subscriptions and expiry.
                            </p>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-10 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/50 bg-slate-900/30">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                            Recent Activity
                        </h2>
                    </div>

                    <div className="p-6">
                        <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-3 border border-slate-700/50">
                                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-slate-400 font-medium">No recent activity</p>
                            <p className="text-sm text-slate-500 mt-1">Activity logs will appear here</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;