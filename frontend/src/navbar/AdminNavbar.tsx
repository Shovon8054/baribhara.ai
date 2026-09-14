import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../services/auth.service";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const navLinks = [
    { label: "Dashboard", path: "/admin-dashboard" },
    { label: "Users", path: "/admin/users" },
    { label: "Properties", path: "/admin/properties" },
    { label: "Subscriptions", path: "/admin/subscriptions" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060b18]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-black/20">
      {/* Top Ambient Glow Reflection Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* =========================================================
              1. ADMIN BRAND LOGO
          ========================================================= */}
          <Link to="/admin-dashboard" className="flex items-center gap-3 group flex-shrink-0">
            {/* Logo Icon Badge */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Brand Text + Admin Badge */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-white group-hover:text-purple-300 transition-colors">
                  BARIBHARA<span className="text-purple-400">.AI</span>
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-400 -mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Admin Console
              </span>
            </div>
          </Link>

          {/* =========================================================
              2. DESKTOP NAVIGATION
          ========================================================= */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-purple-300 bg-purple-500/15 border border-purple-500/30 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* =========================================================
              3. RIGHT LOGOUT BUTTON
          ========================================================= */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>

          {/* =========================================================
              4. MOBILE MENU BUTTON
          ========================================================= */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
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
        <div className="md:hidden bg-[#070d1e]/98 backdrop-blur-2xl border-b border-slate-800 px-4 py-5 space-y-2 shadow-2xl">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;