import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
// 1. Import your service and notify utility
import { loginUser } from "../../api/authService";
import { notify } from "../utils/notify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const data = await loginUser({ email, password });
    notify.success(`Welcome back!`);

    window.dispatchEvent(new Event("storage"));

    // 1. Get the 'from' path saved by ProtectedRoute
    // 2. If it exists, combine path + query params (like ?service=Masonry)
    const from = location.state?.from;
    const destination = from ? `${from.pathname}${from.search}` : "/";

    // 3. Admin override, else go to destination
    const finalPath = data.role === "admin" ? "/admin" : destination;

    navigate(finalPath, { replace: true });
  } catch (err: any) {
    notify.error("Login failed");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <div className="w-8 h-8 bg-[#00467f] rounded-lg rotate-12"></div>
          </div>
          <h2 className="text-3xl font-extrabold text-[#00467f]">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2">
            Log in to manage your staffing orders
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00467f] outline-none transition-all"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00467f] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#00467f] text-white font-bold py-3 rounded-lg hover:bg-[#003561] transition-all shadow-lg active:scale-[0.98] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : "Log In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Secure Access</span>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-[#00467f] font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;