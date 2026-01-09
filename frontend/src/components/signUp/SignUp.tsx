import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, MapPin, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authService'; // Import the service
import { notify } from '../utils/notify';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Use the clean service call instead of fetch()
      const result = await registerUser(formData);
      
      notify.success(result.message || "Welcome! Redirecting...");
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (error: any) {
      // The error here is the 'throw' from our service file
      notify.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-slate-100 flex flex-col md:flex-row"
      >
        {/* Left Side: Branding/Info */}
        <div className="md:w-1/3 bg-[#00467f] p-8 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Join Us.</h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            Create an account to find verified workers for your next project.
          </p>
          <div className="space-y-4 text-xs font-medium text-blue-200">
            <p className="flex items-center gap-2">✓ Verified Professionals</p>
            <p className="flex items-center gap-2">✓ Secure Payments</p>
            <p className="flex items-center gap-2">✓ 24/7 Support</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-2/3 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">First Name</label>
                <input 
                  type="text" name="firstName" required
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Last Name</label>
                <input 
                  type="text" name="lastName" required
                  className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="email" name="email" required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder="name@company.com"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="tel" name="phone" required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder="07X XXX XXXX"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Home Address</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                <textarea 
                  name="address" rows={2}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-none"
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="password" name="password" required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="relative">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="password" name="confirmPassword" required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#00467f] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#003560] transition-all shadow-lg shadow-blue-900/20 mt-4"
            >
              Create Account <ArrowRight size={20} />
            </button>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account? <Link to="/login" className="text-[#00467f] font-bold hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;


