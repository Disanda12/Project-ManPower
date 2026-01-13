import React, { useState } from 'react';
import { Star, Camera, Send, X } from 'lucide-react';
import { notify } from '../utils/notify';
import { submitFeedback } from '../../api/feedbackService';
import { motion } from 'framer-motion';

interface FeedbackProps {
    bookingId: number;
    onClose: () => void; // Added to close the popup
    onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackProps> = ({ bookingId, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return notify.error("Please select a rating");
    
    // Prepare the data object
    const feedbackData = {
        booking_id: bookingId,
        customer_id: Number(localStorage.getItem('user_id')),
        rating: rating,
        comment: comment,
    };

    // 1. Log the data being sent
    console.log("Submitting Feedback Data:", feedbackData);

    setIsSubmitting(true);
    try {
        const result = await submitFeedback(feedbackData);

        // 2. Log the successful response from backend
        console.log("Server Response:", result);

        notify.success("Thank you for your feedback!");
        if (onSuccess) onSuccess();
        onClose(); 
    } catch (err: any) {
        // 3. Log errors if the request fails
        console.error("Submission Error:", err);
        notify.error(err);
    } finally {
        setIsSubmitting(false);
    }
};
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-md w-full relative"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-bold text-slate-800 mb-2">Rate your experience</h3>
                <p className="text-sm text-gray-500 mb-6">Order ID: ORD-{bookingId}</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2 justify-center mb-4">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <Star
                                key={num}
                                size={32}
                                className="cursor-pointer transition-transform hover:scale-110"
                                fill={rating >= num ? "#EAB308" : "none"}
                                color={rating >= num ? "#EAB308" : "#CBD5E1"}
                                onClick={() => setRating(num)}
                            />
                        ))}
                    </div>

                    <textarea
                        required
                        placeholder="Describe your experience..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-28 outline-none focus:ring-2 focus:ring-[#00467f]/20 focus:border-[#00467f]"
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {/* <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFile} />
                        {!preview ? (
                            <>
                                <Camera className="text-slate-400 mb-1" size={24} />
                                <span className="text-xs text-slate-500">Add a photo (Optional)</span>
                            </>
                        ) : (
                            <div className="relative">
                                <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded-lg" />
                                <button 
                                    type="button" 
                                    onClick={(e) => { e.stopPropagation(); setPreview(null); setPhoto(null); }} 
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                ><X size={12}/></button>
                            </div>
                        )}
                    </div> */}

                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-[#00467f] text-white py-3 rounded-xl font-bold hover:bg-[#003561] disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? "Submitting..." : "Send Feedback"} <Send size={18} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default FeedbackForm;