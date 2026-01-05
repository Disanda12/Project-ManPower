import { motion } from 'framer-motion';
import { 
  Hammer, 
  BrickWall, 
  Sparkles, 
  Truck, 
  Users, 
  Droplets, 
  Zap, 
  Paintbrush 
} from 'lucide-react';

const services = [
  { icon: BrickWall, name: 'Masonry', providers: '450+', color: 'bg-orange-50 text-orange-700' },
  { icon: Hammer, name: 'Carpentry', providers: '380+', color: 'bg-blue-50 text-[#00467f]' },
  { icon: Sparkles, name: 'Maids & Cleaning', providers: '1,200+', color: 'bg-cyan-50 text-cyan-700' },
  { icon: Truck, name: 'Movers', providers: '290+', color: 'bg-indigo-50 text-indigo-700' },
  { icon: Users, name: 'General Helpers', providers: '2,100+', color: 'bg-emerald-50 text-emerald-700' },
  { icon: Droplets, name: 'Plumbing', providers: '540+', color: 'bg-blue-50 text-blue-600' },
  { icon: Zap, name: 'Electricians', providers: '410+', color: 'bg-yellow-50 text-yellow-700' },
  { icon: Paintbrush, name: 'Painters', providers: '320+', color: 'bg-rose-50 text-rose-700' },
];

const IndustryGrid = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Specialized Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with vetted, high-quality professionals across essential trades and services.
          </p>
        </motion.div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }}
                className="bg-white border border-gray-100 rounded-xl p-8 transition-all cursor-pointer group text-center"
              >
                <div className={`${service.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={36} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-[#00467f] font-semibold bg-blue-50 inline-block px-3 py-1 rounded-full">
                  {service.providers} Verified Pros
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button className="text-[#00467f] font-bold text-lg hover:underline flex items-center justify-center mx-auto gap-2">
            View All Specialized Trades 
            <span className="text-xl">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustryGrid;