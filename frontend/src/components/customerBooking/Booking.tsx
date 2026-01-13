import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Briefcase, ChevronRight, Info, Mail } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { fetchAvailableServices, Service } from '../../api/serviceService';
import { notify } from '../utils/notify';
import { createBooking } from '../../api/bookingService';



const HireWorkerForm = () => {
  const navigate = useNavigate();
  
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

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
    const loadServices = async () => {
      try {
        const data = await fetchAvailableServices();
        setServices(data);
      } catch (err: any) {
        notify.error("Could not load services.");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    const service = services.find(s => s.service_id.toString() === sId) || null;
    setSelectedService(service);
    setFormData(prev => ({ ...prev, serviceId: sId }));
  };

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, numDays: diffDays }));
    }
  }, [startDate, endDate]);

  const dailyRate = selectedService ? Number(selectedService.daily_rate_lkr) : 0;
  const totalAmount = dailyRate * formData.numWorkers * formData.numDays;
  const advancePercent = selectedService ? Number(selectedService.advance_percentage) : 0;
  const advanceAmount = (totalAmount * advancePercent) / 100;

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!startDate || !endDate) return notify.error("Please select a date range.");
    if (!formData.serviceId) return notify.error("Please select a service type.");

    // 2. Map UI data to Database Payload
    const payload = {
        customer_id: Number(localStorage.getItem('user_id')), 
        service_id: Number(formData.serviceId),
        number_of_workers: formData.numWorkers,
        work_description: `Address: ${formData.address} | Note: ${formData.description}`,
        start_date: startDate.toLocaleDateString('en-CA'), // Formats to YYYY-MM-DD
        end_date: endDate.toLocaleDateString('en-CA'),
        total_amount_lkr: totalAmount,
        advance_amount_lkr: advanceAmount,
    };

    try {
        const result = await createBooking(payload);
        console.log
        if (result.success) {
            notify.success("Booking Submitted Successfully!");
            navigate('/booking-history'); // Redirect to history
        }
    } catch (err: any) {
        notify.error(err);
    }
};
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

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
              <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
              <select 
                required
                value={formData.serviceId}
                onChange={handleServiceChange}
                className="w-full p-3 bg-gray-50 border rounded-lg mt-1 outline-none focus:ring-2 focus:ring-[#00467f]"
              >
                <option value="">Select Service</option>
                {services.map(s => (
                  <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
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

          {/* Pricing Summary */}
          <div className="md:col-span-2 bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-blue-800">
                    <Info size={18} />
                    <span className="font-semibold">Pricing Summary</span>
                </div>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Total Booking Amount</span>
                    <span className="font-mono">LKR {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#00467f] font-bold text-lg pt-2 border-t border-blue-200">
                    <span>Advance Payment ({advancePercent}%)</span>
                    <span className="font-mono">LKR {advanceAmount.toLocaleString()}</span>
                </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-[#00467f] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#003561] transition-all flex items-center justify-center gap-2">
              Confirm Order Details <ChevronRight size={20} />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default HireWorkerForm;