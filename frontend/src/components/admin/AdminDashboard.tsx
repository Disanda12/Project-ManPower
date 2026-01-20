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
  Settings,
  CheckCircle,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from 'recharts';
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

  const pieData = [
    { name: 'Pending', value: stats.pendingBookings, color: '#60a5fa' },
    { name: 'Completed', value: stats.completedBookings, color: '#1e40af' }
  ];

  const barColors = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa'];
  const chartData = [
    { name: 'Customers', value: stats.totalUsers },
    { name: 'Workers', value: stats.totalWorkers },
    { name: 'Services', value: stats.totalServices },
    { name: 'Bookings', value: stats.totalBookings }
  ];

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

  const StatCard = ({ icon: Icon, title, value, color, bgColor, trend }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: number;
    color: string;
    bgColor: string;
    trend?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} shadow-sm`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-16 sm:pt-20 md:pt-28 pb-8 sm:pb-10 md:pb-20 px-3 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-base sm:text-lg font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-gray-100 pt-[150px] pb-8 sm:pb-10 md:pb-20 px-4 md:px-8">
      <div className="max-w-7xl md:px-10 mx-auto">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800  to-blue-900 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base md:text-lg font-medium">
                Comprehensive overview of your manpower platform
              </p>
            </div>
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              <div className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-slate-700">System Active</span>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500">Last updated</p>
                <p className="text-sm font-medium text-slate-700">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Primary Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={Users}
            title="Total Customers"
            value={stats.totalUsers}
            color="text-blue-900"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
            trend="+12%"
          />
          <StatCard
            icon={UserCheck}
            title="Total Workers"
            value={stats.totalWorkers}
            color="text-blue-900"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
            trend="+8%"
          />
          <StatCard
            icon={Briefcase}
            title="Total Services"
            value={stats.totalServices}
            color="text-blue-900"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
            trend="+15%"
          />
          <StatCard
            icon={Calendar}
            title="Total Bookings"
            value={stats.totalBookings}
            color="text-blue-900"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
            trend="+23%"
          />
        </motion.div>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          <StatCard
            icon={Clock}
            title="Pending Bookings"
            value={stats.pendingBookings}
            color="text-blue-900"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed Bookings"
            value={stats.completedBookings}
            color="text-blue-900"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
          />
          <StatCard
            icon={MessageSquare}
            title="Pending Feedbacks"
            value={stats.pendingFeedbacks}
            color="text-blue-900"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-200"
          />
        </motion.div>

        {/* Analytics Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Overview Chart - Desktop */}
          <motion.div
            className="hidden lg:block lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Platform Overview</h3>
                <p className="text-sm text-slate-600">Key metrics at a glance</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Overview Chart - Mobile Cards */}
          <motion.div
            className="lg:hidden bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Platform Overview</h3>
                <p className="text-xs sm:text-sm text-slate-600">Key metrics breakdown</p>
              </div>
            </div>
            <div className="space-y-3">
              {chartData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: barColors[index] }}
                    ></div>
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking Status Chart - Desktop */}
          <motion.div
            className="hidden lg:block bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Booking Status</h3>
                <p className="text-sm text-slate-600">Completion rates</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                      {entry.payload.name}: {entry.payload.value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Booking Status Chart - Mobile Cards */}
          <motion.div
            className="lg:hidden bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Booking Status</h3>
                <p className="text-xs sm:text-sm text-slate-600">Completion breakdown</p>
              </div>
            </div>
            <div className="space-y-3">
              {pieData.map((item, index) => {
                const total = pieData.reduce((sum, data) => sum + data.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                return (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">{item.value}</span>
                      <span className="text-xs text-slate-500 ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-900" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
                <p className="text-sm text-slate-600">Latest booking activities</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <span>View All</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking, index) => (
              <motion.div
                key={booking.booking_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200/50 hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-900" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 text-sm sm:text-base">
                        {booking.customer_first_name || 'Unknown'} {booking.customer_last_name || ''}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">{booking.service_name}</p>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 sm:flex-shrink-0">
                    <span className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      booking.booking_status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : booking.booking_status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                    </span>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-500">Booked on</p>
                      <p className="text-xs sm:text-sm font-medium text-slate-700">
                        {new Date(booking.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-900" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
              <p className="text-sm text-slate-600">Manage your platform efficiently</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                icon: Users,
                label: 'Manage Users',
                path: '/admin/users',
                color: 'white',
                description: 'View and manage customer accounts'
              },
              {
                icon: UserCheck,
                label: 'Manage Workers',
                path: '/admin/workers',
                color: 'white',
                description: 'Oversee worker profiles and availability'
              },
              {
                icon: Calendar,
                label: 'Manage Bookings',
                path: '/admin/bookings',
                color: 'white',
                description: 'Handle booking requests and schedules'
              },
              {
                icon: Briefcase,
                label: 'Manage Services',
                path: '/admin/services',
                color: 'white',
                description: 'Configure available services'
              },
              {
                icon: MessageSquare,
                label: 'Manage Feedbacks',
                path: '/admin/feedbacks',
                color: 'white',
                description: 'Review and respond to feedback'
              }
            ].map((action, index) => (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className={`group p-3 sm:p-4 bg-gradient-to-br from-${action.color}-50 to-${action.color}-100 hover:from-${action.color}-100 hover:to-${action.color}-200 rounded-xl border border-${action.color}-200/50 hover:border-${action.color}-300 hover:shadow-lg transition-all duration-200 text-left min-h-[80px] sm:min-h-[88px]`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-blue-100 rounded-lg group-hover:bg-${action.color}-200 transition-colors flex-shrink-0`}>
                    <action.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-900`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold text-${action.color}-900 text-sm sm:text-base`}>{action.label}</h4>
                    <p className={`text-xs text-${action.color}-700 mt-1 leading-tight`}>{action.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;