import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getAdminSubscriptions,
} from "../../services/adminSubscription.service";

interface Subscription {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    role: string;
    plan: "FREE" | "PREMIUM";
    is_active: boolean;
    stripe_customer_id?: string | null;
    stripe_subscription_id?: string | null;
    expires_at?: string | null;
    created_at: string;
    updated_at: string;
}

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const data = await getAdminSubscriptions();
            setSubscriptions(data || []);
        } catch (error: any) {
            console.error("Failed to fetch subscriptions:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to load subscriptions"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const formatDate = (date?: string | null) => {
        if (!date) return "—";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isExpired = (expiresAt?: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    // Filter subscriptions based on search term
    const filteredSubscriptions = subscriptions.filter((sub) => {
        const search = searchTerm.toLowerCase();
        return (
            sub.full_name?.toLowerCase().includes(search) ||
            sub.email?.toLowerCase().includes(search) ||
            sub.role?.toLowerCase().includes(search) ||
            sub.plan?.toLowerCase().includes(search)
        );
    });

    const premiumCount = subscriptions.filter((s) => s.plan === "PREMIUM").length;
    const activeCount = subscriptions.filter(
        (s) => s.is_active && !isExpired(s.expires_at)
    ).length;
    const freeCount = subscriptions.filter((s) => s.plan === "FREE").length;
    const expiredCount = subscriptions.filter(
        (s) => s.is_active && isExpired(s.expires_at)
    ).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Loading subscriptions...</p>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Manage Subscriptions
                            </h1>
                            <p className="text-sm text-slate-400 mt-0.5">
                                Monitor user subscription plans and status
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        {subscriptions.length} Subscriptions
                    </span>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8">
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-5 hover:border-cyan-500/30 transition-all duration-300">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{subscriptions.length}</p>
                    </div>
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-5 hover:border-cyan-500/30 transition-all duration-300">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Premium</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1">{premiumCount}</p>
                    </div>
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-5 hover:border-cyan-500/30 transition-all duration-300">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Active</p>
                        <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">{activeCount}</p>
                    </div>
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-5 hover:border-cyan-500/30 transition-all duration-300">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Expired</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-400 mt-1">{expiredCount}</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-5 mb-6 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search subscriptions by user, email, role, or plan..."
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

                {/* Empty State */}
                {filteredSubscriptions.length === 0 ? (
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-900/50 flex items-center justify-center mb-4 border border-cyan-500/20">
                            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-1">
                            {searchTerm ? "No Subscriptions Found" : "No Subscriptions"}
                        </h2>
                        <p className="text-sm text-slate-400">
                            {searchTerm ? "Try adjusting your search terms." : "There are currently no subscription records."}
                        </p>
                    </div>
                ) : (
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl shadow-cyan-500/5">
                        <div className="px-4 sm:px-6 py-4 border-b border-slate-700/50 bg-slate-900/30">
                            <h2 className="text-sm font-semibold text-white">
                                All Subscriptions
                                <span className="ml-2 text-xs text-slate-400 font-normal">
                                    ({filteredSubscriptions.length} {filteredSubscriptions.length === 1 ? 'record' : 'records'})
                                </span>
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-900/50 border-b border-slate-700/50">
                                    <tr>
                                        <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                                            Role
                                        </th>
                                        <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Plan
                                        </th>
                                        <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                                            Expires
                                        </th>
                                        <th className="text-left px-4 sm:px-6 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                                            Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {filteredSubscriptions.map((subscription) => {
                                        const expired = isExpired(subscription.expires_at);
                                        const active = subscription.is_active && !expired;

                                        return (
                                            <tr key={subscription.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                                                {/* User */}
                                                <td className="px-4 sm:px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-white text-sm">
                                                            {subscription.full_name}
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {subscription.email}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/30 text-slate-300 text-xs font-medium border border-slate-600/30">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                        {subscription.role}
                                                    </span>
                                                </td>

                                                {/* Plan */}
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${subscription.plan === "PREMIUM"
                                                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${subscription.plan === "PREMIUM" ? "bg-purple-400" : "bg-blue-400"
                                                            }`}></span>
                                                        {subscription.plan}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 sm:px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${active
                                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                            : expired
                                                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400 animate-pulse" : expired ? "bg-red-400" : "bg-amber-400"
                                                            }`}></span>
                                                        {active ? "Active" : expired ? "Expired" : "Inactive"}
                                                    </span>
                                                </td>

                                                {/* Expiry */}
                                                <td className="px-4 sm:px-6 py-4 text-sm text-slate-400 hidden md:table-cell">
                                                    {formatDate(subscription.expires_at)}
                                                </td>

                                                {/* Created */}
                                                <td className="px-4 sm:px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                                                    {formatDate(subscription.created_at)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSubscriptions;