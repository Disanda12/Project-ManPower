import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  User,
  MapPin,
  Loader2,
  ShieldCheck,
  Package,
  Edit3,
  AlignLeft,
  Activity,
  History,
} from "lucide-react";

// API Services
import { getUserBookings, cancelBooking } from "../../api/bookingService";
import { notify } from "../utils/notify";

// Modals
import FeedbackForm from "../feedbacks/FeedBack";
import CancelModal from "./CancelModal";
import UpdateBookingModal from "./UpdateBookingModal";

const OrderHistory = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState<"Active" | "Confirmed" | "Completed">("Active");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal Management States
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [updateTarget, setUpdateTarget] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Actions ---
  const fetchOrders = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) { setLoading(false); return; }
    try {
      const response = await getUserBookings(Number(userId));
      if (response?.success) setOrders(response.data);
    } catch (err: any) {
      notify.error(err || "Failed to sync records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancelConfirm = async () => {
    if (!cancelId) return;
    setIsProcessing(true);
    try {
      const res = await cancelBooking(cancelId);
      if (res.success) {
        notify.success("Booking Cancelled Successfully");
        await fetchOrders();
        setCancelId(null);
      }
    } catch (err: any) {
      notify.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Updated Logic ---
  
  // 1. Unified Status Styling
  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase().trim();
    if (s === 'pending') return "bg-amber-50 text-amber-600 border-amber-100";
    if (s === 'confirmed' || s === 'assigned') return "bg-blue-50 text-blue-600 border-blue-100";
    if (s === 'completed') return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === 'in_progress') return "bg-purple-50 text-purple-600 border-purple-100";
    return "bg-slate-50 text-slate-500 border-slate-100";
  };

  // 2. Tab Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const dbStatus = order.booking_status?.toLowerCase().trim() || "";
    
    if (activeTab === "Active") {
      return dbStatus === "pending";
    }
    if (activeTab === "Confirmed") {
      // "Assigned" orders now appear here
      return ["confirmed", "assigned"].includes(dbStatus);
    }
    // Completed tab shows historical data
    return ["completed", "cancelled", "in_progress"].includes(dbStatus);
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing Ledger...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-28 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1.5 bg-blue-600 rounded-full hidden md:block" />
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Service Ledger</h1>
              <p className="text-slate-500 text-sm font-medium">Real-time deployment tracking</p>
            </div>
          </div>

          <div className="flex bg-white/80 backdrop-blur-md p-1 rounded-2xl border border-slate-200 shadow-sm">
            {["Active", "Confirmed", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative px-6 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 ${
                  activeTab === tab ? "text-white" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-blue-600 rounded-xl" />
                )}
                <span className="relative z-10 uppercase tracking-[0.1em]">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR SNAPSHOT */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Activity size={18} className="text-blue-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Snapshot</h4>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Confirmed Units</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-4xl font-black text-blue-600">
                      {/* Count both Confirmed and Assigned for the sidebar */}
                      {orders.filter(o => ["confirmed", "assigned"].includes(o.booking_status?.toLowerCase())).length}
                    </h2>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Verified</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Review</span>
                    <span className="text-xs font-black text-amber-600">
                      {orders.filter(o => o.booking_status?.toLowerCase() === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Registry</span>
                    <span className="text-xs font-black text-slate-900">{orders.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
              <History size={20} className="text-blue-400 mb-4" />
              <h2 className="text-lg font-bold">System Online</h2>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Data Synchronized</span>
              </div>
            </div>
          </div>

          {/* ORDERS LIST */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.div
                    key={order.booking_id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white border border-slate-200 rounded-[2.5rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                  >
                    <div className="p-6 md:p-8">
                      {/* Card Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex gap-4">
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border-2 ${getStatusStyles(order.booking_status)}`}>
                            {["confirmed", "assigned"].includes(order.booking_status?.toLowerCase()) ? 
                               <ShieldCheck size={28} /> : <Clock size={28} />
                            }
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">{order.service_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono text-slate-400">#BK-{order.booking_id}</span>
                              <div className="h-1 w-1 bg-slate-200 rounded-full" />
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getStatusStyles(order.booking_status)}`}>
                                {order.booking_status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                          <span className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter">Settlement</span>
                          <span className="text-lg font-black text-blue-600">LKR {Number(order.total_amount_lkr).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Info Bar */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Calendar size={12}/> Schedule</label>
                          <p className="text-xs font-bold text-slate-700">{new Date(order.start_date).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><User size={12}/> Unit Strength</label>
                          <p className="text-xs font-bold text-slate-700">{order.number_of_workers} Personnel</p>
                        </div>
                        <div className="space-y-1">
                          <label className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest"><MapPin size={12}/> Deployment</label>
                          <p className="text-xs font-bold text-slate-700 line-clamp-1 italic">{order.location || "On-site"}</p>
                        </div>
                      </div>

                      {/* Description Area */}
                      <div className="flex gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 mb-8">
                         <AlignLeft size={16} className="text-slate-300 shrink-0" />
                         <p className="text-[11px] text-slate-500 leading-relaxed font-bold tracking-tight uppercase">
                            {order.work_description}
                         </p>
                      </div>

                      {/* Action Bar */}
{/* Action Bar */}
<div className="flex items-center justify-between">
  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Authorized Transaction</span>

  <div className="flex items-center gap-2">
    {/* Cancel remains available for Pending, Assigned, and Confirmed */}
    {["pending", "assigned", "confirmed"].includes(order.booking_status?.toLowerCase()) && (
      <button 
        onClick={() => setCancelId(order.booking_id)}
        className="h-10 px-4 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-lg transition-all uppercase tracking-widest"
      >
        Cancel
      </button>
    )}
    
    {activeTab === "Completed" ? (
      order.booking_status?.toLowerCase() === "completed" && (
        <button
          onClick={() => setSelectedBookingId(order.booking_id)}
          className="h-10 px-6 bg-amber-400 hover:bg-amber-500 text-amber-950 text-[11px] font-black rounded-lg transition-all uppercase shadow-md shadow-amber-100"
        >
          Rate Service
        </button>
      )
    ) : (
      /* ONLY show Update button if the status is Pending */
      order.booking_status?.toLowerCase() === "pending" && (
        <button
          onClick={() => setUpdateTarget(order)}
          className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-100 uppercase tracking-widest"
        >
          <Edit3 size={13} /> Update
        </button>
      )
    )}
  </div>
</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-200">
                  <Package className="text-slate-100 mb-4" size={60} />
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Registry Clear</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- MODAL OVERLAYS --- */}
      <AnimatePresence>
        {selectedBookingId && (
          <FeedbackForm 
            bookingId={selectedBookingId} 
            onClose={() => setSelectedBookingId(null)} 
          />
        )}
      </AnimatePresence>

      <UpdateBookingModal 
        isOpen={!!updateTarget} 
        onClose={() => setUpdateTarget(null)} 
        bookingData={updateTarget}
      />

      <CancelModal 
        isOpen={!!cancelId} 
        onClose={() => setCancelId(null)} 
        onConfirm={handleCancelConfirm}
        isProcessing={isProcessing}
        bookingId={cancelId}
      />
    </div>
  );
};

export default OrderHistory;