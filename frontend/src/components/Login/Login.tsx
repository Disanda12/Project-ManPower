import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user came from, or default to home "/"
  const from = location.state?.from || "/";

const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  
  localStorage.setItem("userToken", "fake-jwt-token");
  
  const destination = location.state?.from || "/";
  
  // Navigate smoothly without reloading the whole browser
  navigate(destination);
  
  // Dispatch a custom event so the Navbar knows to check localStorage
  window.dispatchEvent(new Event("storage")); 
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#00467f]">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Log in to manage your staffing orders</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <input 
              required 
              type="email" 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00467f] outline-none" 
              placeholder="name@company.com" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input 
              required 
              type="password" 
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00467f] outline-none" 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="w-full bg-[#00467f] text-white font-bold py-3 rounded-lg hover:bg-[#003561] transition-all shadow-lg">
            Log In
          </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account? <Link to="/signup" className="text-[#00467f] font-bold">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;