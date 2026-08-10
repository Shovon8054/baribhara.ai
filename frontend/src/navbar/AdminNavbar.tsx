import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/auth.service";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/admin-dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
              BariBhara.AI
            </h1>
            <p className="text-xs text-cyan-400 font-medium tracking-wide">
              Admin Panel
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-cyan-400 font-semibold border-b-2 border-cyan-400 pb-1"
                    : "text-slate-300 hover:text-cyan-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
