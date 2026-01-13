import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Loader2, AlertTriangle, ArrowRight } from "lucide-react";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  bookingId: number | null;
}

const CancelModal: React.FC<CancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  bookingId
}) => {
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Design Accents */}
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
            
            <div className="h-20 w-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 group-hover:rotate-0 transition-transform">
              <AlertTriangle size={40} />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">
                Terminate Request?
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                You are about to cancel booking <span className="font-mono font-bold text-slate-900">#BK-{bookingId}</span>. 
                This action is permanent and cannot be undone. Are you sure you want to proceed with the cancellation?
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-black rounded-2xl shadow-lg shadow-red-200 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>CONFIRM CANCELLATION <ArrowRight size={14} /></>
                )}
              </button>

              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]"
              >
                Return to Ledger
              </button>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Secure Termination Protocol</span>
               <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CancelModal;