import { Pencil, User, Lock, CreditCard, MapPin, Camera, Image, Trash2, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Menu } from '@headlessui/react';
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfoAsync } from "../../Store/authSlice";
import toast from 'react-hot-toast'

export default function UserProfileSettings() {
  const [activeEditPanel, setActiveEditPanel] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth?.userData);
  const userId = userData?.id;

  // Only male and female avatars
  const avatarsByGender = {
    male: "https://thumbs.dreamstime.com/b/cool-stylish-male-avatar-sunglasses-vector-illustration-profiles-branding-image-features-wearing-characterized-346328055.jpg",
    female: "https://img.freepik.com/premium-vector/cute-woman-avatar-profile-vector-illustration_1058532-14592.jpg"
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
    gender: "male",
    customImage: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState({});

  // Load user data when component mounts
  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        gender: userData.gender || "male",
        customImage: null,
        imagePreview: null
      });
    }
  }, [userData]);

  const handleEditClick = (panel) => {
    setActiveEditPanel(panel);
  };

  const handleClosePanel = () => {
    setActiveEditPanel(null);
    setErrors({});
    // Reset image preview when closing
    setFormData(prev => ({ ...prev, customImage: null, imagePreview: null }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          customImage: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender,
      // Clear custom image when changing gender
      customImage: null,
      imagePreview: null
    }));
  };

  const removeCustomImage = () => {
    setFormData(prev => ({
      ...prev,
      customImage: null,
      imagePreview: null
    }));
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

      // Add custom image if uploaded
      if (formData.customImage) {
        updatedData.image = formData.customImage;
      } else {
        // Use gender-based default avatar
        updatedData.useGenderAvatar = true;
      }

      dispatch(updateUserInfoAsync({ userId, updatedData }))
        .unwrap()
        .then(() => {
          toast.success("Profile updated successfully");
          handleClosePanel();
        })
        .catch((error) => {
          console.error('Update failed:', error);
          toast.error("Update failed");
        });
    }
  };

  // Function to get current avatar source
  const getCurrentAvatarSrc = () => {
    if (formData.imagePreview) {
      return formData.imagePreview;
    }
    if (userData?.imageUrl && !userData?.useDefaultAvatar) {
      return `http://apiari.kuldeepchaurasia.in/Uploads/${userData.imageUrl}`;
    }
    return avatarsByGender[formData.gender];
  };

  // Function to get avatar for preview section
  const getPreviewAvatarSrc = () => {
    if (formData.imagePreview) {
      return formData.imagePreview;
    }
    return avatarsByGender[formData.gender];
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24 bg-white dark:bg-gray-900 min-h-screen relative">
      <div className="flex flex-col items-center mb-6 relative pt-8">
        <motion.div
          className="relative w-24 h-24 mb-2"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={getCurrentAvatarSrc()}
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 capitalize">
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
      </div>

      <AnimatePresence>
        {activeEditPanel && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end"
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

                </h3>
                <button onClick={handleClosePanel}>
                  <X className="text-gray-500" />
                </button>
              </div>

              <div className="relative pb-16">
                {activeEditPanel === 'profile' && (
                  <div className="space-y-6">
                    {/* Circular Image Upload - Top Center */}
                    <div className="flex flex-col items-center">
                      <div className="relative group">
                        <img
                          src={getPreviewAvatarSrc()}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Menu as="div" className="relative">
                            <Menu.Button className="p-2 bg-white bg-opacity-80 rounded-full">
                              <Camera className="w-6 h-6 text-gray-800" />
                            </Menu.Button>
                            <Menu.Items className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => document.getElementById('cameraInput')?.click()}
                                    className={`flex items-center px-4 py-2 w-full text-left ${active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                      }`}
                                  >
                                    <Camera className="mr-2 h-4 w-4" />
                                    Take Photo
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    onClick={() => document.getElementById('galleryInput')?.click()}
                                    className={`flex items-center px-4 py-2 w-full text-left ${active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                      }`}
                                  >
                                    <Image className="mr-2 h-4 w-4" />
                                    Choose from Gallery
                                  </button>
                                )}
                              </Menu.Item>
                              {formData.customImage && (
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={removeCustomImage}
                                      className={`flex items-center px-4 py-2 w-full text-left text-red-500 ${active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                        }`}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove Photo
                                    </button>
                                  )}
                                </Menu.Item>
                              )}
                            </Menu.Items>
                          </Menu>
                        </div>
                      </div>

                      {/* Hidden file inputs */}
                      <input
                        id="cameraInput"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <input
                        id="galleryInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Name and Email Fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your name"
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
                          className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>

                      {/* Gender Selection (only shown when no custom image) */}
                      {!formData.customImage && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Avatar Style</label>
                          <div className="flex justify-center space-x-4">
                            {Object.entries(avatarsByGender).map(([gender, avatarUrl]) => (
                              <motion.div
                                key={gender}
                                className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-all ${formData.gender === gender
                                    ? 'ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                    : 'bg-gray-100 dark:bg-gray-700'
                                  }`}
                                onClick={() => handleGenderChange(gender)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <img
                                  src={avatarUrl}
                                  alt={`${gender} avatar`}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-xs mt-1 font-medium text-gray-700 dark:text-gray-300 capitalize">
                                  {gender}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sticky Update Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
                  <motion.button
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
                  >
                    Update Profile
                  </motion.button>
                </div>
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