import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  Briefcase,
  Calendar,
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react';
import { getAllUsers } from '../../api/userService';
import { getAllBookings } from '../../api/bookingService';
import { getAllServices } from '../../api/serviceService';
import { notify } from '../utils/notify';

interface DashboardStats {
  totalUsers: number;
  totalWorkers: number;
  totalServices: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  pendingFeedbacks: number;
}

interface RecentBooking {
  booking_id: number;
  customer_first_name?: string;
  customer_last_name?: string;
  service_name: string;
  booking_status: string;
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalWorkers: 0,
    totalServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    pendingFeedbacks: 0
  });
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [usersData, bookingsData, servicesData] = await Promise.all([
        getAllUsers(),
        getAllBookings(),
        getAllServices()
      ]);

      const users = usersData.filter(user => user.user_type === 'customer');
      const workers = usersData.filter(user => user.user_type === 'worker');
      const pendingBookings = bookingsData.filter(booking => booking.booking_status === 'pending');
      const completedBookings = bookingsData.filter(booking => booking.booking_status === 'completed');

      // Get recent 5 bookings
      const recent = bookingsData
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalWorkers: workers.length,
        totalServices: servicesData.length,
        totalBookings: bookingsData.length,
        pendingBookings: pendingBookings.length,
        completedBookings: completedBookings.length,
        pendingFeedbacks: 6 // Mocked, as feedback is not in API
      });

      setRecentBookings(recent);
    } catch (error: unknown) {
      const err = error as string;
      if (err.includes('Access denied') || err.includes('Invalid token') || err.includes('Admin access required')) {
        navigate('/login');
      } else {
        notify.error('Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const StatCard = ({ icon: Icon, title, value, color, bgColor }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: number;
    color: string;
    bgColor: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4 md:px-8">
      <div className="max-w-7xl px-4 md:px-10 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your manpower platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Customers"
            value={stats.totalUsers}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={UserCheck}
            title="Total Workers"
            value={stats.totalWorkers}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={Briefcase}
            title="Total Services"
            value={stats.totalServices}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={Calendar}
            title="Total Bookings"
            value={stats.totalBookings}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Clock}
            title="Pending Bookings"
            value={stats.pendingBookings}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed Bookings"
            value={stats.completedBookings}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon={MessageSquare}
            title="Pending Feedbacks"
            value={stats.pendingFeedbacks}
            color="text-pink-600"
            bgColor="bg-pink-50"
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <motion.div
                key={booking.booking_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.customer_first_name || 'Unknown'} {booking.customer_last_name || ''}
                    </p>
                    <p className="text-sm text-gray-600">{booking.service_name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.booking_status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.booking_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {booking.booking_status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Manage Users</span>
            </button>

            <button
              onClick={() => navigate('/admin/workers')}
              className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
            >
              <UserCheck className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Manage Workers</span>
            </button>

            <button
              onClick={() => navigate('/admin/services')}
              className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
            >
              <Briefcase className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Manage Services</span>
            </button>

            <button
              onClick={() => navigate('/admin/feedbacks')}
              className="flex items-center space-x-3 p-4 bg-pink-50 hover:bg-pink-100 rounded-xl transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-pink-600" />
              <span className="font-medium text-pink-900">Manage Feedbacks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;