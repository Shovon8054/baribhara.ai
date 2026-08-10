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

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-950/98 to-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg shadow-slate-950/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between w-full">

        {/* Logo Section */}
        <Link to="/admin-dashboard" className="group flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold uppercase tracking-[0.25em] text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
              BariBhara AI
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-slate-400 hidden sm:block">
              Admin Panel
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                    ? "text-cyan-400 bg-cyan-500/10"
                    : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
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
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                      ? "text-cyan-400 bg-cyan-500/10"
                      : "text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50"
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-medium hover:from-red-600 hover:to-rose-700 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

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
    </nav>
  );
};

export default AdminNavbar;