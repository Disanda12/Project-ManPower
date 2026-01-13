import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  ChevronRight,
  Calendar,
  User,
  MapPin,
  XCircle,
  RefreshCw,
  Loader2,
  Star,
} from "lucide-react";
import { getUserBookings } from "../../api/bookingService";
import { notify } from "../utils/notify";
import FeedbackForm from "../feedbacks/FeedBack";
const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"Active" | "Completed">("Active");
  const navigate = useNavigate();
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );
  console.log("nnnnnnnnnnnnnnn");
  // BookingHistory.tsx - Update your useEffect logic

  useEffect(() => {
    console.log("ccccccccccccccccccccc");
    const fetchOrders = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setLoading(false);
        return;
      }
      console.log("qqqqqqqqqqqqqqqq", userId);
      try {
        const response = await getUserBookings(Number(userId));

        console.log("wwwwwwwwwwwwwwwwwwwwww", response);
        if (response && response.success && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        console.error("API Error:", err);
        notify.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter logic

  const filteredOrders = orders.filter((order) => {
    // 1. Ensure the status exists and convert to lowercase
    const dbStatus = order.booking_status
      ? order.booking_status.toLowerCase().trim()
      : "";

    if (activeTab === "Active") {
      // These are the statuses that should show in the "Active" tab
      return ["pending", "confirmed", "assigned", "in_progress"].includes(
        dbStatus
      );
    } else {
      // This is for the "Completed" tab
      return dbStatus === "completed";
    }
  });

  const handleManageClick = (order: any) => {
    navigate("/manage-bookings", { state: { bookingData: order } });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00467f]" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto pt-10">
        {" "}
        {/* Added padding top for navbar safety */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00467f]">Order History</h1>
          <p className="text-gray-600 mt-2">
            Manage your real-time staffing requests.
          </p>
        </div>
        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 w-fit">
          {["Active", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-white text-[#00467f] shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab} Bookings
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.booking_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-full ${
                            activeTab === "Active"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {activeTab === "Active" ? (
                            <Clock size={24} />
                          ) : (
                            <CheckCircle2 size={24} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.service_name}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono">
                            ID: ORD-{order.booking_id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.booking_status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {order.booking_status}
                        </span>
                        <p className="mt-2 text-lg font-bold text-[#00467f]">
                          LKR {Number(order.total_amount_lkr).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {new Date(order.start_date).toLocaleDateString()} -{" "}
                        {new Date(order.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <User size={16} className="mr-2 text-gray-400" />
                        {order.number_of_workers} Workers Requested
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-start gap-2">
                      <MapPin
                        size={16}
                        className="mt-0.5 text-gray-400 shrink-0"
                      />
                      <p className="line-clamp-2">{order.work_description}</p>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      {activeTab === "Active" ? (
                        <>
                          <button className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100">
                            <XCircle size={16} className="mr-2" /> Cancel
                          </button>
                          <button
                            onClick={() => handleManageClick(order)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#00467f] hover:bg-[#003561] rounded-lg transition-colors shadow-sm"
                          >
                            Manage Order{" "}
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setSelectedBookingId(order.booking_id)}
                          className="flex items-center px-4 py-2 text-sm font-medium text-[#00467f] hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 shadow-sm"
                        >
                          Rate Service{" "}
                          <Star size={16} className="ml-2 text-yellow-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">
                  No {activeTab.toLowerCase()} bookings found.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {selectedBookingId && (
          <FeedbackForm
            bookingId={selectedBookingId}
            onClose={() => setSelectedBookingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistory;
