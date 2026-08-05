import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth.service';
import { useEffect, useState } from 'react';

const TenantNavbar = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const check = Boolean(localStorage.getItem('accessToken') || localStorage.getItem('user'));
    setIsAuth(check);

    const onStorage = () => setIsAuth(Boolean(localStorage.getItem('accessToken') || localStorage.getItem('user')));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed', error);
    }

    // Clear local client state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    setIsAuth(false);
    navigate('/signin');
  };

  return (
<>
  <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-950/98 to-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg shadow-slate-950/30">
    
    {/* Logo Section */}
    <div className="flex items-center gap-3">
      <Link
        to="/home"
        className="group flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <span className="text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
          BariBhara AI
        </span>
      </Link>
      <div className="hidden sm:flex items-center gap-2">
        <span className="w-px h-5 bg-slate-700"></span>
        <span className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.35em] text-slate-400">
          Tenant Portal
        </span>
      </div>
    </div>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-1 lg:gap-2">
      
      {/* AI Search - Classy Design */}
      <Link
        to="/ai-search"
        className="
        relative
        group
        px-4 py-2
        rounded-xl
        bg-gradient-to-r from-cyan-500/5 via-cyan-400/10 to-cyan-500/5
        border border-cyan-400/20
        text-sm
        font-medium
        text-cyan-400
        hover:from-cyan-500/15 hover:via-cyan-400/20 hover:to-cyan-500/15
        hover:border-cyan-400/40
        hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]
        transition-all
        duration-500
        overflow-hidden
        flex items-center gap-2
        "
      >
        {/* Ambient Glow */}
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500/0 via-cyan-400/5 to-cyan-500/0 group-hover:via-cyan-400/10 transition-all duration-700"></span>
        
        {/* Top Glow Line */}
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent group-hover:w-16 transition-all duration-500"></span>
        
        {/* Bottom Glow Line */}
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent group-hover:w-16 transition-all duration-500"></span>
        
        {/* Icon with Ring */}
        <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-all duration-300">
          <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm group-hover:blur-md transition-all duration-300"></span>
          <svg className="relative w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        
        {/* Text with Gradient */}
        <span className="relative bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent font-semibold group-hover:from-cyan-200 group-hover:to-cyan-300 transition-all duration-300">
          AI Search
        </span>
        
        {/* Sparkle Icon */}
        {/* <svg className="w-3 h-3 text-cyan-400/50 group-hover:text-cyan-400/80 group-hover:rotate-180 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg> */}
        
        {/* NEW Badge - Classy */}
        <span className="relative px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-cyan-400/20 to-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/20 group-hover:border-cyan-400/40 group-hover:bg-gradient-to-r group-hover:from-cyan-400/30 group-hover:to-cyan-500/30 transition-all duration-300">
          New
        </span>
        
        {/* Shine */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></span>
      </Link>

      <Link
        to="/properties"
        className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
      >
        Home
      </Link>
      
      <Link
        to="/create-property"
        className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
      >
        Create Property
      </Link>
      <Link
        to="#"
        className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
      >
        Favorites
      </Link>
      <Link
        to="/profile"
        className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
      >
        Profile
      </Link>

      {!isAuth && (
        <Link
          to="/signin"
          className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
        >
          Sign In
        </Link>
      )}

      {isAuth && (
        <button
          type="button"
          onClick={handleLogout}
          className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
        >
          Logout
        </button>
      )}
    </div>

    {/* Mobile Menu Button */}
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-300"
      aria-label="Toggle menu"
    >
      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isMobileMenuOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>

    {/* Mobile Menu */}
    {isMobileMenuOpen && (
      <div className="md:hidden w-full bg-slate-950/98 backdrop-blur-xl rounded-xl border border-slate-800 p-4 mt-2 space-y-2 animate-slideDown">

        
        {/* AI Search - Classy Mobile */}
        <Link
          to="/ai-search"
          className="
          relative
          group
          flex items-center gap-3 
          px-4 py-3 
          rounded-xl
          bg-gradient-to-r from-cyan-500/10 to-cyan-600/10
          border border-cyan-400/20
          text-cyan-400
          hover:from-cyan-500/20 hover:to-cyan-600/20
          hover:border-cyan-400/40
          transition-all duration-300
          overflow-hidden
          "
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/5 to-cyan-500/0 group-hover:via-cyan-400/10 transition-all duration-700"></span>
          <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-semibold bg-gradient-to-r from-cyan-300 to-cyan-400 bg-clip-text text-transparent">
            AI Search
          </span>
          <span className="ml-auto px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-cyan-400/20 to-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/20">
            New
          </span>
        </Link>

        <Link
          to="/properties"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
        
        <Link
          to="/create-property"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Create Property
        </Link>
        <Link
          to="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Favorites
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile
        </Link>

        <div className="pt-2 border-t border-slate-800">
          {!isAuth ? (
            <Link
              to="/signin"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}
        </div>
      </div>
    )}
  </nav>

  {/* CSS Animation */}
  <style>{`
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slideDown {
      animation: slideDown 0.3s ease-out;
    }
  `}</style>
</>
  );
};

export default TenantNavbar;
