import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ShieldCheck,
  Loader2,
  Edit3,
  X,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notify } from "../utils/notify";
import { getUserProfile, updateProfile } from "../../api/userService";

const ProfilePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL;
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    profile_image: "",
  });

  const [preview, setPreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      try {
        const result = await getUserProfile(Number(userId));
        const data = result.data;
        setProfile(data);
        const initialPreview = data.profile_image
                    ? `http://localhost:5000${data.profile_image}` 
          : `https://ui-avatars.com/api/?name=${data.first_name}+${data.last_name}&background=00467f&color=fff&size=256`;
        setPreview(initialPreview);
      } catch (err) {
        notify.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem("user_id");
      await updateProfile({ ...profile, user_id: userId, imageFile });
      notify.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      notify.error(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={50} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfd] py-8 px-6 md:px-12 pt-28">
      {/* Max width increased to 7xl for a much bigger feel */}
      <div className="max-w-7xl mx-auto pt-6">
        {/* HEADER SECTION - Enlarged text */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Profile Settings
            </h1>
            <p className="text-gray-500 text-lg mt-2 font-medium">
              Update your account information and public profile.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-bold text-lg transition-all ${
              isEditing
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"
            }`}
          >
            {isEditing ? (
              <>
                <X size={22} /> Cancel
              </>
            ) : (
              <>
                <Edit3 size={22} /> Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT CARD: Enlarged Avatar container */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm flex flex-col items-center sticky top-10">
              <div className="relative group">
                {/* Increased size from 32 to 48 */}
                <div
                  className={`w-48 h-48 rounded-[3rem] overflow-hidden border-8 transition-all duration-500 ${isEditing ? "border-blue-50 rotate-3 scale-105 shadow-2xl" : "border-gray-50"}`}
                >
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Camera size={32} />
                    <span className="text-xs font-bold mt-2 uppercase tracking-widest">
                      Change
                    </span>
                  </button>
                )}
              </div>

              <h2 className="mt-8 text-3xl font-bold text-gray-900 text-center">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-gray-400 font-medium mt-1 uppercase tracking-tighter">
                Customer Account
              </p>

              <div className="w-full mt-10 pt-8 border-t border-gray-50 space-y-6">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Member Since
                    </p>
                    <p className="text-md font-bold text-gray-800">
                      January 2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Status
                    </p>
                    <p className="text-md font-bold text-gray-800">
                      Verified Identity
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Main Form area scaled up */}
          <div className="lg:col-span-8">
            <motion.div
              layout
              className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-12 shadow-sm"
            >
              <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <CustomInput
                    label="First Name"
                    icon={<User size={18} />}
                    value={profile.first_name}
                    isEditing={isEditing}
                    onChange={(val) =>
                      setProfile({ ...profile, first_name: val })
                    }
                  />
                  <CustomInput
                    label="Last Name"
                    icon={<User size={18} />}
                    value={profile.last_name}
                    isEditing={isEditing}
                    onChange={(val) =>
                      setProfile({ ...profile, last_name: val })
                    }
                  />
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <Mail size={16} /> Email Address
                    </label>
                    <input
                      disabled
                      value={profile.email}
                      className="w-full p-5 rounded-2xl bg-gray-50 border border-transparent text-gray-400 cursor-not-allowed font-bold text-lg"
                    />
                  </div>
                  <CustomInput
                    label="Phone Number"
                    icon={<Phone size={18} />}
                    value={profile.phone}
                    isEditing={isEditing}
                    onChange={(val) => setProfile({ ...profile, phone: val })}
                  />
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                      <MapPin size={16} /> Residential Address
                    </label>
                    <textarea
                      disabled={!isEditing}
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      rows={4}
                      className={`w-full p-5 rounded-2xl border-2 transition-all outline-none resize-none font-bold text-lg ${
                        isEditing
                          ? "border-blue-50 focus:border-blue-500 bg-white"
                          : "border-transparent bg-gray-50 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="pt-6"
                    >
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-[0.98] tracking-tight"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <Save size={24} />
                        )}
                        {isSubmitting ? "UPDATING ACCOUNT..." : "SAVE CHANGES"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
    </div>
  );
};

// Reusable input with larger font and padding
const CustomInput = ({ label, icon, value, onChange, isEditing }: any) => (
  <div className="space-y-3">
    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
      {icon} {label}
    </label>
    <input
      disabled={!isEditing}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-5 rounded-2xl border-2 transition-all outline-none font-bold text-lg ${
        isEditing
          ? "border-blue-50 focus:border-blue-500 bg-white"
          : "border-transparent bg-gray-50 text-gray-600"
      }`}
    />
  </div>
);

export default ProfilePage;
