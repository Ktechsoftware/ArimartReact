import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, MapPin, Pencil, Plus, Star, Trash2, X, Home, Briefcase, MapPinIcon, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
  clearAddressState
} from '../../Store/addressSlice';

export const AddressSection = ({ userData }) => {
  const dispatch = useDispatch();
  const { 
    addresses, 
    loading, 
    addLoading, 
    updateLoading, 
    deleteLoading, 
    setPrimaryLoading, 
    error, 
    successMessage 
  } = useSelector((state) => state.address);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    adName: '',
    adContact: '',
    adAddress1: '',
    adAddress2: '',
    adCity: '',
    adLandmark: '',
    adPincode: '',
    adType: 'Home',
    isPrimary: 0,
    uId: userData?.id || 0,
  });

  const isEdit = formData.adId !== undefined && formData.adId !== 0;

  const addressTypes = [
    { value: 'Home', icon: Home, label: 'Home' },
    { value: 'Work', icon: Briefcase, label: 'Work' },
    { value: 'Office', icon: Briefcase, label: 'Office' },
    { value: 'Other', icon: MapPinIcon, label: 'Other' }
  ];

  useEffect(() => {
    if (userData?.id) dispatch(fetchUserAddresses(userData.id));
  }, [userData, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: 'white',
          secondary: '#10B981',
        },
      });
      setShowSuccessAnimation(true);
      setTimeout(() => setShowSuccessAnimation(false), 2000);
      dispatch(clearAddressState());
    }
  }, [successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: 'white',
          secondary: '#EF4444',
        },
      });
      dispatch(clearAddressState());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const errors = {};
    if (!formData.adName.trim()) errors.adName = 'Full name is required';
    if (!formData.adContact.trim()) errors.adContact = 'Mobile number is required';
    if (!formData.adAddress1.trim()) errors.adAddress1 = 'Address line 1 is required';
    if (!formData.adCity.trim()) errors.adCity = 'City is required';
    if (!formData.adPincode.trim()) errors.adPincode = 'Pincode is required';
    
    // Validate mobile number format (10 digits)
    if (formData.adContact.trim() && !/^\d{10}$/.test(formData.adContact.trim())) {
      errors.adContact = 'Enter a valid 10-digit mobile number';
    }
    
    // Validate pincode format (6 digits)
    if (formData.adPincode.trim() && !/^\d{6}$/.test(formData.adPincode.trim())) {
      errors.adPincode = 'Enter a valid 6-digit pincode';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (address = null) => {
    setFormErrors({});
    if (address) {
      setFormData({ ...address });
    } else {
      setFormData({
        adId: 0,
        adName: '',
        adContact: '',
        adAddress1: '',
        adAddress2: '',
        adCity: '',
        adLandmark: '',
        adPincode: '',
        adType: 'Home',
        isPrimary: addresses.length === 0 ? 1 : 0,
        uId: userData.id,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (isEdit) {
        await dispatch(updateAddress({ adId: formData.adId, updatedData: formData })).unwrap();
      } else {
        await dispatch(addAddress(formData)).unwrap();
      }
      
      dispatch(fetchUserAddresses(userData.id));
      setIsModalOpen(false);
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const handleDelete = async (adId) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(adId)).unwrap();
        dispatch(fetchUserAddresses(userData.id));
      } catch (error) {
        // Error is handled by useEffect
      }
    }
  };

  const handleSetPrimary = async (adId) => {
    try {
      await dispatch(setPrimaryAddress(adId)).unwrap();
      dispatch(fetchUserAddresses(userData.id));
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const getAddressTypeIcon = (type) => {
    const addressType = addressTypes.find(t => t.value === type);
    return addressType ? addressType.icon : MapPinIcon;
  };

  const allAddresses = [...addresses];
  if (userData?.address && !addresses.some(a => a.adId === userData.address.adId)) {
    allAddresses.unshift(userData.address);
  }

  return (
    <div className="space-y-6">
      {/* Delivery Address Card */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 p-5 rounded-2xl shadow-sm border border-orange-100 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-orange-100/80 dark:bg-gray-700 rounded-xl">
            <MapPin className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Delivery Address</h3>
            {userData?.address ? (
              <p className="text-gray-600 dark:text-gray-300">
                {`${userData.address.adAddress1}, ${userData.address.adAddress2}, ${userData.address.adCity} - ${userData.address.adPincode}`}
              </p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500">No default address saved</p>
            )}
          </div>
          <button 
            onClick={() => openModal()}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${
              userData?.address
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md'
            }`}
          >
            {userData?.address ? 'Edit' : (
              <>
                <Plus className="w-4 h-4" />
                Add Address
              </>
            )}
          </button>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="space-y-4 pb-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Saved Addresses</h3>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : allAddresses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-orange-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-gray-500 dark:text-gray-400">No addresses saved yet</h4>
            <button 
              onClick={() => openModal()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:md:grid-cols-3 gap-4">
            <AnimatePresence>
              {allAddresses.map((addr) => {
                const IconComponent = getAddressTypeIcon(addr.adType);
                return (
                  <motion.div
                    key={addr.adId}
                    className={`relative p-5 rounded-xl border transition-all ${
                      addr.isPrimary === 1 
                        ? 'border-orange-300 bg-orange-50 dark:bg-gray-800/50' 
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    {addr.isPrimary === 1 && (
                      <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                        Primary
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        addr.isPrimary === 1 
                          ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-800 dark:text-white">{addr.adName}</h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {addr.adType}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {addr.adAddress1}, {addr.adAddress2 || ''}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {addr.adCity}, {addr.adPincode}
                        </p>
                        {addr.adLandmark && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            Landmark: {addr.adLandmark}
                          </p>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                          {addr.adContact}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      {addr.isPrimary === 0 && (
                        <button
                          onClick={() => handleSetPrimary(addr.adId)}
                          disabled={setPrimaryLoading}
                          className="text-xs text-orange-500 hover:text-orange-600 disabled:opacity-50 flex items-center gap-1"
                          title="Set as primary"
                        >
                          {setPrimaryLoading ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                          <span>Make Primary</span>
                        </button>
                      )}
                      <button
                        onClick={() => openModal(addr)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1 text-xs"
                        title="Edit address"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(addr.adId)}
                        disabled={deleteLoading}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 flex items-center gap-1 text-xs"
                        title="Delete address"
                      >
                        {deleteLoading ? (
                          <Loader className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-500" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Success!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Your address has been saved successfully</p>
              <button
                onClick={() => setShowSuccessAnimation(false)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors w-full"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {isEdit ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {/* Address Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Address Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {addressTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, adType: type.value })}
                          className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1 text-sm ${
                            formData.adType === type.value
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={formData.adName}
                      onChange={(e) => setFormData({ ...formData, adName: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        formErrors.adName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      placeholder="Enter your full name"
                    />
                    {formErrors.adName && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.adName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={formData.adContact}
                      onChange={(e) => setFormData({ ...formData, adContact: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        formErrors.adContact ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      placeholder="Enter 10-digit mobile number"
                      type="tel"
                      maxLength="10"
                    />
                    {formErrors.adContact && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.adContact}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={formData.adAddress1}
                      onChange={(e) => setFormData({ ...formData, adAddress1: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        formErrors.adAddress1 ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                      placeholder="House no., Building name"
                    />
                    {formErrors.adAddress1 && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.adAddress1}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Address Line 2
                    </label>
                    <input
                      value={formData.adAddress2}
                      onChange={(e) => setFormData({ ...formData, adAddress2: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Road name, Area, Colony"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={formData.adCity}
                        onChange={(e) => setFormData({ ...formData, adCity: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          formErrors.adCity ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                        placeholder="Enter city"
                      />
                      {formErrors.adCity && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.adCity}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={formData.adPincode}
                        onChange={(e) => setFormData({ ...formData, adPincode: e.target.value })}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          formErrors.adPincode ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                        placeholder="6-digit pincode"
                        type="tel"
                        maxLength="6"
                      />
                      {formErrors.adPincode && (
                        <p className="mt-1 text-sm text-red-500">{formErrors.adPincode}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      value={formData.adLandmark}
                      onChange={(e) => setFormData({ ...formData, adLandmark: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nearby famous place"
                    />
                  </div>

                  {addresses.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        checked={formData.isPrimary === 1}
                        onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked ? 1 : 0 })}
                        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <label htmlFor="isPrimary" className="text-sm text-gray-700 dark:text-gray-300">
                        Set as primary address
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={addLoading || updateLoading}
                  className="px-5 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {(addLoading || updateLoading) ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isEdit ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};