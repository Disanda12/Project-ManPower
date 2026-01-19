import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getTopApprovedFeedbacks, ApprovedFeedback } from '../../../api/feedbackService';

const FeedbackCarousel = () => {
    const [feedbacks, setFeedbacks] = useState<ApprovedFeedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getTopApprovedFeedbacks();
                // We duplicate the array to create a seamless infinite loop effect
                setFeedbacks([...data, ...data]);
            } catch (err) {
                console.error("Failed to load feedbacks:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading || feedbacks.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 mb-16 text-center">
                <span className="text-blue-600 font-bold tracking-[0.2em] uppercase text-sm">
                    Success Stories
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">
                    Our Happy Clients
                </h2>
            </div>

            {/* The Moving Track Container */}
            <div className="flex overflow-hidden relative group">
                {/* Gradient Overlays for a "fade-in/out" look on the edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

                <motion.div 
                    className="flex gap-8 px-4"
                    animate={{
                        x: ['0%', '-50%'] // Moves halfway (through the first set of 5)
                    }}
                    transition={{
                        duration: 30, // Adjust speed here (higher is slower)
                        ease: "linear",
                        repeat: Infinity
                    }}
                    whileHover={{ transition: { duration: 60 } }} // Optional: Slower on hover
                >
                    {feedbacks.map((item, index) => (
                        <div 
                            key={`${item.feedback_id}-${index}`}
                            className="w-[350px] md:w-[450px] flex-shrink-0 bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-900/5 border border-gray-100 flex flex-col justify-between"
                        >
                            <div>
                                <Quote className="text-blue-100 mb-4" size={40} />
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={16} 
                                            fill={i < item.rating ? "#fbbf24" : "none"} 
                                            className={i < item.rating ? "text-yellow-400" : "text-gray-200"}
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-700 font-medium leading-relaxed italic text-lg mb-8">
                                    "{item.comment}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 border-t pt-6">
                                <img 
                                    src={item.profile_picture} 
                                    alt=""
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-50"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 leading-none">{item.customer_name}</h4>
                                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Verified Client</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeedbackCarousel;