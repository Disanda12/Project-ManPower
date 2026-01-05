import { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: "ORD-7281",
    status: "Active",
    role: "General Labor",
    date: "Jan 15, 2026",
    location: "Warehouse A - Colombo",
    staffCount: 5,
    totalAmount: "$450.00"
  },
  {
    id: "ORD-6192",
    status: "Completed",
    role: "Forklift Operator",
    date: "Dec 20, 2025",
    location: "Construction Site B",
    staffCount: 2,
    totalAmount: "$320.00"
  }
];

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Completed'>('Active');
  const navigate = useNavigate(); // 2. Initialize navigate

  const filteredOrders = MOCK_ORDERS.filter(order => order.status === activeTab);

  // 3. Logic to send data to the Management page
  const handleManageClick = (order: any) => {
    navigate("/manage-bookings", { state: { bookingData: order } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00467f]">Order History</h1>
          <p className="text-gray-600 mt-2">Manage your current staffing and view past records.</p>
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
          <AnimatePresence mode="wait">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          order.status === 'Active' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {order.status === 'Active' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{order.role}</h3>
                          <p className="text-sm text-gray-500 font-mono">ID: {order.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          order.status === 'Active' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                        <p className="mt-2 text-lg font-bold text-[#00467f]">{order.totalAmount}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-50">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {order.date}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <User size={16} className="mr-2 text-gray-400" />
                        {order.staffCount} Staff Members
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        {order.location}
                      </div>
                    </div>

                    {/* Management Actions */}
                    <div className="mt-6 flex justify-end space-x-3">
                      {order.status === 'Active' ? (
                        <>
                          <button className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100">
                            <XCircle size={16} className="mr-2" /> Cancel
                          </button>
                          {/* 4. Corrected onClick and wrapping */}
                          <button 
                            onClick={() => handleManageClick(order)}
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
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">No {activeTab.toLowerCase()} bookings found.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;