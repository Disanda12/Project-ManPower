import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Target, Award, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const values = [
    {
      icon: ShieldCheck,
      title: "Rigorous Vetting",
      description: "Every professional undergoes a manual background check and skill verification by our admin team before joining."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We focus on local talent, ensuring that our masons, carpenters, and helpers are members of the communities they serve."
    },
    {
      icon: Target,
      title: "Quality Driven",
      description: "Our goal is to provide reliable, high-quality labor solutions that homeowners and contractors can trust implicitly."
    }
  ];

  return (
    <div className="bg-white">
      {/* 1. Page Header / Hero Area */}
      <section className="relative bg-[#00467f] py-24 overflow-hidden pt-64">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            {...fadeIn}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Redefining Local Professional Services
          </motion.h1>
          <motion.p 
            {...fadeIn}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            We bridge the gap between skilled tradespeople and the projects that need them, 
            built on a foundation of trust, verification, and local excellence.
          </motion.p>
        </div>
      </section>

      {/* 2. Our Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Founded to solve the challenge of finding reliable manual labor, ServiceConnect has grown into a premier marketplace for vetted tradespeople. We believe that finding a mason or a carpenter should be as easy and safe as ordering a meal.
            </p>
            <div className="space-y-4">
              {['100% Admin-Vetted Professionals', 'Transparent Rating Systems', 'Fair Pricing for Skilled Labor'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-[#00467f] font-semibold">
                  <CheckCircle2 size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            {...fadeIn}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800" 
              alt="Professional Carpenter working" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">The Values That Guide Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-50 text-[#00467f] rounded-lg flex items-center justify-center mb-6">
                  <value.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Impact Statistics (Re-using some logic from your StatsSection) */}
      <section className="py-20 text-center max-w-5xl mx-auto px-4">
        <motion.div {...fadeIn}>
          <Award size={48} className="text-[#00467f] mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Empowering Local Economies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-b border-gray-100 py-12">
            <div>
              <div className="text-4xl font-bold text-[#00467f]">98%</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-2">Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00467f]">24hr</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-2">Admin Review</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00467f]">15k+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-2">Completed Tasks</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00467f]">50+</div>
              <div className="text-sm text-gray-500 uppercase tracking-widest mt-2">Service Types</div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;