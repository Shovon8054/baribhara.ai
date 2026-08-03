import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth.service';

const TenantNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed', error);
    }

    navigate('/signin');
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/95 px-6 py-4 shadow-sm shadow-slate-950/20">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          BariBhara AI
        </Link>
        <span className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
          Tenant Portal
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/"
          className="text-sm font-medium text-slate-200 transition hover:text-cyan-400"
        >
          Home
        </Link>
        <Link
          to="/demo"
          className="text-sm font-medium text-slate-200 transition hover:text-cyan-400"
        >
          Demo
        </Link>
        <Link
          to="/signin"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
        >
          Sign In
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TenantNavbar;
