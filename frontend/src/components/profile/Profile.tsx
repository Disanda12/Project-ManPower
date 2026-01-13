import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, ShieldCheck, Loader2, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { notify } from '../utils/notify';
import { getUserProfile, updateProfile } from '../../api/UserService';

const ProfilePage = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        profile_image: ""
    });

    const [preview, setPreview] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) return;
            try {
                const result = await getUserProfile(Number(userId));
                const data = result.data;
                setProfile(data);
                // Fallback to UI Avatars if no image exists
                const initialPreview = data.profile_image 
                    ? `http://localhost:5000${data.profile_image}` 
                    : `https://ui-avatars.com/api/?name=${data.first_name}+${data.last_name}&background=00467f&color=fff&size=128`;
                setPreview(initialPreview);
            } catch (err) {
                notify.error("Failed to load profile details");
            } finally { setLoading(false); }
        };
        fetchUserData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const userId = localStorage.getItem('user_id');
            await updateProfile({ ...profile, user_id: userId, imageFile });
            notify.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (err: any) {
            notify.error(err.toString());
        } finally { setIsSubmitting(false); }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#00467f] mb-4" size={48} />
            <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto pt-10">
                
                {/* Profile Header Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8">
                    <div className="h-40 bg-gradient-to-r from-[#00335c] via-[#00467f] to-[#0062b1] relative" />
                    
                    <div className="px-10 pb-10">
                        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-20 gap-6">
                            
                            {/* Profile Image with Locked State */}
                            <div className="relative group">
                                <div className={`w-40 h-40 rounded-3xl border-[6px] border-white overflow-hidden bg-white shadow-2xl transition-all duration-500 ${isEditing ? 'ring-4 ring-blue-100' : ''}`}>
                                    <img 
                                        src={preview} 
                                        alt="Profile" 
                                        className={`w-full h-full object-cover transition-transform duration-700 ${isEditing ? 'scale-110' : 'scale-100'}`} 
                                    />
                                    
                                    {/* Overlay that only appears during editing */}
                                    <AnimatePresence>
                                        {isEditing && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                                            >
                                                <Camera className="text-white mb-2" size={32} />
                                                <span className="text-white text-xs font-bold uppercase tracking-wider">Change Photo</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
                                    }} 
                                />
                            </div>

                            {/* User Summary */}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                    {profile.first_name} {profile.last_name}
                                </h1>
                                <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <ShieldCheck size={18} className="text-green-500" /> 
                                    Verified Customer account
                                </p>
                            </div>

                            {/* Toggle Edit Button */}
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${
                                    isEditing 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                    : 'bg-[#00467f] text-white hover:bg-[#003561] shadow-lg shadow-blue-900/20'
                                }`}
                            >
                                {isEditing ? <><X size={20} /> Cancel</> : <><Edit3 size={20} /> Edit Profile</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <motion.div 
                    layout
                    className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10"
                >
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* First Name */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 ml-1">
                                    <User size={16} className="text-[#00467f]" /> First Name
                                </label>
                                <input 
                                    disabled={!isEditing} 
                                    type="text" 
                                    value={profile.first_name} 
                                    onChange={(e) => setProfile({...profile, first_name: e.target.value})} 
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 outline-none ${
                                        isEditing 
                                        ? 'bg-white border-blue-100 focus:border-[#00467f] focus:ring-4 focus:ring-blue-50' 
                                        : 'bg-gray-50 border-transparent text-gray-500'
                                    }`} 
                                />
                            </div>

                            {/* Last Name */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 ml-1">
                                    <User size={16} className="text-[#00467f]" /> Last Name
                                </label>
                                <input 
                                    disabled={!isEditing} 
                                    type="text" 
                                    value={profile.last_name} 
                                    onChange={(e) => setProfile({...profile, last_name: e.target.value})} 
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 outline-none ${
                                        isEditing 
                                        ? 'bg-white border-blue-100 focus:border-[#00467f] focus:ring-4 focus:ring-blue-50' 
                                        : 'bg-gray-50 border-transparent text-gray-500'
                                    }`} 
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 ml-1">
                                    <Mail size={16} className="text-[#00467f]" /> Email Address
                                </label>
                                <div className="relative">
                                    <input 
                                        disabled 
                                        type="email" 
                                        value={profile.email} 
                                        className="w-full p-4 rounded-2xl bg-gray-100 border-2 border-transparent text-gray-400 cursor-not-allowed" 
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-gray-400 tracking-widest bg-white px-2 py-1 rounded-md border border-gray-200">Private</span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 ml-1">
                                    <Phone size={16} className="text-[#00467f]" /> Phone Number
                                </label>
                                <input 
                                    disabled={!isEditing} 
                                    type="text" 
                                    value={profile.phone} 
                                    onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 outline-none ${
                                        isEditing 
                                        ? 'bg-white border-blue-100 focus:border-[#00467f] focus:ring-4 focus:ring-blue-50' 
                                        : 'bg-gray-50 border-transparent text-gray-500'
                                    }`} 
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2 ml-1">
                                    <MapPin size={16} className="text-[#00467f]" /> Residential Address
                                </label>
                                <textarea 
                                    disabled={!isEditing} 
                                    rows={3} 
                                    value={profile.address} 
                                    onChange={(e) => setProfile({...profile, address: e.target.value})} 
                                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 outline-none resize-none ${
                                        isEditing 
                                        ? 'bg-white border-blue-100 focus:border-[#00467f] focus:ring-4 focus:ring-blue-50' 
                                        : 'bg-gray-50 border-transparent text-gray-500'
                                    }`} 
                                />
                            </div>
                        </div>

                        {/* Save Changes Button */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4"
                                >
                                    <button 
                                        disabled={isSubmitting} 
                                        type="submit" 
                                        className="w-full bg-gradient-to-r from-[#00467f] to-[#0062b1] text-white py-5 rounded-[1.5rem] font-black text-lg flex justify-center items-center gap-3 shadow-xl shadow-blue-900/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70 disabled:grayscale"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                        {isSubmitting ? "PROCESSING..." : "SAVE ALL CHANGES"}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;