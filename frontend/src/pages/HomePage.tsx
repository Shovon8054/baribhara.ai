import Properties from './property-listing/Properties';
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      {/* ==================== NAVBAR SPACER ==================== */}
      <div className="h-4 sm:h-6"></div>

      {/* ==================== SECTION 1: HERO ==================== */}
      <section className="relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 -left-32 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-10 -right-32 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          
          {/* Hero Content */}
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                #1 Rental Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
              Welcome to the Biggest
              <span className="block mt-3 bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                Rental Platform
              </span>
              <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl text-slate-300">
                in the Town
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Find your dream property with ease. Browse thousands of listings, 
              connect with landlords, and secure your perfect home today.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/properties')}
                className="group px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Browse Properties
              </button>
              <button
                onClick={() => navigate('/create-property')}
                className="group px-8 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                List Your Property
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">10K+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Properties</p>
              </div>
              <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">5K+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Happy Tenants</p>
              </div>
              <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">2K+</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Landlords</p>
              </div>
              <div className="group bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">98%</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Satisfaction</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== SECTION 2: FEATURES ==================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Smart Search</h3>
            <p className="text-sm text-slate-400">AI-powered search to find exactly what you're looking for</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Verified Listings</h3>
            <p className="text-sm text-slate-400">All properties are verified for your peace of mind</p>
          </div>
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors duration-300">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">Trusted Community</h3>
            <p className="text-sm text-slate-400">Join thousands of happy tenants and landlords</p>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: PROPERTIES ==================== */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Featured Properties
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Handpicked listings just for you
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/properties')}
            className="group px-5 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:border-cyan-500/50 hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <span>View All</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Properties Grid */}
        <Properties />
        
      </section>

      {/* ==================== CSS ANIMATIONS ==================== */}
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
  );
};

export default HomePage;
