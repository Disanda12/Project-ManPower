import { motion } from 'framer-motion';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Globe, MapPin } from 'lucide-react';

const footerSections = [
  {
    title: 'Find Services',
    links: ['Search Professionals', 'Masonry Services', 'Carpentry & Woodwork', 'Maid & Cleaning', 'Movers & Packers', 'General Helpers']
  },
  {
    title: 'For Professionals',
    links: ['Apply to Join', 'Worker Dashboard', 'Safety Standards', 'Payment Info', 'Pro Resources', 'Vetting Process']
  },
  {
    title: 'Our Regions',
    links: ['Colombo', 'Kandy', 'Galle', 'Gampaha', 'Negombo', 'All Locations']
  },
  {
    title: 'Company',
    links: ['How it Works', 'About Us', 'Success Stories', 'Support Center', 'Contact Us', 'Admin Portal']
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'Worker Guidelines', 'Customer Refund Policy', 'Cookie Policy']
  }
];

const GlobalFooter = () => {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Grid Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-white font-bold text-base mb-4 uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-blue-400 transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Mid-Section: Socials and Location */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="border-t border-gray-800 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-white font-semibold text-lg mb-4">Connect With Our Community</h3>
              <div className="flex gap-4">
                {[
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Twitter, label: 'Twitter' },
                  { Icon: Linkedin, label: 'LinkedIn' },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Youtube, label: 'YouTube' }
                ].map(({ Icon, label }) => (
                  <motion.a
                    key={label}
                    href="#"
                    whileHover={{ scale: 1.1, backgroundColor: '#00467f' }}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center transition-all"
                    aria-label={label}
                  >
                    <Icon size={18} className="text-gray-300" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3">
              <h3 className="text-white font-semibold text-lg">Change Your Service Region</h3>
              <button className="flex items-center gap-2 bg-gray-800 px-6 py-2.5 rounded-md hover:bg-gray-700 transition-colors border border-gray-700">
                <MapPin size={18} className="text-blue-400" />
                <span className="text-sm">Current: Western Province</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar: Copyright and Policy */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-gray-500">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <p>&copy; {new Date().getFullYear()} ServiceConnect Portal. All rights reserved.</p>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Safety</a>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Admin Approved Professionals Only</span>
            </div>
          </div>

          <div className="mt-8 text-[10px] text-gray-600 text-center leading-relaxed max-w-4xl mx-auto uppercase tracking-widest">
            <p>
              This portal acts as a bridge between service seekers and independent contractors. 
              All workers are required to undergo a manual background check by our administration 
              before being listed on our marketplace to ensure maximum quality and safety.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default GlobalFooter;