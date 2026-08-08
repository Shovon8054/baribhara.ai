import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    getSubscription,
    upgradeToPremium,
    cancelSubscription,
    Subscription,
} from "../../services/subscription.service";

const SubscriptionPage = () => {
    const [subscription, setSubscription] =
        useState<Subscription | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [upgrading, setUpgrading] =
        useState(false);

    const [cancelling, setCancelling] =
        useState(false);

    const loadSubscription = async () => {
        try {
            const data =
                await getSubscription();

            setSubscription(data);
        } catch (error) {
            console.error(
                "Failed to load subscription:",
                error
            );
            toast.error("Failed to load subscription details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscription();
    }, []);

    const handleUpgrade = async () => {
        try {
            setUpgrading(true);

            const data =
                await upgradeToPremium();

            setSubscription(data);

            toast.success("Premium activated successfully! 🎉", {
                duration: 4000,
                icon: '✨',
            });

        } catch (error) {
            console.error(
                "Upgrade failed:",
                error
            );

            toast.error("Failed to upgrade subscription. Please try again.");
        } finally {
            setUpgrading(false);
        }
    };

    const handleCancel = async () => {
        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel Premium?"
            );

        if (!confirmCancel) {
            return;
        }

        try {
            setCancelling(true);

            const data =
                await cancelSubscription();

            setSubscription(data);

            toast.success("Subscription cancelled successfully", {
                duration: 4000,
            });

        } catch (error) {
            console.error(
                "Cancellation failed:",
                error
            );

            toast.error("Failed to cancel subscription. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-400">Loading subscription...</p>
                </div>
            </div>
        );
    }

    if (!subscription) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400">Unable to load subscription.</p>
                    <button
                        onClick={loadSubscription}
                        className="mt-4 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const isPremium =
        subscription.plan === "PREMIUM" &&
        subscription.is_active;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            Subscription
                        </h1>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Manage your plan and access premium features
                        </p>
                    </div>
                </div>

                {/* Current Plan */}
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 mb-8 hover:border-cyan-500/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                                Current Plan
                            </p>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-white">
                                    {subscription.plan}
                                </h2>
                                {subscription.is_active && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Active
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 space-y-1">
                                <p className="text-sm text-slate-400">
                                    Status: <span className={subscription.is_active ? "text-emerald-400" : "text-slate-500"}>
                                        {subscription.is_active ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                {subscription.expires_at && (
                                    <p className="text-sm text-slate-400">
                                        Expires: {new Date(subscription.expires_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>

                        {isPremium && (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Premium Active
                            </span>
                        )}
                    </div>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* FREE Plan */}
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">Free</h2>
                            <span className="text-sm text-slate-400 font-medium">$0 / month</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">
                            Basic access to BariBhara AI
                        </p>

                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Browse Properties
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Favorites
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                AI Property Comparison
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Book Property Visits
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-500">
                                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Real-Time Chat
                            </li>
                        </ul>

                        {!isPremium && (
                            <div className="mt-6 pt-6 border-t border-slate-700/50">
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-700/30 text-slate-400 text-sm font-medium">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Current Plan
                                </span>
                            </div>
                        )}
                    </div>

                    {/* PREMIUM Plan */}
                    <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border-2 border-cyan-500/40 p-6 sm:p-8 hover:border-cyan-500/70 transition-all duration-300 shadow-lg shadow-cyan-500/5">

                        {/* Premium Badge */}
                        <div className="absolute -top-3 right-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/30">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Best Value
                            </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">Premium</h2>
                            <span className="text-sm text-cyan-400 font-medium">$9.99 / month</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">
                            Unlock real-time communication and premium features
                        </p>

                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Browse Properties
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Favorites
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                AI Property Comparison
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Book Property Visits
                            </li>
                            <li className="flex items-center gap-3 text-sm text-cyan-400 font-medium">
                                <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Real-Time Chat
                            </li>
                        </ul>

                        {!isPremium ? (
                            <button
                                onClick={handleUpgrade}
                                disabled={upgrading}
                                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:from-cyan-600 hover:to-indigo-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                            >
                                {upgrading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Activating...
                                    </span>
                                ) : (
                                    "Upgrade to Premium"
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="w-full mt-6 py-3 rounded-xl border border-red-500/50 text-red-400 font-semibold hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelling ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Cancelling...
                                    </span>
                                ) : (
                                    "Cancel Premium"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;