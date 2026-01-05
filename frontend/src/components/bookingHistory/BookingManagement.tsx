import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ChevronRight, 
  AlertCircle, 
  ArrowLeft,
  Save,
  Mail,
  Phone,
  Lock
} from 'lucide-react';

const ManageStaff = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookingToEdit = location.state?.bookingData;

  // Form State: Focus on Customer Details
  const [formData, setFormData] = useState({
    id: bookingToEdit?.id || '',
    // Editable Fields
    customerName: bookingToEdit?.customerName || '', 
    email: bookingToEdit?.email || '',
    phone: bookingToEdit?.phone || '',
    // Read-only reference fields
    role: bookingToEdit?.role || '',
    staffCount: bookingToEdit?.staffCount || 1,
    location: bookingToEdit?.location || '',
    status: bookingToEdit?.status || 'Active',
    date: bookingToEdit?.date || ''
  });

  useEffect(() => {
    if (!bookingToEdit) {
      navigate('/booking-history');
    }
  }, [bookingToEdit, navigate]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating Customer Info:", {
      id: formData.id,
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone
    });
    alert(`Customer details for ${formData.id} updated successfully!`);
    navigate('/booking-history');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-blue-900 font-semibold transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to History
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-blue-900 p-8 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Update Contact Details</h1>
            <p className="text-blue-200 mt-2">Booking ID: <span className="font-mono text-white">{formData.id}</span></p>
          </div>
          <div className="hidden sm:block text-right">
             <div className="text-xs text-blue-300 uppercase font-bold mb-1">Current Status</div>
             <span className="px-4 py-2 bg-blue-800 rounded-full border border-blue-700 text-sm font-bold uppercase">
               {formData.status}
             </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* EDITABLE SECTION: Customer Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <User size={20} className="text-blue-600" /> Customer Information
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <input 
                  required
                  type="text" 
                  value={formData.customerName}
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                <Phone className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* READ-ONLY SECTION: Booking Details */}
          <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="text-lg font-bold text-slate-500 flex items-center gap-2">
                  <Lock size={18} /> Booking Specs
                </h3>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">Locked</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Worker Type</p>
                    <p className="text-slate-700 font-medium flex items-center gap-2 mt-1">
                        <Briefcase size={16} className="text-slate-400" /> {formData.role}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Count</p>
                    <p className="text-slate-700 font-medium mt-1">{formData.staffCount} Workers</p>
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</p>
                    <p className="text-slate-700 font-medium mt-1">{formData.date}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Location</p>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed italic">
                        {formData.location}
                    </p>
                </div>
            </div>

            <div className="flex gap-3 text-slate-500 mt-4">
              <AlertCircle className="shrink-0" size={18} />
              <p className="text-xs italic">
                Booking specifications (role, count, and location) cannot be changed after order confirmation. Please contact support for major modifications.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 mt-4">
            <button 
              type="submit"
              className="w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 transform transition-all hover:scale-[1.01]"
            >
              <Save size={20} /> Save Customer Details <ChevronRight size={20} />
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default ManageStaff;