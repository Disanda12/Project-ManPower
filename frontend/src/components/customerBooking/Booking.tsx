import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Briefcase, ChevronRight, Info, Mail } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../api/bookingService';
import { getAllServices } from '../../api/serviceService';

const HireWorkerForm = () => {
  const navigate = useNavigate();
  
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [services, setServices] = useState<{service_id: number, service_name: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: localStorage.getItem("userName") || '', // Initial default
    email: localStorage.getItem("userEmail") || '',       // Initial default
    phone1: '',
    phone2: '',
    serviceId: '',
    numWorkers: 1,
    numDays: 1,
    address: '',
    description: ''
  });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      // Not logged in? Redirect to login
      navigate("/login");
    }

    // Fetch available services
    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const servicesData = await getAllServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };
  // Validation Logic: Check if Calendar days match Hire Duration input
  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, numDays: diffDays }));
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (errorMessage || !startDate || !endDate) return; // Prevent submission if error exists

    setLoading(true);
    
    try {
      // Calculate total amount (this is a simple calculation - you might want to make this more sophisticated)
      const dailyRate = 5000; // LKR per worker per day
      const totalAmount = formData.numWorkers * formData.numDays * dailyRate;
      const advanceAmount = totalAmount * 0.3; // 30% advance

      const bookingData = {
        service_id: parseInt(formData.workerType), // This should be the service_id
        number_of_workers: formData.numWorkers,
        work_description: `Work at: ${formData.address}`,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total_amount_lkr: totalAmount,
        advance_amount_lkr: advanceAmount
      };

      await createBooking(bookingData);
      
      alert("Booking Submitted Successfully! Real workers will be assigned to your project.");
      navigate('/booking-history'); // Redirect to booking history
    } catch (error: any) {
      console.error('Booking submission error:', error);
      alert(`Booking failed: ${error.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="bg-[#00467f] p-8 text-white flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">Place Your Order</h1>
            <p className="text-blue-100 mt-2">Enter your requirements below.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200 uppercase font-bold">Total Amount</p>
            <p className="text-3xl font-mono font-bold">LKR {totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section: Customer Info (Now Editable) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <User size={20} className="text-[#00467f]" /> Contact Details
            </h3>
            <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input 
                    required 
                    value={formData.customerName} 
                    className="w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-[#00467f]" 
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                  <input 
                    required 
                    type="email"
                    value={formData.email} 
                    className="w-full p-3 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-[#00467f]" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="Mobile 1" className="p-3 border rounded-lg" onChange={(e)=>setFormData({...formData, phone1: e.target.value})} />
                    <input placeholder="Mobile 2" className="p-3 border rounded-lg" onChange={(e)=>setFormData({...formData, phone2: e.target.value})} />
                </div>
            </div>
          </div>

          {/* Section: Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Briefcase size={20} className="text-[#00467f]" /> Work Requirements
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Type</label>
              <select 
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                onChange={(e) => setFormData({...formData, workerType: e.target.value})}
                value={formData.workerType}
              >
                <option value="">Select a Service</option>
                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.service_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Workers</label>
                    <input type="number" min="1" value={formData.numWorkers} className="w-full p-3 border rounded-lg mt-1" onChange={(e)=>setFormData({...formData, numWorkers: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Duration (Days)</label>
                    <input type="number" readOnly value={formData.numDays} className="w-full p-3 bg-gray-100 border rounded-lg mt-1 text-gray-400" />
                </div>
            </div>

            {/* FIXED SPACING: Added mb-2 to label and mt-1 to input container */}
            <div className="relative">
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Select Dates</label>
                <div className="relative">
                    <DatePicker 
                        selectsRange 
                        startDate={startDate} 
                        endDate={endDate} 
                        onChange={(update: any) => setDateRange(update)} 
                        className="w-full p-3 border rounded-lg cursor-pointer outline-none focus:ring-2 focus:ring-[#00467f]"
                        placeholderText="Choose start and end date"
                    />
                </div>
            </div>
          </div>

          {/* Location & Details */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <MapPin size={20} className="text-[#00467f]" /> Job Details
            </h3>
            <textarea required placeholder="Job Description..." className="w-full p-3 border rounded-lg h-24" onChange={(e)=>setFormData({...formData, description: e.target.value})} />
            <textarea required placeholder="Full Work Address" className="w-full p-3 border rounded-lg" onChange={(e)=>setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit"
              disabled={!!errorMessage || !endDate || loading}
              className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg transform transition-all
                ${errorMessage || !endDate || loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:scale-[1.01]'}`}
            >
              {loading ? 'Processing...' : 'Confirm & Place Order'} 
              {!loading && <ChevronRight size={20} />}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default HireWorkerForm;