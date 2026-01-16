import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const EnterpriseHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-[#00467f] via-[#005a9c] to-[#0073b1] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image - Kept as requested */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Refactored Heading */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
            Find the Right Professional
            <br />
            <span className="text-blue-200">For Your Home & Project</span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Connect with verified masons, carpenters, and helpers in your area. 
            Quality work, vetted and managed by our professional administration.
          </p>

          {/* New CTA Buttons replacing the Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => navigate('/booking')}
              className="px-10 py-5 bg-white text-[#00467f] rounded-full font-black text-lg shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1"
            >
              Book a Service
            </button>
            <button
              onClick={() => navigate('/about-us')}
              className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-black text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Learn More
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Bottom Glow Decor */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#00467f]/50 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default EnterpriseHero;