import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAvailableServices, Service } from '../../../api/serviceService';
import { notify } from '../../utils/notify';

const IndustryGrid = () => {
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

  // Limit display to the first 8 services for the homepage grid
  const featuredServices = services.slice(0, 8);

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[#00467f] font-black uppercase tracking-[0.2em] text-sm mb-4 block">
            Our Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Professional Solutions <br/> 
            <span className="text-[#00467f]">For Every Industry</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#00467f] mx-auto rounded-full" />
        </motion.div>

        {/* Grid Section */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/booking?service=${service.service_name}`)}
                className="group relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out -z-0" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00467f] to-[#0073b1] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20 group-hover:rotate-6 transition-transform">
                    <ShieldCheck className="text-white" size={32} />
                  </div>
                  
                  <h3 className="font-black text-xl text-gray-800 mb-3 group-hover:text-[#00467f] transition-colors line-clamp-1">
                    {service.service_name}
                  </h3>
                  
                  <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-[#00467f] transition-colors">
                    <span>Book Now</span>
                    <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <button 
            onClick={() => navigate('/industries')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#00467f] text-white rounded-full font-bold hover:bg-[#003560] transition-all shadow-xl hover:shadow-blue-900/30"
          >
            Explore All Services
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustryGrid;