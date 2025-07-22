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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const cookie = Cookies.get('userLoginDataArimart');
    if (cookie) {
      try {
        const user = JSON.parse(cookie);
        // console.log("Parsed user data:", user);
        setFormData(prev => ({
          ...prev,
          fullName: user?.name || "",
          email: user?.email || "",
        }));
      } catch (err) {
        console.error("Failed to parse user cookie:", err);
      }
    }
  }, []);

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

    const newErrors = {};

    if (activeEditPanel === 'profile' && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (activeEditPanel === 'profile' && !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (activeEditPanel === 'profile' && !/^\S+@\S+\.\S+$/.test(formData.email)) {
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
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu6Fw5tFWeBRwvGWXrKGzCzpy3S0srbrnvxA&s"
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
          />
          {/* <motion.button
            className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Camera size={16} className="text-white" />
          </motion.button> */}
        </motion.div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {formData.fullName
            ?.toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase()) || "Guest"}
        </h2>

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
              className="mb-20 bg-white dark:bg-gray-800 w-full rounded-t-2xl p-6 shadow-xl"
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