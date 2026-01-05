import { motion } from 'framer-motion';
import { UserCheck, MapPinned, Star, ShieldCheck } from 'lucide-react';

const stats = [
  {
    icon: UserCheck,
    value: '15,000+',
    label: 'Verified Professionals',
    description: 'Skilled in over 50+ trades'
  },
  {
    icon: MapPinned,
    value: '120+',
    label: 'Service Areas',
    description: 'Across the local region'
  },
  {
    icon: Star,
    value: '4.8/5',
    label: 'Customer Rating',
    description: 'Based on verified reviews'
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: 'Secure Process',
    description: 'Vetted and background checked'
  }
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#00467f] to-[#00335d] relative overflow-hidden">
      {/* Subtile background pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Quality You Can Trust</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our platform ensures every mason, carpenter, and helper meets rigorous standards of excellence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl mb-6 transition-colors group-hover:bg-white/20"
                >
                  <Icon size={40} className="text-white" />
                </motion.div>
                <div className="text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-xl font-semibold text-blue-100 mb-2">{stat.label}</div>
                <div className="text-blue-200/80 font-medium">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join the community of homeowners and contractors who rely on our platform for professional labor solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#00467f] px-10 py-4 rounded-md font-bold text-lg hover:bg-blue-50 transition-shadow shadow-xl"
            >
              Find a Professional
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-md font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Our Vetting Process
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;