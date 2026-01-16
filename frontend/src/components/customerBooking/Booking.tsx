import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, HardHat, Users, ChevronRight, 
  Loader2, Wallet, Briefcase, Info, MessageSquare 
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// 1. Added useLocation to read URL params
import { useNavigate, useLocation } from 'react-router-dom'; 
import { fetchAvailableServices, Service } from '../../api/serviceService';
import { notify } from '../utils/notify';
import { createBooking } from '../../api/bookingService';

const HireWorkerForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Access location object
  
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ 
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

        // 3. Logic to auto-select service from URL
        const queryParams = new URLSearchParams(location.search);
        const serviceNameFromUrl = queryParams.get('service');

        if (serviceNameFromUrl) {
          const matchedService = data.find(
            (s) => s.service_name.toLowerCase() === serviceNameFromUrl.toLowerCase()
          );
          if (matchedService) {
            setSelectedService(matchedService);
          } else {
            // Fallback to first service if name doesn't match
            if (data.length > 0) setSelectedService(data[0]);
          }
        } else {
          // Default selection if no URL param exists
          if (data.length > 0) setSelectedService(data[0]);
        }
      } catch (err) {
        notify.error("Error loading services");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [location.search]); // 4. Re-run if URL changes

  useEffect(() => {
    if (startDate && endDate) {
      const diff = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, numDays: diff }));
    }
  }, [startDate, endDate]);

  const total = (selectedService ? Number(selectedService.daily_rate_lkr) : 0) * formData.numWorkers * formData.numDays;
  const advance = (total * (selectedService ? Number(selectedService.advance_percentage) : 0)) / 100;

  const handleBookingSubmit = async () => {
    if (!startDate || !endDate || !formData.address || !formData.description) {
      return notify.error("Please fill in all requirements.");
    }
    
    setIsSubmitting(true);
    try {
      const result = await createBooking({
        customer_id: Number(localStorage.getItem('user_id')),
        service_id: Number(selectedService?.service_id),
        number_of_workers: formData.numWorkers,
        work_description: formData.description,
        location: formData.address,
        start_date: startDate.toLocaleDateString('en-CA'),
        end_date: endDate.toLocaleDateString('en-CA'),
        total_amount_lkr: total,
        advance_amount_lkr: advance,
      });

      if (result.success) {
        notify.success("Booking Request Sent!");
        navigate('/customer-bookings');
      }
    } catch (err) {
      notify.error("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-white flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem] shadow-xl border border-gray-200 bg-white"
      >
        {/* LEFT SIDE: INPUT FORM */}
        <div className="lg:col-span-7 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <HardHat size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hire a Professional</h1>
              <p className="text-gray-500 font-medium italic">Configure your requirements below</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* SERVICE SELECTOR */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                <Briefcase size={14} /> 1. Select Service Type
              </label>
              <div className="flex flex-wrap gap-2">
                {services.map(s => (
                  <button 
                    key={s.service_id}
                    onClick={() => setSelectedService(s)}
                    className={`px-6 py-3 rounded-xl font-bold border-2 transition-all duration-200 ${
                      selectedService?.service_id === s.service_id 
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    {s.service_name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DATE PICKER */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                  <Calendar size={14} /> 2. Schedule Duration
                </label>
                <div className="relative">
                  <DatePicker 
                    selectsRange startDate={startDate} endDate={endDate} minDate={new Date()}
                    onChange={(update: any) => setDateRange(update)} 
                    className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 font-bold text-gray-700 outline-none focus:border-blue-600 transition-all cursor-pointer"
                    placeholderText="Click to select dates"
                  />
                </div>
              </div>

              {/* WORKER COUNTER */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                  <Users size={14} /> 3. Workforce Needed
                </label>
                <div className="flex items-center bg-gray-50 rounded-xl border-2 border-gray-100 h-14 px-2">
                  <button onClick={() => setFormData({...formData, numWorkers: Math.max(1, formData.numWorkers - 1)})} className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors">-</button>
                  <span className="flex-1 text-center font-bold text-xl text-gray-800">{formData.numWorkers} Staff</span>
                  <button onClick={() => setFormData({...formData, numWorkers: formData.numWorkers + 1})} className="w-10 h-10 bg-white border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors">+</button>
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                <MapPin size={14} /> 4. Deployment Location
              </label>
              <input 
                placeholder="Enter city and street address..."
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 font-bold text-gray-700 placeholder:text-gray-400 focus:border-blue-600 outline-none transition-all"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
                <MessageSquare size={14} /> 5. Job Description
              </label>
              <textarea 
                placeholder="Briefly describe the tasks (e.g., painting 2 rooms, fixing plumbing leak)..."
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full h-32 bg-gray-50 border-2 border-gray-100 rounded-xl p-4 font-bold text-gray-700 placeholder:text-gray-400 focus:border-blue-600 outline-none transition-all resize-none shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY */}
        <div className="lg:col-span-5 bg-blue-600 p-8 md:p-12 flex flex-col justify-between text-white relative">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-12 text-blue-100">Booking Summary</h2>
            
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-blue-400 pb-5">
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase mb-1">Service</p>
                  <p className="text-2xl font-bold">{selectedService?.service_name || 'Not Selected'}</p>
                </div>
                <p className="font-medium text-blue-100">LKR {Number(selectedService?.daily_rate_lkr).toLocaleString()}/day</p>
              </div>

              <div className="flex justify-between items-end border-b border-blue-400 pb-5">
                <div>
                  <p className="text-xs font-bold text-blue-200 uppercase mb-1">Total Bill</p>
                  <p className="text-4xl font-bold">LKR {total.toLocaleString()}</p>
                </div>
                <div className="text-right text-[10px] font-bold uppercase text-blue-100">
                  {formData.numWorkers} Staff • {formData.numDays} Days
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-2 mb-2 text-blue-600">
                  <Wallet size={20} />
                  <span className="text-xs font-black uppercase">Payable Now (Advance)</span>
                </div>
                <p className="text-5xl font-black text-gray-900 tracking-tight">
                  LKR {advance.toLocaleString()}
                </p>
                <p className="text-[10px] font-bold uppercase mt-4 text-gray-400 flex items-center gap-1">
                  <Info size={12}/> Required for schedule confirmation
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={handleBookingSubmit}
              disabled={isSubmitting || !endDate || !formData.address || !formData.description}
              className="w-full bg-gray-900 text-white hover:bg-black font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "CONFIRM & BOOK"}
              <ChevronRight size={22} />
            </button>
            <p className="text-center text-[10px] font-bold text-blue-100 uppercase tracking-widest mt-6 opacity-70">
              Reliable Service • Secure Payment
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HireWorkerForm;