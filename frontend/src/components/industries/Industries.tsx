import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2,
  Construction
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAvailableServices, Service } from '../../api/serviceService';
import { notify } from '../utils/notify';

const IndustriesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchAvailableServices();
        setServices(data);
      } catch (err) {
        notify.error("Error loading services");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION (Search Removed) --- */}
      <section className="bg-[#00467f] pt-48 pb-32 px-4 relative overflow-hidden">
        {/* Subtle Background Icon Pattern */}
        <Construction className="absolute -right-20 -bottom-20 text-white/5 w-96 h-96 -rotate-12" />
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
              Industries We <span className="text-blue-300">Serve</span>
            </h1>
            <p className="text-blue-100 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
              Explore our comprehensive range of specialized manpower categories, 
              each backed by verified professionals ready for your next project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- DYNAMIC GRID --- */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#00467f] mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Synchronizing Services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((service, index) => (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/booking?service=${service.service_name}`)}
                className="group flex flex-col bg-white rounded-[2rem] border border-gray-100 p-10 hover:shadow-[0_30px_60px_-15px_rgba(0,70,127,0.12)] transition-all duration-500 cursor-pointer relative"
              >
                {/* Status Indicator */}
                <div className="flex items-center space-x-2 mb-6">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Trade</span>
                </div>

                <div className="w-14 h-14 bg-blue-50 text-[#00467f] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#00467f] group-hover:text-white transition-all duration-500">
                  <ShieldCheck size={30} />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#00467f] transition-colors">
                  {service.service_name}
                </h3>
                
                {/* --- BACKEND DESCRIPTION --- */}
                <div className="min-h-[80px]">
                    <p className="text-gray-500 leading-relaxed font-medium line-clamp-4 group-hover:text-gray-700 transition-colors">
                      {service.description}
                    </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex items-center text-[#00467f] font-bold text-sm">
                  <span>Start Booking</span>
                  <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-3 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* --- CTA --- */}
      <section className="pb-24 px-4">
        <div className="max-w-6xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Looking for a specific skill set?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Our network covers more than just these categories. Contact our support team for specialized, large-scale, or custom project requirements.
            </p>
            <div className="flex justify-center">
                <Link to="/contact-us">
                    <button className="bg-white text-gray-900 px-12 py-5 rounded-full font-black text-lg hover:bg-blue-50 hover:scale-105 transition-all active:scale-95 shadow-xl">
                        Contact Support Team
                    </button>
                </Link>
            </div>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </section>
    </div>
  );
};

export default IndustriesPage;