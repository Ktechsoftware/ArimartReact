import React, { useEffect } from 'react';
import { ArrowLeft, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateVehicleDetails,
  saveVehicleDetails,
  getVehicleDetails,
  clearError,
  clearSuccessMessage,
  selectVehicleDetails,
  selectLoading,
  selectErrors,
  selectSuccessMessages
} from '../../Store/deliveryUserDetailsSlice'
import { useAuth } from '../../hooks/useAuth';

export const VehicleDetails = () => { // Default userId for demo
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useAuth();

  // Redux state
  const formData = useSelector(selectVehicleDetails);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  const successMessages = useSelector(selectSuccessMessages);

  // Load existing data on component mount
  useEffect(() => {
    if (userId) {
      dispatch(getVehicleDetails(userId));
    }
  }, [dispatch, userId]);

  // Clear success message after showing
  useEffect(() => {
    if (successMessages.vehicleDetails) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage({ section: 'vehicleDetails' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessages.vehicleDetails, dispatch]);

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (errors.vehicleDetails) {
      dispatch(clearError({ section: 'vehicleDetails' }));
    }
    
    dispatch(updateVehicleDetails({ [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['vehicleType', 'vehicleNumber', 'brand', 'model'];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Transform form data to match API expectations
    const apiData = {
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      brand: formData.brand,
      model: formData.model,
      year: formData.year || null,
      color: formData.color || null,
      registrationDate: formData.registrationDate || null,
      insuranceNumber: formData.insuranceNumber || null,
      drivingLicense: formData.drivingLicense || null
    };

    try {
      await dispatch(saveVehicleDetails({ userId, data: apiData })).unwrap();
      // Navigate back or to next step on success
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="min-h-screen px-4 bg-gray-50">
      {/* Header with back button */}
      <div className="sticky top-0 pt-6 pb-4 bg-gray-50 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          <span className="font-medium">Back</span>
        </button>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mt-2 text-gray-800"
        >
          Vehicle Details
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          Provide your vehicle information for delivery operations
        </motion.p>
      </div>

      {/* Success Message */}
      {successMessages.vehicleDetails && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl"
        >
          {successMessages.vehicleDetails}
        </motion.div>
      )}

      {/* Error Message */}
      {errors.vehicleDetails && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
        >
          {errors.vehicleDetails}
        </motion.div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-slideUp">
        <div className="space-y-4">
          {/* Vehicle Type */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
            <select
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={formData.vehicleType}
              onChange={(e) => handleInputChange('vehicleType', e.target.value)}
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="scooter">Scooter</option>
              <option value="bicycle">Bicycle</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
            </select>
          </div>

          {/* Vehicle Number */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
            <input
              type="text"
              placeholder="Enter vehicle number"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={formData.vehicleNumber}
              onChange={(e) => handleInputChange('vehicleNumber', e.target.value.toUpperCase())}
              required
            />
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
              <input
                type="text"
                placeholder="Brand"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
              />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
              <input
                type="text"
                placeholder="Model"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Year & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                placeholder="2020"
                min="1990"
                max={new Date().getFullYear()}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
              />
            </div>
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                placeholder="Color"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
              />
            </div>
          </div>

          {/* Registration Date */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
            <input
              type="date"
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={formData.registrationDate}
              onChange={(e) => handleInputChange('registrationDate', e.target.value)}
            />
          </div>

          {/* Insurance Number */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
            <input
              type="text"
              placeholder="Enter insurance number"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={formData.insuranceNumber}
              onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
            />
          </div>

          {/* Driving License */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
            <input
              type="text"
              placeholder="Enter license number"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={formData.drivingLicense}
              onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading.vehicleDetails || !validateForm()}
          className="w-full sticky bottom-5 mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading.vehicleDetails ? 'Saving...' : 'Save Vehicle Details'}
        </button>
      </div>
    </div>
  );
};