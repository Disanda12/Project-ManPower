import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  Download,
  Users
} from 'lucide-react';

// Mock Data - In a real app, this comes from your API
const MOCK_BOOKINGS = [
  { id: 'ORD-7721', customer: 'Alice Johnson', service: 'Masonry', date: '2024-05-15', workers: 3, status: 'Pending', total: '$450' },
  { id: 'ORD-7722', customer: 'TechCorp Solutions', service: 'IT Support', date: '2024-05-16', workers: 1, status: 'Confirmed', total: '$1,200' },
  { id: 'ORD-7723', customer: 'Michael Smith', service: 'Cleaning', date: '2024-05-14', workers: 5, status: 'Completed', total: '$300' },
  { id: 'ORD-7724', customer: 'Sarah Williams', service: 'Moving', date: '2024-05-18', workers: 2, status: 'Cancelled', total: '$150' },
];

const AdminBookingManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Manage Bookings</h1>
            <p className="text-slate-500 mt-1">Total active orders: {MOCK_BOOKINGS.length}</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
                { label: 'Total Orders', value: '128', icon: ExternalLink, color: 'text-blue-600' },
                { label: 'Pending', value: '12', icon: Clock, color: 'text-amber-500' },
                { label: 'Confirmed', value: '84', icon: CheckCircle, color: 'text-emerald-500' },
                { label: 'Active Workers', value: '45', icon: Users, color: 'text-indigo-600' },
            ].map((stat) => (
                <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
                        </div>
                        <stat.icon className={stat.color} size={24} />
                    </div>
                </div>
            ))}
        </div>

        {/* --- SEARCH & FILTER --- */}
        <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-b-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Service</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Staff</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {MOCK_BOOKINGS.map((order) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="transition-colors group"
                    >
                      <td className="p-4 font-mono text-sm font-bold text-blue-600">{order.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{order.customer}</p>
                        <p className="text-xs text-slate-400">{order.date}</p>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{order.service}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                          {order.workers} Workers
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Order">
                            <Edit3 size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* --- PAGINATION --- */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">Showing 1 to 4 of 128 results</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white text-slate-600 hover:bg-slate-100">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBookingManager;