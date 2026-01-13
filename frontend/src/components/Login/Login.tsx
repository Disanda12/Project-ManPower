import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
// 1. Import your service and notify utility
import { loginUser } from "../../api/authService";
import { notify } from "../utils/notify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Added password state
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      notify.success(`Welcome back, ${data.name}!`);

      // 1. Update Storage
      window.dispatchEvent(new Event("storage"));

      // 2. Determine Destination
      // Check if there is a 'from' path in the background state
      const from = location.state?.from?.pathname || "/";

      // 3. Logic: Admin always goes to dashboard, customers go to 'from'
      const destination = data.role === "admin" ? "/admin" : from;

      // Use { replace: true } so the user can't go "back" to the login page
      navigate(destination, { replace: true });
    } catch (err: any) {
      notify.error(err);
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
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00467f] outline-none"
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
              value={password} // Controlled component
              onChange={(e) => setPassword(e.target.value)} // Set password state
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00467f] outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading} // Disable while loading
            className={`w-full bg-[#00467f] text-white font-bold py-3 rounded-lg hover:bg-[#003561] transition-all shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-[#00467f] font-bold">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;