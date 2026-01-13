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
    id: bookingToEdit?.booking_id || '',
    // Editable Fields - Note: Real API doesn't allow editing customer details
    customerName: bookingToEdit?.customer_first_name && bookingToEdit?.customer_last_name 
      ? `${bookingToEdit.customer_first_name} ${bookingToEdit.customer_last_name}` 
      : '', 
    email: '', // Not available in booking data
    phone: '', // Not available in booking data
    // Read-only reference fields
    role: bookingToEdit?.service_name || '',
    staffCount: bookingToEdit?.number_of_workers || 1,
    location: bookingToEdit?.work_description || '',
    status: bookingToEdit?.booking_status || 'pending',
    date: bookingToEdit?.start_date ? new Date(bookingToEdit.start_date).toLocaleDateString() : '',
    totalAmount: bookingToEdit?.total_amount_lkr || 0,
    advanceAmount: bookingToEdit?.advance_amount_lkr || 0,
    remainingAmount: bookingToEdit?.remaining_amount_lkr || 0
  });

  useEffect(() => {
    if (!bookingToEdit) {
      navigate('/booking-history');
    }
  }, [bookingToEdit, navigate]);

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
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <p className="text-blue-200 mt-2">Booking ID: <span className="font-mono text-white">#{formData.id}</span></p>
          </div>
          <div className="hidden sm:block text-right">
             <div className="text-xs text-blue-300 uppercase font-bold mb-1">Current Status</div>
             <span className="px-4 py-2 bg-blue-800 rounded-full border border-blue-700 text-sm font-bold uppercase">
               {formData.status}
             </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* BOOKING DETAILS SECTION */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" /> Booking Information
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Type</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                {formData.role}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Workers</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                {formData.staffCount} worker{formData.staffCount !== 1 ? 's' : ''}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Work Description</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                {formData.location || 'No description provided'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Booking Date</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                {formData.date}
              </div>
            </div>
          </div>

          {/* PAYMENT DETAILS SECTION */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
              <Mail size={20} className="text-blue-600" /> Payment Information
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Total Amount</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-bold text-lg">
                LKR {formData.totalAmount?.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Advance Amount</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                LKR {formData.advanceAmount?.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Remaining Amount</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                LKR {formData.remainingAmount?.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Status</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">
                {bookingToEdit?.payment_status || 'Pending'}
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/booking-history')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft size={16} className="inline mr-2" /> Back to History
          </button>
          {formData.status === 'pending' || formData.status === 'confirmed' ? (
            <button
              type="button"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <XCircle size={16} className="inline mr-2" /> Cancel Booking
            </button>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default ManageStaff;