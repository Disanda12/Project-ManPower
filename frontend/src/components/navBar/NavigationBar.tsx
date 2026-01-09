import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  ChevronDown,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const navigate = useNavigate();

  // Logic: Check if logged in and redirect accordingly

 const handleJobSeekerClick = (e: React.MouseEvent) => {
  e.preventDefault();
  const isLoggedIn = localStorage.getItem("token");

  if (isLoggedIn) {
    navigate("/booking");
  } else {
    // Pass the path as a string in the state object
    navigate("/login", { state: { from: "/booking" } });
  }
};
  const handleOrderHistoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("token");

    if (isLoggedIn) {
      navigate("/booking-history");
    } else {
      // We tell the login page: "After success, go to /booking"
      navigate("/login", { state: { from: "/booking-history" } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Changed from 'userToken'
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/");
    window.dispatchEvent(new Event("storage")); // Trigger sync
  };

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="hidden md:flex space-x-6 text-gray-600">
              <a href="#" className="hover:text-[#00467f] transition-colors">
                Global Locations
              </a>
              <a
                href="/about-us"
                className="hover:text-[#00467f] transition-colors"
              >
                About Us
              </a>
              <a
                href="/contact-us"
                className="hover:text-[#00467f] transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                /* 1. DISPLAYED IF LOGGED IN: My Account Dropdown */
                <div
                  className="relative py-2"
                  onMouseEnter={() => setIsAccountOpen(true)}
                  onMouseLeave={() => setIsAccountOpen(false)}
                >
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-[#00467f] transition-colors font-medium outline-none">
                    <User size={16} />
                    <span>My Account</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isAccountOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isAccountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 pt-2 w-48 z-20"
                      >
                        <div className="bg-white border border-gray-200 shadow-xl rounded-lg py-2">
                          <Link
                            to="/booking-history"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#00467f] transition-colors"
                          >
                            <History size={16} />
                            <span>Order History</span>
                          </Link>
                          {userRole === 'admin' && (
                            <>
                              <Link
                                to="/admin/bookings"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#00467f] transition-colors"
                              >
                                <Settings size={16} />
                                <span>Manage Bookings</span>
                              </Link>
                              <Link
                                to="/admin/users"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#00467f] transition-colors"
                              >
                                <User size={16} />
                                <span>User Management</span>
                              </Link>
                              <Link
                                to="/admin/workers"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#00467f] transition-colors"
                              >
                                <User size={16} />
                                <span>Worker Management</span>
                              </Link>
                            </>
                          )}
                          <Link
                            to="/settings"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#00467f] transition-colors"
                          >
                            <Settings size={16} />
                            <span>Settings</span>
                          </Link>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                          >
                            <LogOut size={16} />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* 2. DISPLAYED IF NOT LOGGED IN: Simple Login Link */
                <Link
                  to="/login"
                  state={{ from: window.location.pathname }}
                  className="flex items-center space-x-1 text-gray-600 hover:text-[#00467f] transition-colors font-medium"
                >
                  <User size={16} /> {/* The User icon is back */}
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="cursor-pointer">
                <motion.div
                  className="text-3xl font-bold text-[#00467f]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  MANPOWER
                </motion.div>
              </Link>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <a
                href="/"
                className="block text-gray-700 hover:text-[#00467f] font-medium"
              >
                Home
              </a>
              <button
                onClick={handleJobSeekerClick}
                className="text-gray-700 hover:text-[#00467f] font-medium transition-colors outline-none"
              >
                Find a Worker
              </button>
              <button
                onClick={handleOrderHistoryClick}
                className="text-gray-700 hover:text-[#00467f] font-medium transition-colors"
              >
                Booking History
              </button>
              {/* <a
                href="#"
                className="text-gray-700 hover:text-[#00467f] font-medium transition-colors"
              >
                Specialized Staffing
              </a> */}
              <a
                href="/industries"
                className="text-gray-700 hover:text-[#00467f] font-medium transition-colors"
              >
                Industries
              </a>
              {/* <a
                href="#"
                className="text-gray-700 hover:text-[#00467f] font-medium transition-colors"
              >
                Resources
              </a> */}
            </div>

            <button
              className="lg:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-6 space-y-4">
            <a
              href="/"
              className="block text-gray-700 hover:text-[#00467f] font-medium"
            >
              Home
            </a>
            <button
              onClick={handleJobSeekerClick}
              className="block w-full text-left text-gray-700 hover:text-[#00467f] font-medium"
            >
              Job Seekers
            </button>
            <a
              href="#"
              className="block text-gray-700 hover:text-[#00467f] font-medium"
            >
              For Employers
            </a>
            <div className="border-t border-gray-100 pt-4">
              <Link
                to="/booking-history"
                className="block text-gray-700 hover:text-[#00467f] font-medium py-2"
              >
                Order History
              </Link>
              {userRole === 'admin' && (
                <>
                  <Link
                    to="/admin/bookings"
                    className="block text-gray-700 hover:text-[#00467f] font-medium py-2"
                  >
                    Manage Bookings
                  </Link>
                  <Link
                    to="/admin/users"
                    className="block text-gray-700 hover:text-[#00467f] font-medium py-2"
                  >
                    User Management
                  </Link>
                </>
              )}

              {/* UPDATED: Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="block text-red-600 font-medium py-2 w-full text-left"
              >
                Log Out
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default NavigationBar;
