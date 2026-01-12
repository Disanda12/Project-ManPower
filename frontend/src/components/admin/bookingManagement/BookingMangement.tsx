import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  Download,
  Users,
  UserCheck,
  X
} from 'lucide-react';
import { getAllBookings, assignWorkersToBooking } from '../../../api/bookingService';
import { getAllUsers } from '../../../api/userService';
import { notify } from '../../utils/notify';

const AdminBookingManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'assigned' | 'history'>('pending');

  useEffect(() => {
    fetchBookings();
    fetchWorkers();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingsData = await getAllBookings();
      setBookings(bookingsData);
    } catch (error: any) {
      if (error.includes('Access denied') || error.includes('Invalid token') || error.includes('Admin access required')) {
        notify.error('You must be logged in as an admin to access this page');
      } else {
        notify.error('Failed to fetch bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      const usersData = await getAllUsers();
      // Filter to only workers - include all workers even if they don't have service info
      const workersData = usersData.filter((user: any) => user.user_type === 'worker');
      console.log('Fetched workers:', workersData.map(w => ({ id: w.user_id, service_id: w.service_id, service_name: w.service_name })));
      setWorkers(workersData);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    }
  };

  const handleAssignWorkers = async (booking: any) => {
    // Refresh workers list to ensure newly added workers are available
    await fetchWorkers();

    console.log('Booking service_id:', booking.service_id, typeof booking.service_id);
    console.log('Available workers:', workers.map(w => ({ id: w.user_id, service_id: w.service_id, service_name: w.service_name })));

    // Filter workers by the service type of the booking
    const relevantWorkers = workers.filter((worker: any) => {
      const workerServiceId = parseInt(worker.service_id, 10);
      const bookingServiceId = parseInt(booking.service_id, 10);
      const match = workerServiceId === bookingServiceId;
      console.log(`Worker ${worker.user_id} (${worker.service_name}): service_id=${worker.service_id} -> ${workerServiceId}, booking_service_id=${booking.service_id} -> ${bookingServiceId}, match=${match}`);
      return match && worker.service_id && worker.service_name; // Only include workers with valid service info
    });

    console.log('Relevant workers found:', relevantWorkers.length);

    // If no workers found for this service, show all workers as fallback
    const workersToShow = relevantWorkers.length > 0 ? relevantWorkers : workers;

    setSelectedBooking({ ...booking, availableWorkers: workersToShow });
    setSelectedWorkers([]);
    setShowAssignModal(true);
  };

  const handleWorkerSelection = (workerId: number) => {
    setSelectedWorkers(prev =>
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const submitWorkerAssignment = async () => {
    if (!selectedBooking || selectedWorkers.length === 0) {
      notify.error('Please select at least one worker');
      return;
    }

    if (selectedWorkers.length > (selectedBooking.number_of_workers || selectedBooking.worker_count || 0)) {
      notify.error(`Cannot assign more than ${selectedBooking.number_of_workers || selectedBooking.worker_count || 0} workers`);
      return;
    }

    setAssigning(true);
    try {
      // Call the API to assign workers to the booking
      await assignWorkersToBooking(selectedBooking.booking_id, selectedWorkers);

      notify.success(`${selectedWorkers.length} worker(s) assigned successfully!`);
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedWorkers([]);
      fetchBookings(); // Refresh the list
      fetchWorkers(); // Refresh workers list in case availability changed
    } catch (error: any) {
      notify.error(error || 'Failed to assign workers');
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'assigned': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'in_progress': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const exportToCSV = () => {
    if (filteredBookings.length === 0) {
      notify.error('No data to export');
      return;
    }

    // Define CSV headers
    const headers = [
      'Booking ID',
      'Customer Name',
      'Service',
      'Duration (Days)',
      'Workers Required',
      'Assigned Workers',
      'Status',
      'Booking Date',
      'Start Date',
      'End Date',
      'Total Amount (LKR)',
      'Advance Amount (LKR)',
      'Remaining Amount (LKR)',
      'Payment Status',
      'Work Description'
    ];

    // Convert bookings to CSV rows
    const csvRows = filteredBookings.map(booking => [
      booking.booking_id || booking.id || '',
      booking.customer_name || 
      (booking.customer_first_name && booking.customer_last_name 
        ? `${booking.customer_first_name} ${booking.customer_last_name}`
        : ''),
      booking.service_type || booking.service_name || '',
      booking.total_days || 1,
      booking.worker_count || booking.number_of_workers || 0,
      booking.assigned_workers || '',
      booking.booking_status || booking.status || '',
      booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : '',
      booking.start_date ? new Date(booking.start_date).toLocaleDateString() : '',
      booking.end_date ? new Date(booking.end_date).toLocaleDateString() : '',
      booking.total_amount_lkr || 0,
      booking.advance_amount_lkr || 0,
      booking.remaining_amount_lkr || 0,
      booking.payment_status || '',
      `"${(booking.work_description || '').replace(/"/g, '""')}"` // Escape quotes in description
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...csvRows]
      .map(row => row.map(field => String(field || '').replace(/,/g, ';'))) // Replace commas with semicolons to avoid CSV issues
      .map(row => row.join(','))
      .join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    notify.success(`Exported ${filteredBookings.length} bookings to CSV`);
  };

  const getStatusStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.booking_status === 'pending').length;
    const confirmed = bookings.filter(b => b.booking_status === 'confirmed').length;
    const assigned = bookings.filter(b => b.booking_status === 'assigned').length;
    const inProgress = bookings.filter(b => b.booking_status === 'in_progress').length;
    const completed = bookings.filter(b => b.booking_status === 'completed').length;
    const cancelled = bookings.filter(b => b.booking_status === 'cancelled').length;

    return { total, pending, confirmed, assigned, inProgress, completed, cancelled };
  };

  const stats = getStatusStats();

  const filteredBookings = bookings.filter((booking: any) => {
    // Apply tab filter
    let matchesTab = false;
    if (activeTab === 'pending') {
      matchesTab = booking.booking_status === 'pending' || booking.booking_status === 'confirmed';
    } else if (activeTab === 'assigned') {
      matchesTab = booking.booking_status === 'assigned' || booking.booking_status === 'in_progress';
    } else if (activeTab === 'history') {
      matchesTab = true; // Show all bookings in history
    }

    // Apply search filter
    let matchesSearch = true;
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const bookingId = String(booking.booking_id || booking.id || '');
      const customerName = (booking.customer_name || 
                           (booking.customer_first_name && booking.customer_last_name 
                             ? `${booking.customer_first_name} ${booking.customer_last_name}`
                             : '')).toLowerCase();
      
      matchesSearch = bookingId.includes(searchLower) || customerName.includes(searchLower);
    }

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {activeTab === 'pending' ? 'Worker Assignment' : activeTab === 'assigned' ? 'Active Bookings' : 'Order History'}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'pending' 
                ? 'Assign workers to customer booking requests' 
                : activeTab === 'assigned'
                ? 'View and manage active bookings with assigned workers'
                : 'View all booking orders by users'
              }
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {[
                { label: 'Total Bookings', value: stats.total.toString(), icon: ExternalLink, color: 'text-blue-600' },
                { label: 'Awaiting Workers', value: stats.pending.toString(), icon: Clock, color: 'text-amber-500' },
                { label: 'Ready to Assign', value: stats.confirmed.toString(), icon: CheckCircle, color: 'text-emerald-500' },
                { label: 'Active', value: (stats.assigned + stats.inProgress).toString(), icon: UserCheck, color: 'text-purple-600' },
                { label: 'Completed', value: stats.completed.toString(), icon: CheckCircle, color: 'text-green-600' },
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

        {/* --- TABS --- */}
        <div className="flex flex-col md:flex-row gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-full md:w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Pending Assignments ({stats.pending + stats.confirmed})
          </button>
          <button
            onClick={() => setActiveTab('assigned')}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'assigned'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Active Bookings ({stats.assigned + stats.inProgress})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 md:px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Order History ({bookings.length})
          </button>
        </div>

        {/* --- SEARCH & FILTER --- */}
        <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Booking ID or Customer..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
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
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Booking ID</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Service</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {activeTab === 'history' ? 'Workers' : 'Assigned Workers'}
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">
                    {activeTab === 'history' ? 'Last Updated' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-slate-500">Loading bookings...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center">
                      <div className="text-slate-400">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                          {activeTab === 'pending' ? 'No pending bookings' : activeTab === 'assigned' ? 'No active bookings' : 'No booking orders found'}
                        </p>
                        <p className="text-sm">
                          {activeTab === 'pending' 
                            ? 'Waiting for customer bookings to assign workers' 
                            : activeTab === 'assigned'
                            ? 'No bookings are currently active'
                            : 'No booking orders have been placed yet'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <motion.tr 
                      key={booking.booking_id || booking.id || `booking-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                      className="transition-colors group"
                    >
                        <td className="p-4 font-mono text-sm font-bold text-blue-600">#{booking.booking_id || booking.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">
                            {booking.customer_name || 
                             (booking.customer_first_name && booking.customer_last_name 
                               ? `${booking.customer_first_name} ${booking.customer_last_name}`
                               : booking.customerName || 'N/A')}
                          </p>
                          <p className="text-xs text-slate-400">{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}</p>
                        </td>
                        <td className="p-4 text-slate-600 font-medium">{booking.service_type || booking.service_name || booking.serviceName || 'N/A'}</td>
                        <td className="p-4">
                          <div className="text-sm font-medium text-slate-800">
                            {booking.total_days || 1} day{booking.total_days !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-slate-500">
                            {booking.start_date && booking.end_date ? 
                              `${new Date(booking.start_date).toLocaleDateString()} - ${new Date(booking.end_date).toLocaleDateString()}` 
                              : 'N/A'
                            }
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                            {booking.worker_count || booking.number_of_workers || booking.requiredWorkers || 0} Workers
                          </span>
                          {activeTab !== 'history' && booking.assigned_workers && booking.booking_status === 'assigned' && (
                            <div className="mt-1 text-xs text-slate-500">
                              <div className="font-medium">Assigned Workers:</div>
                              <div className="mt-1">
                                {booking.assigned_workers.split(',').map((worker: string, idx: number) => (
                                  <span key={idx} className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                                    {worker.trim()}
                                  </span>
                                ))}
                              </div>
                              {booking.end_date && (
                                <div className="mt-1 text-xs text-blue-600">
                                  <span className="font-medium">Available again:</span> {new Date(booking.end_date).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                          {activeTab === 'history' && booking.end_date && (
                            <div className="mt-1 text-xs text-slate-500">
                              Completed: {new Date(booking.end_date).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(booking.booking_status || booking.status)}`}>
                            {booking.booking_status || booking.status || 'pending'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {activeTab === 'history' ? (
                            <span className="text-sm text-slate-600">
                              {booking.updated_at ? new Date(booking.updated_at).toLocaleDateString() : 'N/A'}
                            </span>
                          ) : (
                            <div className="flex justify-end gap-2">
                              {(booking.booking_status === 'pending' || booking.booking_status === 'confirmed') && !booking.assigned_workers && (
                                <button
                                  onClick={() => handleAssignWorkers(booking)}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
                                  title="Assign Workers"
                                >
                                  <UserCheck size={14} />
                                  Assign
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- PAGINATION --- */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">Showing 1 to {filteredBookings.length} of {filteredBookings.length} results</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white text-slate-600 hover:bg-slate-100">Next</button>
            </div>
          </div>
        </div>

        {/* --- WORKER ASSIGNMENT MODAL --- */}
        <AnimatePresence>
          {showAssignModal && selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAssignModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Assign Workers</h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {selectedBooking.service_type || selectedBooking.service_name} Service
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X size={20} className="text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Booking Details */}
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-bold text-slate-800 mb-2">Booking Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Customer:</span>
                        <span className="ml-2 font-medium">
                          {selectedBooking.customer_name || 
                           (selectedBooking.customer_first_name && selectedBooking.customer_last_name 
                             ? `${selectedBooking.customer_first_name} ${selectedBooking.customer_last_name}`
                             : 'N/A')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Service:</span>
                        <span className="ml-2 font-medium">{selectedBooking.service_type || selectedBooking.service_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Duration:</span>
                        <span className="ml-2 font-medium">
                          {selectedBooking.total_days || 1} day{selectedBooking.total_days !== 1 ? 's' : ''}
                          {selectedBooking.start_date && selectedBooking.end_date && (
                            <span className="text-xs text-slate-500 block">
                              {new Date(selectedBooking.start_date).toLocaleDateString()} - {new Date(selectedBooking.end_date).toLocaleDateString()}
                            </span>
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Required Workers:</span>
                        <span className="ml-2 font-medium">{selectedBooking.number_of_workers}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Selected:</span>
                        <span className="ml-2 font-medium text-blue-600">{selectedWorkers.length}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Workers Available Again:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {selectedBooking.end_date ? new Date(selectedBooking.end_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Worker Selection */}
                  <div className="mb-6">
                    <h3 className="font-bold text-slate-800 mb-4">
                      Available Workers ({selectedBooking.availableWorkers?.length || 0})
                      {selectedBooking.availableWorkers?.length === workers.length && selectedBooking.availableWorkers?.length > 0 &&
                        <span className="text-xs text-amber-600 ml-2">(showing all workers - none specialize in this service)</span>
                      }
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                      {selectedBooking.availableWorkers && selectedBooking.availableWorkers.length > 0 ? (
                        selectedBooking.availableWorkers.map((worker: any) => (
                          <div
                            key={worker.user_id}
                            onClick={() => handleWorkerSelection(worker.user_id)}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedWorkers.includes(worker.user_id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded border-2 ${
                                selectedWorkers.includes(worker.user_id)
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-slate-300'
                              }`}>
                                {selectedWorkers.includes(worker.user_id) && (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {worker.first_name} {worker.last_name}
                                </p>
                                <p className="text-xs text-slate-500">{worker.email}</p>
                                <p className="text-xs text-slate-400">{worker.service_name}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-8 text-center text-slate-500">
                          <Users size={48} className="mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">No workers available</p>
                          <p className="text-sm">No workers specialize in {selectedBooking.service_type || selectedBooking.service_name}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setShowAssignModal(false)}
                      className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitWorkerAssignment}
                      disabled={assigning || selectedWorkers.length === 0}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                    >
                      {assigning ? 'Assigning...' : `Assign ${selectedWorkers.length} Worker${selectedWorkers.length !== 1 ? 's' : ''}`}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminBookingManager;