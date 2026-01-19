import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  ChevronDown,
  History,
  LogOut,
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  Search,
  Bell,
  MessageSquare
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { getUserNotifications } from "../../api/notificationService";

const NavigationBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const getAvatarColor = (name: string) => {
    const colors = ["bg-blue-600", "bg-indigo-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600"];
    const index = name.length % colors.length;
    return colors[index];
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role") || "");
      setUserName(localStorage.getItem("userName") || "User");
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isLoggedIn) {
        try {
          const notifications = await getUserNotifications();
          const unread = notifications.filter(n => !n.is_read).length;
          setUnreadNotifications(unread);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      }
    };
    fetchUnreadCount();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
    window.dispatchEvent(new Event("storage"));
  };

  const isActive = (path: string) => location.pathname === path;

  // Corrected Paths for Nav Items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Industries", path: "/industries" },
    { name: "Contact", path: "/contact-us" }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-white py-4"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          
          {/* BRAND */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-[#00467f] rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <Briefcase className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#00467f]">MANPOWER</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
            {navItems.map((link) => (
              <Link key={link.path} to={link.path} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isActive(link.path) ? "bg-white text-[#00467f] shadow-sm" : "text-gray-500 hover:text-[#00467f]"}`}>
                {link.name}
              </Link>
            ))}

            <div className="relative" onMouseEnter={() => setActiveDropdown('services')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className={`flex items-center space-x-1 px-5 py-2 text-sm font-bold transition-colors ${activeDropdown === 'services' ? "text-[#00467f]" : "text-gray-500 hover:text-[#00467f]"}`}>
                <span>Services</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'services' ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-1/2 -translate-x-1/2 pt-4 w-72">
                    <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 overflow-hidden">
                      <ServiceLink icon={<Search size={18}/>} title="Find a Worker" desc="Browse our skilled workforce" onClick={() => navigate("/booking")} />
                      <ServiceLink icon={<History size={18}/>} title="Booking History" desc="Track your previous orders" onClick={() => navigate("/customer-bookings")} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* USER SECTION (DESKTOP) */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 bg-gray-50 rounded-full hover:bg-white hover:shadow-md transition-all border border-gray-100"
                  >
                    <Bell size={18} className="text-gray-600" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown
                    isOpen={notificationsOpen}
                    onClose={() => setNotificationsOpen(false)}
                    onUnreadCountChange={setUnreadNotifications}
                  />
                </div>

                <div className="relative" onMouseEnter={() => setActiveDropdown('account')} onMouseLeave={() => setActiveDropdown(null)}>
                <button className="flex items-center space-x-3 p-1 pr-4 bg-gray-50 rounded-full hover:bg-white hover:shadow-md transition-all border border-gray-100 group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shadow-inner ${getAvatarColor(userName)}`}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[13px] font-black text-gray-800 leading-none mb-1 truncate max-w-[100px]">{userName}</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-1.5 rounded">{userRole}</span>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${activeDropdown === 'account' ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'account' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="absolute right-0 pt-4 w-64">
                      <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-3">
                        <div className="flex items-center space-x-3 p-3 mb-2 bg-gray-50 rounded-xl">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg ${getAvatarColor(userName)}`}>
                              {userName.charAt(0).toUpperCase()}
                           </div>
                           <div className="overflow-hidden">
                              <p className="text-sm font-black text-gray-800 truncate">{userName}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{userRole}</p>
                           </div>
                        </div>
                        {userRole !== 'admin' && <AccountLink icon={<User size={16}/>} label="My Profile" to="/profile" />}
                        {userRole === 'admin' && <AccountLink icon={<History size={16}/>} label="My Bookings" to="/booking-history" />}
                        {userRole === 'admin' && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4 mb-2">Admin Tools</p>
                            <AccountLink icon={<LayoutDashboard size={16}/>} label="Admin Dashboard" to="/admin" primary />
                            <AccountLink icon={<Calendar size={16}/>} label="Manage Bookings" to="/admin/bookings" />
                            <AccountLink icon={<Users size={16}/>} label="User Management" to="/admin/users" />
                            <AccountLink icon={<User size={16}/>} label="Worker Management" to="/admin/workers" />
                            <AccountLink icon={<Briefcase size={16}/>} label="Service Management" to="/admin/services" />
                            <AccountLink icon={<MessageSquare size={16}/>} label="Manage Feedbacks" to="/admin/feedbacks" />
                          </div>
                        )}
                        <div className="h-px bg-gray-100 my-2" />
                        <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-sm">
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </>
            ) : (
              <Link to="/login" className="px-8 py-3 bg-[#00467f] text-white rounded-full font-bold text-sm hover:bg-[#003560] transition-colors">Sign In</Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button className="lg:hidden p-2 text-gray-900 bg-gray-50 rounded-xl border border-gray-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween" }} className="lg:hidden bg-white fixed inset-0 z-40 px-6 py-20 overflow-y-auto">
             <button className="absolute top-6 right-6 p-2 bg-gray-50 rounded-xl" onClick={() => {setMobileMenuOpen(false); setMobileServicesOpen(false)}}>
                <X size={24} />
             </button>

             <div className="space-y-8">
                {/* 1. Corrected Navigation Links */}
                <div className="grid grid-cols-2 gap-3">
                    {navItems.map(item => (
                        <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} className="p-4 bg-gray-50 rounded-xl text-center font-bold text-gray-800 border border-gray-100">{item.name}</Link>
                    ))}
                </div>

                {/* 2. Services Section */}
                <div className="space-y-2">
                  <button 
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between p-4 bg-gray-100/50 rounded-xl font-bold text-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <Briefcase size={20} className="text-[#00467f]" />
                      <span>Our Services</span>
                    </div>
                    <ChevronDown className={`transition-transform duration-300 ${mobileServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
                        <MobileLink icon={<Search />} label="Find a Worker" to="/booking" onClick={() => setMobileMenuOpen(false)} />
                        <MobileLink icon={<History />} label="Booking History" to="/customer-bookings" onClick={() => setMobileMenuOpen(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Account Actions */}
                {isLoggedIn && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Personal Account</p>
                    <div className="space-y-2">
                        {userRole !== 'admin' && (
                            <MobileLink icon={<User />} label="My Profile" to="/profile" onClick={() => setMobileMenuOpen(false)} />
                        )}
                        {userRole === 'admin' && (
                            <MobileLink icon={<History />} label="My Bookings" to="/booking-history" onClick={() => setMobileMenuOpen(false)} />
                        )}
                    </div>
                  </div>
                )}
                
                {/* 4. Admin Tools (Full Desktop Mirror) */}
                {isLoggedIn && userRole === 'admin' && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">Administration Tools</p>
                    <div className="grid grid-cols-1 gap-2">
                       <MobileLink icon={<LayoutDashboard />} label="Admin Dashboard" to="/admin" onClick={() => setMobileMenuOpen(false)} blue />
                       <MobileLink icon={<Calendar />} label="Manage Bookings" to="/admin/bookings" onClick={() => setMobileMenuOpen(false)} />
                       <MobileLink icon={<Users />} label="User Management" to="/admin/users" onClick={() => setMobileMenuOpen(false)} />
                       <MobileLink icon={<User />} label="Worker Management" to="/admin/workers" onClick={() => setMobileMenuOpen(false)} />
                       <MobileLink icon={<Briefcase />} label="Service Management" to="/admin/services" onClick={() => setMobileMenuOpen(false)} />
                    </div>
                  </div>
                )}

                {/* 5. Logout */}
                {isLoggedIn && (
                  <div className="pt-6 border-t border-gray-100">
                      <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-500 rounded-xl font-bold text-lg flex items-center justify-center space-x-2">
                          <LogOut size={20} />
                          <span>Log Out</span>
                      </button>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Sub-components ---
const ServiceLink = ({ icon, title, desc, onClick }: any) => (
  <button onClick={onClick} className="flex items-start space-x-4 p-3 w-full text-left hover:bg-blue-50 rounded-xl transition-all group">
    <div className="p-2.5 bg-gray-50 text-[#00467f] rounded-lg group-hover:bg-[#00467f] group-hover:text-white transition-all">{icon}</div>
    <div>
      <p className="text-sm font-black text-gray-800 leading-tight">{title}</p>
      <p className="text-[10px] text-gray-400 font-bold mt-1">{desc}</p>
    </div>
  </button>
);

const AccountLink = ({ icon, label, to, primary }: any) => (
  <Link to={to} className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all text-sm font-bold mb-1 ${primary ? "bg-[#00467f] text-white hover:bg-blue-800" : "text-gray-600 hover:bg-gray-50"}`}>
    <span className={primary ? "text-white" : "text-gray-400"}>{icon}</span>
    <span>{label}</span>
  </Link>
);

const MobileLink = ({ icon, label, to, onClick, blue }: any) => (
    <Link to={to} onClick={onClick} className={`flex items-center space-x-4 p-4 rounded-xl font-bold transition-all ${blue ? "bg-[#00467f] text-white shadow-lg shadow-blue-900/20" : "bg-gray-50 text-gray-700 border border-gray-100"}`}>
        <span className={blue ? "text-white" : "text-gray-400"}>{icon}</span>
        <span>{label}</span>
    </Link>
);

export default NavigationBar;