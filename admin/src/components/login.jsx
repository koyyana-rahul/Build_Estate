import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, Loader2, Home, Building2, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import apiClient from "../services/apiClient";
import { cn } from "../lib/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post('/api/users/admin', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAdmin", "true");
        toast.success("Welcome back, Admin!");
        navigate("/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Building2, label: "Properties", value: "500+" },
    { icon: Users, label: "Happy Clients", value: "2,000+" },
    { icon: TrendingUp, label: "Deals Closed", value: "1,200+" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Dark Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 bg-[#142c4e] flex-col justify-between p-10 xl:p-12 relative overflow-hidden"
      >
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #142c4e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #142c4e 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* Decorative circles */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#142c4e]/10 rounded-full" />
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#142c4e]/5 rounded-full" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-[#c6a56b] rounded-xl flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#f7f5f0]">Aavasa</div>
              <div className="text-xs text-[#687386] uppercase tracking-widest">Admin Panel</div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#f7f5f0] leading-tight mb-4">
            Manage Your
            <br />
            <span className="text-[#c6a56b]">Real Estate</span>
            <br />
            Portfolio
          </h1>
          <p className="text-[#687386] text-base leading-relaxed max-w-xs">
            A powerful admin dashboard to manage properties, appointments, and clients — all in one place.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Icon className="w-5 h-5 text-[#c6a56b] mb-2" />
              <div className="text-xl font-bold text-[#f7f5f0]">{value}</div>
              <div className="text-xs text-[#687386]">{label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-[#687386]">
          <Shield className="w-3.5 h-3.5" />
          <span>Secured with 256-bit encryption • Aavasa © 2025</span>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="flex-1 flex items-center justify-center bg-[#f7f5f0] px-6 py-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-[#142c4e] rounded-xl flex items-center justify-center">
            <Home className="h-5 w-5 text-[#c6a56b]" />
            </div>
            <div className="text-lg font-bold text-[#253247]">Aavasa Admin</div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#253247] mb-2">Welcome back</h2>
            <p className="text-[#687386]">Sign in to your admin account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#253247] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={cn(
                    "h-4.5 w-4.5 transition-colors duration-200",
                    focusedField === "email" ? "text-[#142c4e]" : "text-[#687386]"
                  )} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@buildestate.com"
                  className={cn(
                    "w-full pl-11 pr-4 py-3.5 bg-white border rounded-xl text-[#253247] placeholder-[#687386] text-sm transition-all duration-200 outline-none",
                    focusedField === "email"
                      ? "border-[#142c4e] ring-3 ring-[#142c4e]/15 shadow-sm"
                      : "border-[#e5e7eb] hover:border-[#142c4e]/50"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#253247] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={cn(
                    "h-4.5 w-4.5 transition-colors duration-200",
                    focusedField === "password" ? "text-[#142c4e]" : "text-[#687386]"
                  )} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  className={cn(
                    "w-full pl-11 pr-12 py-3.5 bg-white border rounded-xl text-[#253247] placeholder-[#687386] text-sm transition-all duration-200 outline-none",
                    focusedField === "password"
                      ? "border-[#142c4e] ring-3 ring-[#142c4e]/15 shadow-sm"
                      : "border-[#e5e7eb] hover:border-[#142c4e]/50"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#687386] hover:text-[#142c4e] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full flex items-center justify-center gap-2.5 bg-[#253247] hover:bg-[#142c4e] text-[#f7f5f0] py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-terracotta disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#687386]">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure admin access only</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;