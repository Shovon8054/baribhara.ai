import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/auth.service';
import { useEffect, useState } from 'react';


const TenantNavbar = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean>(false);

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
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/95 px-6 py-4 shadow-sm shadow-slate-950/20">
      <div className="flex items-center gap-3">
        <Link to="/home" className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          BariBhara AI
        </Link>
        <span className="text-xs font-medium uppercase tracking-[0.35em] text-slate-500">
          Tenant Portal
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/home"
          className="text-sm font-medium text-slate-200 transition hover:text-cyan-400"
        >
          Home
        </Link>
        <Link
          to="/create-property"
          className="text-sm font-medium text-slate-200 transition hover:text-cyan-400"
        >
          Properties
        </Link>

        {!isAuth && (
          <Link
            to="/signin"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Sign In
          </Link>
        )}

        {isAuth && (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default TenantNavbar;
