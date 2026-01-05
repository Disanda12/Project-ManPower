import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, Users, MapPin, Briefcase, ChevronRight, AlertCircle } from 'lucide-react';
// Note: Ensure you have run: npm install react-datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

const HireWorkerForm = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone1: '',
    phone2: '',
    workerType: '',
    numWorkers: 1,
    numDays: 1,
    address: ''
  });
const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      // Not logged in? Redirect to login
      navigate("/login");
    }
  }, [navigate]);
  // Validation Logic: Check if Calendar days match Hire Duration input
  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (formData.numDays !== diffDays) {
        setErrorMessage(`The date range (${diffDays} days) does not match your Hire Duration (${formData.numDays} days).`);
      } else {
        setErrorMessage(null);
      }
    }
  }, [startDate, endDate, formData.numDays]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (errorMessage) return; // Prevent submission if error exists
    
    console.log("Order Placed:", { ...formData, startDate, endDate });
    alert("Order Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-blue-900 p-8 text-white">
          <h1 className="text-3xl font-bold">Place Your Staffing Order</h1>
          <p className="text-blue-200 mt-2">Tell us your requirements and we'll find the perfect match.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Validation Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:col-span-2 bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700 rounded"
              >
                <AlertCircle size={20} />
                <p className="text-sm font-bold">{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <User size={20} className="text-blue-600" /> Customer Information
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="John Doe"
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="john@company.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number 1*</label>
                <input 
                  required
                  type="tel" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="+1 (000) 000-0000"
                  onChange={(e) => setFormData({...formData, phone1: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number 2 (Opt)</label>
                <input 
                  type="tel" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="+1 (000) 000-0000"
                  onChange={(e) => setFormData({...formData, phone2: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Section: Work Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" /> Work Requirements
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Worker Type</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setFormData({...formData, workerType: e.target.value})}
              >
                <option value="">Select a Category</option>
                <option value="it">IT & Technology</option>
                <option value="admin">Administrative</option>
                <option value="industrial">Industrial/Manufacturing</option>
                <option value="finance">Accounting & Finance</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">No. of Workers</label>
                <input 
                  type="number" min="1"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={(e) => setFormData({...formData, numWorkers: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Hire Duration (Days)</label>
                <input 
                  type="number" min="1"
                  value={formData.numDays}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={(e) => setFormData({...formData, numDays: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                Preferred Date Range
              </label>
              <div className="relative">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                  placeholderText="Click to select range"
                />
               
              </div>
            </div>
          </div>

          {/* Full Width Address */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" /> Work Location
            </h3>
            <textarea 
              rows={3}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter the full street address where the workers are needed..."
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit"
              disabled={!!errorMessage || !endDate}
              className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg transform transition-all
                ${errorMessage || !endDate 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-[1.01]'}`}
            >
              Confirm & Place Order <ChevronRight size={20} />
            </button>
            <p className="text-center text-gray-500 text-xs mt-4">
              By clicking confirm, you agree to our Staffing Terms & Conditions.
            </p>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default HireWorkerForm;