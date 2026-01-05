import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';

const EnterpriseHero = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', { jobTitle, location });
  };

  return (
    <section className="relative bg-gradient-to-br from-[#00467f] via-[#005a9c] to-[#0073b1] min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
           Find the Right Professional
            <br />
            <span className="text-blue-200">For Your Home & Project</span>
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
           Connect with verified masons, carpenters, and helpers in your area. 
            Quality work, vetted by our administration.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Job Title, Keywords, or Company"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00467f] text-gray-800 text-lg"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="City, State, or Zip Code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00467f] text-gray-800 text-lg"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-[#00467f] text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-[#003560] transition-colors whitespace-nowrap"
                >
                  Search Jobs
                </motion.button>
              </div>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
              <span className="text-blue-100">Popular Searches:</span>
              {['Warehouse', 'Customer Service', 'Administrative', 'Manufacturing', 'IT Support'].map((term) => (
                <button
                  key={term}
                  className="text-white hover:text-blue-200 underline transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnterpriseHero;
