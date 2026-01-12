import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Calendar, 
  User, 
  MapPin,
  XCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getCustomerBookings, getAllBookings } from '../../api/bookingService';
import { notify } from '../utils/notify';

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setIsAdmin(userRole === 'admin');
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const userRole = localStorage.getItem('role');
      const isAdminUser = userRole === 'admin';
      
      const bookingsData = isAdminUser ? await getAllBookings() : await getCustomerBookings();
      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      setError(error || 'Failed to load booking history');
      notify.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  // Map booking status to display status
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'assigned':
      case 'in_progress':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Active';
    }
  };

  // Filter bookings based on active tab
  const filteredOrders = bookings.filter(booking => {
    const displayStatus = getDisplayStatus(booking.booking_status);
    return displayStatus === activeTab;
  });

  // 3. Logic to send data to the Management page
  const handleManageClick = (booking: any) => {
    navigate("/manage-bookings", { state: { bookingData: booking } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00467f]">
            {isAdmin ? 'All Orders History' : 'Order History'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isAdmin 
              ? 'View all booking orders from all users in the system.' 
              : 'Manage your current staffing and view past records.'
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl mb-8 w-fit">
          {['Active', 'Completed'].map((tab) => (
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

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00467f]"></div>
                <span className="ml-2 text-gray-500">
                  {isAdmin ? 'Loading all booking history...' : 'Loading booking history...'}
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-red-200">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
              <p className="text-red-600 font-medium">Error loading bookings</p>
              <p className="text-gray-500 text-sm mt-1">{error}</p>
              <button 
                onClick={fetchBookings}
                className="mt-4 px-4 py-2 bg-[#00467f] text-white rounded-lg hover:bg-[#003561] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((booking) => (
                  <motion.div
                    key={booking.booking_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${
                            getDisplayStatus(booking.booking_status) === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                          }`}>
                            {getDisplayStatus(booking.booking_status) === 'Active' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{booking.service_name}</h3>
                            <p className="text-sm text-gray-500 font-mono">ID: #{booking.booking_id}</p>
                            {isAdmin && (
                              <p className="text-sm text-gray-500">
                                Customer: {booking.customer_name || 
                                         (booking.customer_first_name && booking.customer_last_name 
                                           ? `${booking.customer_first_name} ${booking.customer_last_name}`
                                           : 'N/A')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            getDisplayStatus(booking.booking_status) === 'Active' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {getDisplayStatus(booking.booking_status)}
                          </span>
                          <p className="mt-2 text-lg font-bold text-[#00467f]">LKR {booking.total_amount_lkr?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <User size={16} className="mr-2 text-gray-400" />
                          {booking.number_of_workers} Staff Member{booking.number_of_workers !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <MapPin size={16} className="mr-2 text-gray-400" />
                          {booking.work_description || 'Service Location'}
                        </div>
                      </div>

                      {/* Management Actions */}
                      {!isAdmin && (
                        <div className="mt-6 flex justify-end space-x-3">
                          {getDisplayStatus(booking.booking_status) === 'Active' ? (
                            <>
                              <button className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100">
                                <XCircle size={16} className="mr-2" /> Cancel
                              </button>
                              {/* 4. Corrected onClick and wrapping */}
                              <button 
                                onClick={() => handleManageClick(booking)}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#00467f] hover:bg-[#003561] rounded-lg transition-colors"
                              >
                                Manage Staff <ChevronRight size={16} className="ml-1" />
                              </button>
                            </>
                          ) : (
                            <button className="flex items-center px-4 py-2 text-sm font-medium text-[#00467f] hover:bg-blue-50 rounded-lg transition-colors border border-blue-100">
                              <RefreshCw size={16} className="mr-2" /> Reorder
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500">
                    {isAdmin 
                      ? `No ${activeTab.toLowerCase()} bookings found in the system.`
                      : `No ${activeTab.toLowerCase()} bookings found.`
                    }
                  </p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;