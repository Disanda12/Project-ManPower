import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MessageSquare, User, Calendar, 
  Check, X, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2
} from 'lucide-react';
import { getAllFeedbacksForAdmin, updateFeedbackStatus, AdminFeedback } from '../../../api/feedbackService';

const AdminFeedbackManager = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await getAllFeedbacksForAdmin();
      setFeedbacks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: 'approved' | 'reject') => {
    try {
      await updateFeedbackStatus(id, newStatus);
      // Update local state
      setFeedbacks(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update feedback status');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
    ));
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl px-4 md:px-20">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <MessageSquare className="text-blue-600" size={32} />
            Moderation Center
          </h1>
          <p className="text-slate-500 mt-2">Approve feedback to display it on the landing page.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <span className="ml-2 text-slate-600">Loading feedbacks...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {feedbacks.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className={`bg-white rounded-3xl p-6 border-2 transition-all overflow-hidden relative ${
                    item.status === 'approved' ? 'border-emerald-500/20 shadow-emerald-100' : 
                    item.status === 'reject' ? 'border-rose-500/20 opacity-75' : 'border-transparent shadow-sm'
                  }`}
                >
                  {/* Status Indicator Badge */}
                  <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm ${
                    item.status === 'approved' ? 'bg-emerald-500 text-white' : 
                    item.status === 'reject' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                  }`}>
                    {item.status === 'approved' ? <Eye size={12} /> : item.status === 'reject' ? <EyeOff size={12} /> : <AlertCircle size={12} />}
                    {item.status}
                  </div>

                  <div className="flex gap-1 mb-4">{renderStars(item.rating)}</div>
                  
                  <p className="text-slate-700 italic mb-6">"{item.comment}"</p>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400"><User size={20} /></div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.customer}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.service}</p>
                      </div>
                    </div>

                    {/* MODERATION BUTTONS */}
                    <div className="flex gap-2">
                      {item.status !== 'reject' && (
                        <button 
                          onClick={() => handleStatusUpdate(item.id, 'reject')}
                          className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all font-bold text-xs"
                        >
                          <X size={16} /> Reject
                        </button>
                      )}
                      
                      {item.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusUpdate(item.id, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-bold text-xs shadow-sm shadow-emerald-100"
                        >
                          <Check size={16} /> Accept & Publish
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackManager;