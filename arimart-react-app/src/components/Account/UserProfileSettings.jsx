import { Pencil, User, Lock, CreditCard, MapPin, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function UserProfileSettings() {
  const [activeEditPanel, setActiveEditPanel] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "Yogesh",
    email: "yoegsh123@gmail.com",
    bio: "",
    oldPassword: "",
    newPassword: "",
    address: "123 Main St, Mumbai, India"
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const newErrors = {};
    
    if (activeEditPanel === 'profile' && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (activeEditPanel === 'profile' && !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (activeEditPanel === 'profile' && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (activeEditPanel === 'password' && !formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }
    
    if (activeEditPanel === 'password' && !formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (activeEditPanel === 'password' && formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    if (activeEditPanel === 'address' && !formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
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
            src="https://randomuser.me/api/portraits/men/45.jpg"
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
          />
          <motion.button 
            className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Camera size={16} className="text-white" />
          </motion.button>
        </motion.div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{formData.fullName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{formData.email}</p>
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
        <SettingItem 
          icon={<Lock size={18} />} 
          label="Change Password" 
          onClick={() => handleEditClick('password')}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Address</h3>
        <SettingItem 
          icon={<MapPin size={18} />} 
          label="Edit Address" 
          onClick={() => handleEditClick('address')}
        />
      </div>

      <motion.div 
  className="fixed md:static bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 z-10 md:z-0"
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2 }}
>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-md mx-auto bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
        >
          Update Profile
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {activeEditPanel && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-6 shadow-xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {activeEditPanel === 'profile' && 'Edit Profile'}
                  {activeEditPanel === 'payment' && 'Payment Method'}
                  {activeEditPanel === 'password' && 'Change Password'}
                  {activeEditPanel === 'address' && 'Edit Address'}
                </h3>
                <button onClick={handleClosePanel}>
                  <X className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {activeEditPanel === 'profile' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
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
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {activeEditPanel === 'password' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Old Password</label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                    </div>
                  </div>
                )}

                {activeEditPanel === 'address' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                )}

                {activeEditPanel === 'payment' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Payment method options will appear here</p>
                  </div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold shadow transition"
                >
                  Save Changes
                </motion.button>
              </form>
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
      className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white px-4 py-3 rounded-xl mb-2 shadow-sm"
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