import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Logic for admin to receive this basic info
    console.log('Contact Form Submitted:', formData);
    alert('Thank you! Our admin team will contact you shortly.');
  };

  const contactDetails = [
    { 
      icon: Phone, 
      title: 'Call Us', 
      detail: '+94 11 234 5678', 
      sub: 'Mon-Fri from 8am to 5pm' 
    },
    { 
      icon: Mail, 
      title: 'Email Support', 
      detail: 'support@serviceconnect.lk', 
      sub: 'Online support 24/7' 
    },
    { 
      icon: MapPin, 
      title: 'Main Office', 
      detail: 'No. 123, Galle Road, Colombo 03', 
      sub: 'Sri Lanka' 
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-[#00467f] py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Get in Touch
          </motion.h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Have a question about our vetting process or need help finding a professional? 
            Our team is here to help you.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Side: Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactDetails.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start gap-4"
              >
                <div className="bg-blue-50 p-3 rounded-lg text-[#00467f]">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-[#00467f] font-medium">{item.detail}</p>
                  <p className="text-sm text-gray-500">{item.sub}</p>
                </div>
              </motion.div>
            ))}

            <div className="bg-slate-900 p-8 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Clock size={20} />
                <span className="font-semibold uppercase text-xs tracking-widest">Response Time</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Admin Quick Review</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our administrators review all inquiries within 2 hours during business hours to ensure quality service.
              </p>
            </div>
          </div>

          {/* Right Side: Advanced Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-gray-50"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00467f] focus:border-transparent outline-none transition-all"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00467f] focus:border-transparent outline-none transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00467f] focus:border-transparent outline-none transition-all"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Service Needed</label>
                    <select 
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00467f] focus:border-transparent outline-none transition-all"
                      onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    >
                      <option>General Inquiry</option>
                      <option>Masonry / Brickwork</option>
                      <option>Carpentry</option>
                      <option>Cleaning Services</option>
                      <option>Moving Help</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                  <textarea 
                  rows={5}
                    required
                    placeholder="Tell us more about what you need..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00467f] focus:border-transparent outline-none transition-all resize-none"
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#00467f] text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-[#003560] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactUs;