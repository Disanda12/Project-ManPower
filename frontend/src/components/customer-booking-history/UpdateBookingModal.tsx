import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  Users, 
  Calendar, 
  Info, 
  Settings2,
  FileText,
  ShieldCheck,
  CreditCard
} from "lucide-react";

interface UpdateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: any;
}

const UpdateBookingModal: React.FC<UpdateBookingModalProps> = ({
  isOpen,
  onClose,
  bookingData
}) => {
  if (!bookingData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Settings2 size={120} />
               </div>
               
               <div className="relative z-10 flex justify-between items-start">
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Ledger Manifest</span>
                   </div>
                   <h2 className="text-2xl font-black uppercase tracking-tight">Booking Details</h2>
                   <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
                     Registry ID: #BK-{bookingData.booking_id}
                   </p>
                 </div>
                 <button 
                   onClick={onClose}
                   className="h-10 w-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors"
                 >
                   <X size={20} />
                 </button>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-8 md:p-10 space-y-6 bg-white">
              
              {/* Service Header */}
              <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Service</h4>
                  <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{bookingData.service_name}</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deployment Location - Read Only */}
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <MapPin size={12} className="text-blue-600"/> Deployment Site
                  </label>
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-tight leading-relaxed">
                    {bookingData.location || "Central Deployment Zone"}
                  </p>
                </div>

                {/* Settlement Amount - Read Only */}
                <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100">
                  <label className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                    <CreditCard size={12}/> Settlement Amount
                  </label>
                  <p className="text-xl font-black text-blue-600">
                    LKR {Number(bookingData.total_amount_lkr).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Staff Strength */}
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Users size={12} className="text-blue-600"/> Personnel
                  </label>
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    {bookingData.number_of_workers} Staff Units
                  </p>
                </div>

                {/* Date */}
                <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Calendar size={12} className="text-blue-600"/> Scheduled Date
                  </label>
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                    {new Date(bookingData.start_date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              </div>

              {/* Status Note */}
              <div className="flex gap-4 p-5 bg-slate-900 rounded-3xl items-center">
                <div className="h-10 w-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</h4>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">
                    Authorized & Locked in Registry
                  </p>
                </div>
              </div>

              {/* Action Button (Just to Close) */}
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-[10px] font-black rounded-2xl transition-all uppercase tracking-[0.3em]"
                >
                  Close Terminal
                </button>
              </div>
            </div>

            {/* Footer Status */}
            <div className="bg-slate-50 py-4 px-8 border-t border-slate-100 flex justify-between items-center">
               <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Audit Trail Synchronized</span>
               <div className="flex gap-1">
                 <div className="h-1 w-4 rounded-full bg-blue-600" />
                 <div className="h-1 w-1 rounded-full bg-slate-200" />
                 <div className="h-1 w-1 rounded-full bg-slate-200" />
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateBookingModal;