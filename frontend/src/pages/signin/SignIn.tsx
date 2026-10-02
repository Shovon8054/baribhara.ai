import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth.service";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Building2,
} from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Quick Demo Account Auto-fill helper
  const handleQuickDemo = (demoEmail: string, demoPass: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.success(`Loaded ${roleName} demo credentials!`, {
      icon: "⚡",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({
        email,
        password,
      });

      const user = result.data.user;

      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(result.message || "Login successful! Welcome back!");

      setEmail("");
      setPassword("");

      setTimeout(() => {
        if (user.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }
      }, 700);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-slate-950 text-white flex flex-col lg:flex-row relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ==================== AMBIENT BACKGROUND GLOWS ==================== */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* ===================================================================
          LEFT PANEL: BRAND SHOWCASE & ECOSYSTEM (Desktop Fit, No Scroll)
      =================================================================== */}
      <div className="lg:w-7/12 xl:w-7/12 p-5 sm:p-8 lg:p-8 xl:p-10 flex flex-col justify-between h-auto lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-slate-950/40 backdrop-blur-sm overflow-hidden flex-shrink-0">
        
        {/* Top Brand Header */}
        <div>
          <Link
            to="/home"
            className="inline-flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-wider text-white">
                BARIBHARA<span className="text-cyan-400">.AI</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 -mt-0.5">
                Rental & Property Ecosystem
              </span>
            </div>
          </Link>

          {/* Hero Pitch */}
          <div className="mt-4 sm:mt-6 lg:mt-6 xl:mt-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                Next-Gen Real Estate Tech
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Intelligent Living &{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                AI-Powered Rental
              </span>{" "}
              Ecosystem
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              Connecting tenants and landlords across Bangladesh with Gemini conversational search,
              verified listings, and direct real-time communication.
            </p>
          </div>

          {/* Feature Showcase Cards */}
          <div className="mt-4 sm:mt-5 lg:mt-5 xl:mt-7 space-y-2.5 max-w-xl">
            {/* Feature 1 */}
            <div className="group flex items-start gap-3 p-2.5 xl:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  Gemini AI Natural Search
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  Search naturally in Bangla or English: &ldquo;3-bed family flat near Dhanmondi under 30k&rdquo;.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group flex items-start gap-3 p-2.5 xl:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-900/90 transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  Direct Owner Chat & Zero Brokers
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  Socket.IO real-time messaging with live typing indicators and direct landlord negotiation.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group flex items-start gap-3 p-2.5 xl:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900/90 transition-all duration-200">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                  AI Property Comparison Engine
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  Compare shortlisted apartments side-by-side with pricing metrics and amenity scores.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Brokerage Fees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified Listings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>24/7 Platform</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          RIGHT PANEL: AUTH CARD (Centered, Compact, No Scroll Needed)
      =================================================================== */}
      <div className="lg:w-5/12 xl:w-5/12 p-4 sm:p-6 lg:p-6 xl:p-8 flex flex-col justify-center items-center h-auto lg:h-full relative z-10 overflow-y-auto lg:overflow-visible">
        
        {/* Floating Auth Card */}
        <div className="w-full max-w-[410px] bg-slate-900/85 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-2xl shadow-black/50 relative my-auto">

          {/* Centered Brand Emblem */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative mb-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-[9px] bg-slate-950 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Access your BariBhara.AI property & rental ecosystem
            </p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25 transition-all hover:border-slate-700"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  Password <span className="text-red-400">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-9 pr-10 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25 transition-all hover:border-slate-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-cyan-400 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-400 hover:text-slate-300 transition-colors">
                  Remember me
                </span>
              </label>
              <span className="text-[11px] text-slate-500">
                Need help?
              </span>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-lg shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-xs sm:text-sm">Signing In...</span>
                </>
              ) : (
                <>
                  <span className="text-xs sm:text-sm">Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className="text-amber-400">⚡</span> Quick Demo Accounts
              </span>
              <span className="text-[9px] text-slate-500 font-medium">Click to fill</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickDemo("admin@baribhara.ai", "Admin1234", "Admin")
                }
                className="px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium transition-all"
              >
                👑 Admin
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemo("tenant@bashabhara.com", "Tenant1234", "Tenant")
                }
                className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-all"
              >
                👤 Tenant
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickDemo("owner@bashabhara.com", "Owner1234", "Owner")
                }
                className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition-all"
              >
                🏠 Owner
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2.5 my-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Switch to SignUp Link */}
          <p className="text-center text-[11px] sm:text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ml-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;