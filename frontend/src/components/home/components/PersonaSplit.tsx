import { motion } from 'framer-motion';
import { Hammer, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PersonaSplit = () => {
 
  const [isLoggedIn, setIsLoggedIn] = useState<string | null>(localStorage.getItem("userToken"));
  useEffect(() => {
    // 2. Create a function to check the storage
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      setIsLoggedIn(token);
    };

    // 3. Listen for the 'storage' event (for changes in other tabs)
    window.addEventListener('storage', checkAuth);

    // 4. Set up an interval to check frequently (since localStorage isn't reactive in one tab)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row items-stretch"
      >
        {/* LEFT SIDE: IMAGE & ICON (40% width on desktop) */}
        <div className="relative w-full md:w-2/5 min-h-[300px] bg-[#00467f]">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800')] 
            bg-cover bg-center mix-blend-overlay opacity-60 group-hover:scale-110 transition-transform duration-700"
          ></div>
          
          {/* Overlay Gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00467f] via-transparent to-transparent"></div>

          <div className="relative h-full flex flex-col items-center justify-center p-8 text-white text-center">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="bg-white/20 backdrop-blur-lg p-5 rounded-2xl border border-white/30 mb-4"
            >
              <Hammer size={48} className="text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold">Trusted Trades</h3>
            <p className="text-blue-100 text-sm mt-2">Verified Skillsets & Equipment</p>
          </div>
        </div>

        {/* RIGHT SIDE: CONTENT (60% width on desktop) */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-blue-100 text-[#00467f] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Customer Portal
             </span>
          </div>
          
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Need a <span className="text-[#00467f]">Professional</span> for your project?
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Stop searching and start building. Connect with vetted masons, carpenters, and movers ready to start immediately.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <p className="font-bold text-gray-900 leading-none">Vetted</p>
                    <p className="text-xs text-gray-500">Pros Only</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-[#00467f]">
                    <Clock size={20} />
                </div>
                <div>
                    <p className="font-bold text-gray-900 leading-none">24/7</p>
                    <p className="text-xs text-gray-500">Availability</p>
                </div>
            </div>
          </div>

         {isLoggedIn && (
        <Link to="/booking" className="w-full md:w-max">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-[#00467f] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#003560] transition-all flex items-center justify-center gap-3 w-full md:w-max shadow-xl shadow-blue-900/20"
          >
            Find a Worker
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      )}
        </div>
      </motion.div>
    </div>
  );
};

export default PersonaSplit;