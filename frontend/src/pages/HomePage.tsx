import { Link } from 'react-router-dom';
import Properties from './property-listing/Properties';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    {/* Hero Section */}
    <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                        #1 Rental Platform
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                    Welcome to the Biggest
                    <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                        Rental Platform
                    </span>
                    <span className="block mt-1 text-2xl sm:text-3xl md:text-4xl text-slate-300">
                        in the Town
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                    Find your dream property with ease. Browse thousands of listings, 
                    connect with landlords, and secure your perfect home today.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => navigate('/properties')}
                        className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Browse Properties
                    </button>
                    <button
                        onClick={() => navigate('/create-property')}
                        className="px-8 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        List Your Property
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-white">10K+</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Properties</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-white">5K+</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Happy Tenants</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-white">2K+</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Landlords</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-white">98%</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Satisfaction</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Properties Section */}
    <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        Available Properties
                    </h2>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Find your perfect home from our curated listings
                    </p>
                </div>
                <button
                    onClick={() => navigate('/properties')}
                    className="px-5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>

            {/* Properties Component */}
            <Properties />
        </div>
    </div>

    {/* CSS Animations */}
    <style>{`
        @keyframes blob {
            0% {
                transform: translate(0px, 0px) scale(1);
            }
            33% {
                transform: translate(30px, -50px) scale(1.1);
            }
            66% {
                transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
                transform: translate(0px, 0px) scale(1);
            }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
    `}</style>
</div>
  )
}

export default HomePage
