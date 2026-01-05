import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrickWall, Hammer, Sparkles, Truck, 
  Users, Droplets, Zap, Paintbrush, 
  ArrowRight, Search 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const industries = [
  { icon: BrickWall, name: 'Masonry', providers: '450+', color: 'bg-orange-50 text-orange-700', description: 'Expert brickwork, stone setting, and concrete finishing.' },
  { icon: Hammer, name: 'Carpentry', providers: '380+', color: 'bg-blue-50 text-[#00467f]', description: 'Custom woodwork, framing, and furniture assembly.' },
  { icon: Sparkles, name: 'Maids & Cleaning', providers: '1,200+', color: 'bg-cyan-50 text-cyan-700', description: 'Professional residential and commercial cleaning services.' },
  { icon: Truck, name: 'Movers', providers: '290+', color: 'bg-indigo-50 text-indigo-700', description: 'Safe and efficient furniture moving and logistics.' },
  { icon: Users, name: 'General Helpers', providers: '2,100+', color: 'bg-emerald-50 text-emerald-700', description: 'Reliable extra hands for loading, yard work, and events.' },
  { icon: Droplets, name: 'Plumbing', providers: '540+', color: 'bg-blue-50 text-blue-600', description: 'Fixing leaks, installations, and emergency pipe repairs.' },
  { icon: Zap, name: 'Electricians', providers: '410+', color: 'bg-yellow-50 text-yellow-700', description: 'Wiring, lighting installation, and electrical safety checks.' },
  { icon: Paintbrush, name: 'Painters', providers: '320+', color: 'bg-rose-50 text-rose-700', description: 'Interior and exterior painting with precision finish.' },
];

const IndustriesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="bg-[#00467f] pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Industries We <span className="text-blue-300">Serve</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg max-w-2xl mx-auto mb-10"
          >
            Connecting you with vetted professionals across diverse trades. From construction to cleaning, we have the right talent for your needs.
          </motion.p>
          
          {/* Search Bar Decoration */}
          <div className="max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search for a service..." 
              className="w-full py-4 px-6 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
            />
            <Search className="absolute right-5 top-4 text-blue-200" size={24} />
          </div>
        </div>
      </section>

      {/* --- INDUSTRIES GRID --- */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative Circle */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${item.color.split(' ')[0]}`}></div>

              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                <item.icon size={32} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-[#00467f] uppercase tracking-wider">
                  {item.providers} Verified Pros
                </span>
                {/* <Link to="/booking" className="text-gray-300 group-hover:text-[#00467f] transition-colors">
                  <ArrowRight size={20} />
                </Link> */}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto bg-[#00467f] rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Can't find what you're looking for?</h2>
            <p className="text-blue-100 mb-8">We are constantly expanding our network. Contact us for custom staffing solutions.</p>
            <Link to="/contact-us">
                <button className="bg-white text-[#00467f] px-10 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                  Contact Support
                </button>
            </Link>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        </div>
      </section>
    </div>
  );
};

export default IndustriesPage;