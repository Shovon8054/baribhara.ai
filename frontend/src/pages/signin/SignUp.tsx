import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Layers,
} from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"tenant" | "owner">("tenant");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Quick Demo Autofill Helper for rapid testing
  const handleQuickFill = (selectedRole: "tenant" | "owner") => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setRole(selectedRole);
    setFormData({
      full_name: selectedRole === "tenant" ? `Test Tenant ${randomNum}` : `Test Owner ${randomNum}`,
      email: `${selectedRole}${randomNum}@test.com`,
      phone: `01712${randomNum}123`,
      password: "Password123",
      confirmPassword: "Password123",
    });
    toast.success(`Prepared ${selectedRole} sample registration!`, {
      icon: "⚡",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
      });

      // Success toast
      toast.success(result.message || "Account created successfully!");

      // Clear form
      setFormData({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to sign in with success message
      setTimeout(() => {
        navigate("/signin", {
          state: {
            message: "Account created successfully! Please sign in.",
          },
        });
      }, 800);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
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
                Join 10,000+ Renters & Landlords
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Join Bangladesh&apos;s{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Premier AI Rental
              </span>{" "}
              Ecosystem
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              Whether you are hunting for your dream flat or listing premium rental units, enjoy
              frictionless efficiency with Gemini AI search and direct real-time communication.
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
                  Conversational Gemini AI Search
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  Describe requirements in plain language and receive tailored apartment options instantly.
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
                  Direct Real-Time Owner Chat
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  Connect directly over live WebSockets without waiting for broker callbacks or fees.
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
                  Automated AI Listing Assistant
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug line-clamp-2">
                  Landlords can auto-generate high-converting property descriptions effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Hidden Charges</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified Landlords & Tenants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Encrypted Credentials</span>
          </div>
        </div>
      </div>

      {/* ===================================================================
          RIGHT PANEL: AUTH CARD (Centered, Compact, No Scroll Needed)
      =================================================================== */}
      <div className="lg:w-5/12 xl:w-5/12 p-3 sm:p-5 lg:p-5 xl:p-6 flex flex-col justify-center items-center h-auto lg:h-full relative z-10 overflow-y-auto lg:overflow-visible">
        
        {/* Floating Auth Card */}
        <div className="w-full max-w-[440px] bg-slate-900/85 backdrop-blur-2xl rounded-2xl p-4 sm:p-5 border border-slate-800/90 shadow-2xl shadow-black/50 relative my-auto">

          {/* Centered Brand Emblem */}
          <div className="flex flex-col items-center text-center mb-2.5">
            <div className="relative mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full rounded-[9px] bg-slate-950 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Join BariBhara.AI to discover or list properties
            </p>
          </div>

          {/* Role Selection Switcher */}
          <div className="mb-2.5">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setRole("tenant")}
                className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  role === "tenant"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>👤 Tenant / Renter</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("owner")}
                className={`py-1.5 px-2 rounded-md text-[11px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  role === "owner"
                    ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-sm shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>🏠 Property Owner</span>
              </button>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* 2-Column: Full Name & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25 transition-all hover:border-slate-700"
                    placeholder="Saqline Rahman"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Phone <span className="text-[9px] text-slate-500 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25 transition-all hover:border-slate-700"
                    placeholder="017XXXXXXXX"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25 transition-all hover:border-slate-700"
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* 2-Column: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-8 pr-8 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25 transition-all hover:border-slate-700"
                    placeholder="Min 6 chars"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-cyan-400 focus:outline-none transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-8 pr-8 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/25 transition-all hover:border-slate-700"
                    placeholder="Repeat"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-cyan-400 focus:outline-none transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-lg shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <span className="text-xs sm:text-sm">Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="text-xs sm:text-sm">Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Pill (For fast testing) */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="text-amber-400">⚡</span> Sample Demo Fill
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill("tenant")}
                className="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-medium transition-all"
              >
                + Tenant Draft
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("owner")}
                className="px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium transition-all"
              >
                + Owner Draft
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2.5 my-2">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Switch to SignIn Link */}
          <p className="text-center text-[11px] sm:text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ml-1"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;