import { Pencil, User, Lock, CreditCard, MapPin, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfoAsync } from "../../Store/authSlice";
import toast from 'react-hot-toast'

export default function UserProfileSettings() {
  const [activeEditPanel, setActiveEditPanel] = useState(null);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth?.userData?.id);
  
  // Gender-based avatar URLs
  const avatarsByGender = {
    male: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    female: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    trans: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80"
  };

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    bio: "",
    gender: "male" // Default gender
  });

  const [errors, setErrors] = useState({});

  const handleEditClick = (panel) => {
    setActiveEditPanel(panel);
  };

  const handleClosePanel = () => {
    setActiveEditPanel(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleSubmit = () => {

    const newErrors = {};

    if (activeEditPanel === 'profile' && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (activeEditPanel === 'profile' && formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (activeEditPanel === 'profile') {
      const updatedData = {
        name: formData.fullName,
        email: formData.email,
        bio: formData.bio,
        gender: formData.gender
      };
      
      dispatch(updateUserInfoAsync({ userId, updatedData }))
        .unwrap()
        .then(() => toast.success("Profile updated successfully"))
        .catch(() => toast.error("Update failed"));
    }

    handleClosePanel();
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24 bg-white dark:bg-gray-900 min-h-screen relative">
      <div className="flex flex-col items-center mb-6 relative pt-8">
        <motion.div
          className="relative w-24 h-24 mb-2"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={avatarsByGender[formData.gender]}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
          />
          <motion.button
            className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEditClick('profile')}
          >
            <Camera size={16} className="text-white" />
          </motion.button>
        </motion.div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {formData.fullName
            ?.toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase()) || "Guest"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 capitalize">
            {formData.gender}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          Personal Information
        </h3>
        <SettingItem
          icon={<User size={18} />}
          label="Edit Profile"
          onClick={() => handleEditClick('profile')}
        />
        <SettingItem
          icon={<CreditCard size={18} />}
          label="Payment Method"
          onClick={() => handleEditClick('payment')}
        />
      </div>

      <AnimatePresence>
        {activeEditPanel && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mb-20 bg-white dark:bg-gray-800 w-full rounded-t-2xl p-6 shadow-xl max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {activeEditPanel === 'profile' && 'Edit Profile'}
                  {activeEditPanel === 'payment' && 'Payment Method'}
                </h3>
                <button onClick={handleClosePanel}>
                  <X className="text-gray-500" />
                </button>
              </div>

              <div>
                {activeEditPanel === 'profile' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Gender & Avatar</label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(avatarsByGender).map(([gender, avatarUrl]) => (
                          <motion.div
                            key={gender}
                            className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.gender === gender
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                            }`}
                            onClick={() => handleGenderChange(gender)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <img
                              src={avatarUrl}
                              alt={`${gender} avatar`}
                              className="w-12 h-12 rounded-full object-cover mb-2"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {gender}
                            </span>
                            {formData.gender === gender && (
                              <motion.div
                                className="w-2 h-2 bg-green-500 rounded-full mt-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                        rows={3}
                      />
                    </div>

                    {/* Avatar Preview */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</label>
                      <div className="flex items-center space-x-3">
                        <img
                          src={avatarsByGender[formData.gender]}
                          alt="Avatar preview"
                          className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-md"
                        />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {formData.fullName || "Your Name"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {formData.gender}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeEditPanel === 'payment' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Payment method options will appear here</p>
                  </div>
                )}

                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow transition"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingItem({ icon, label, onClick }) {
  return (
    <motion.div
      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white px-4 py-3 rounded-xl mb-2 shadow-sm cursor-pointer"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <button>
        <Pencil size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
      </button>
    </motion.div>
  );
}