import React, { useState } from 'react';
import { Star, Send, X, MessageSquare, ShieldCheck, Activity } from 'lucide-react';
import { notify } from '../utils/notify';
import { submitFeedback } from '../../api/feedbackService';
import { motion } from 'framer-motion';

interface FeedbackProps {
    bookingId: number;
    onClose: () => void;
    onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackProps> = ({ bookingId, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return notify.error("Classification Required: Please select a rating");

        const feedbackData = {
            booking_id: bookingId,
            customer_id: Number(localStorage.getItem('user_id')),
            rating: rating,
            comment: comment,
        };

        setIsSubmitting(true);
        try {
            await submitFeedback(feedbackData);
            notify.success("Feedback Transmitted Successfully");
            if (onSuccess) onSuccess();
            onClose();
        } catch (err: any) {
            notify.error(err || "Transmission Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop - Added pointer-events for safety */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
                onClick={onClose} 
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                // STOP PROPAGATION: This prevents clicking the modal from triggering the backdrop's onClose
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden z-20"
            >
                {/* Header */}
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <MessageSquare size={80} />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Post-Service Audit</span>
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Rate Deployment</h2>
                        <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">Reference: #BK-{bookingId}</p>
                    </div>

                    {/* FIXED CLOSE BUTTON: Added type="button" to prevent form trigger */}
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-8 right-8 h-10 w-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all z-50 group"
                    >
                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-4 text-center">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Quality Level</label>
                        <div className="flex gap-3 justify-center">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onMouseEnter={() => setHover(num)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(num)}
                                    className="relative transition-transform active:scale-90"
                                >
                                    <Star
                                        size={36}
                                        strokeWidth={1.5}
                                        className={`transition-all duration-300 ${
                                            (hover || rating) >= num 
                                            ? "text-blue-600 fill-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" 
                                            : "text-slate-200 fill-transparent"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-blue-600 uppercase h-4">
                            {rating === 5 && "Elite Performance"}
                            {rating === 4 && "Above Standards"}
                            {rating === 3 && "Standard Deployment"}
                            {rating === 2 && "Below Requirements"}
                            {rating === 1 && "Critical Failure"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Remarks</label>
                        <textarea
                            required
                            placeholder="INPUT OBSERVATIONS HERE..."
                            className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-xs font-bold text-slate-700 h-32 outline-none focus:border-blue-500 focus:bg-white transition-all uppercase tracking-tight"
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 items-center">
                        <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                        <p className="text-[9px] text-blue-700 font-bold uppercase leading-relaxed">
                            This feedback will be filed into the service provider's permanent record.
                        </p>
                    </div>

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-blue-700 shadow-xl shadow-blue-100 disabled:opacity-50 transition-all flex justify-center items-center gap-3"
                    >
                        {isSubmitting ? "Transmitting..." : <>Submit Report <Send size={14} /></>}
                    </button>
                </form>

                <div className="bg-slate-50 py-3 px-8 border-t border-slate-100 flex justify-center">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">End of Transmission</span>
                </div>
            </motion.div>
        </div>
    );
};

export default FeedbackForm;