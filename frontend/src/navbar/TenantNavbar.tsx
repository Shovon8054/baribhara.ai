import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/auth.service";
import { useEffect, useState } from "react";
import { getImageUrl } from "../utils/imageUrl";

const TenantNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isAuth, setIsAuth] = useState<boolean>(() => {
    return Boolean(
      localStorage.getItem("accessToken") ||
      localStorage.getItem("user")
    );
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsAuth(Boolean(localStorage.getItem("accessToken") || localStorage.getItem("user")));
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuth(false);
    navigate("/signin");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: "Properties", path: "/properties" },
    { label: "Subscription", path: "/subscription" },
    { label: "Chat", path: "/chat" },
    { label: "Favorites", path: "/favorites" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060b18]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/20">
      {/* Top Ambient Glow Reflection Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* =========================================================
              1. BRAND LOGO
          ========================================================= */}
          <Link to="/home" className="flex items-center gap-3 group flex-shrink-0">
            {/* Logo Icon Badge with Glow */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Brand Text + Portal Pill */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  BARIBHARA<span className="text-cyan-400">.AI</span>
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 -mt-0.5">
                {user?.role === "OWNER" ? "Owner Portal" : "Rental Platform"}
              </span>
            </div>
          </Link>

          {/* =========================================================
              2. DESKTOP NAVIGATION
          ========================================================= */}
          <nav className="hidden lg:flex items-center gap-1.5">
            
            {/* AI Search Link — Special Featured Pill */}
            <Link
              to="/ai-search"
              className={`relative group px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 mr-1 ${
                isActive("/ai-search")
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-500/10"
                  : "bg-gradient-to-r from-cyan-500/5 to-blue-500/5 hover:from-cyan-500/10 hover:to-blue-500/10 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40"
              }`}
            >
              <svg className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Search</span>
              <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-md border border-cyan-400/30">
                PRO
              </span>
            </Link>

            {/* Standard Nav Links */}
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* =========================================================
              3. RIGHT AUTH & USER SECTION
          ========================================================= */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuth ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                
                {/* User Profile Mini Badge */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 border border-cyan-500/30 flex items-center justify-center">
                    {user?.profile_image ? (
                      <img
                        src={getImageUrl(user.profile_image)}
                        alt={user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-cyan-400">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 max-w-[110px] truncate">
                    {user?.name || "My Account"}
                  </span>
                </Link>

                {/* Logout Action Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of account"
                  className="px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/signin"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                >
                  <span>Sign In</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* =========================================================
              4. MOBILE MENU HAMBURGER
          ========================================================= */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* =========================================================
          5. MOBILE MENU DROPDOWN
      ========================================================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#070d1e]/98 backdrop-blur-2xl border-b border-slate-800 px-4 py-5 space-y-2 animate-slideDown shadow-2xl">
          
          {/* AI Search Featured Mobile */}
          <Link
            to="/ai-search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold"
          >
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Search</span>
            </div>
            <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-md border border-cyan-400/30">
              PRO
            </span>
          </Link>

          {/* Links */}
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Auth Action Mobile */}
          <div className="pt-4 border-t border-slate-800/80">
            {isAuth ? (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20"
              >
                <span>Sign In</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default TenantNavbar;
