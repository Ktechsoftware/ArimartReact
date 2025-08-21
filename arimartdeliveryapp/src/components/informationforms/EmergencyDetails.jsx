import React, { useEffect } from 'react';
import { ArrowLeft, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateEmergencyDetails,
  saveEmergencyDetails,
  getEmergencyDetails,
  clearError,
  clearSuccessMessage,
  selectEmergencyDetails,
  selectLoading,
  selectErrors,
  selectSuccessMessages
} from '../../Store/deliveryUserDetailsSlice'
import { useAuth } from '../../hooks/useAuth';

export const EmergencyDetails = () => { // Default userId for demo
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {userId } = useAuth();

  // Redux state
  const formData = useSelector(selectEmergencyDetails);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  const successMessages = useSelector(selectSuccessMessages);

  // Load existing data on component mount
  useEffect(() => {
    if (userId) {
      dispatch(getEmergencyDetails(userId));
    }
  }, [dispatch, userId]);

  // Clear success message after showing
  useEffect(() => {
    if (successMessages.emergencyDetails) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage({ section: 'emergencyDetails' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessages.emergencyDetails, dispatch]);

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (errors.emergencyDetails) {
      dispatch(clearError({ section: 'emergencyDetails' }));
    }
    
    dispatch(updateEmergencyDetails({ [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.primaryContactName || !formData.primaryContactPhone || !formData.primaryContactRelation) {
      return;
    }

    // Transform form data to match API expectations
    const apiData = {
      primaryContactName: formData.primaryContactName,
      primaryContactPhone: formData.primaryContactPhone,
      primaryContactRelation: formData.primaryContactRelation,
      secondaryContactName: formData.secondaryContactName || null,
      secondaryContactPhone: formData.secondaryContactPhone || null,
      secondaryContactRelation: formData.secondaryContactRelation || null,
      medicalConditions: formData.medicalConditions || null,
      allergies: formData.allergies || null,
      bloodGroup: formData.bloodGroup || null,
      emergencyAddress: formData.emergencyAddress || null
    };

    try {
      await dispatch(saveEmergencyDetails({ userId, data: apiData })).unwrap();
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
          Emergency Details
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          Provide emergency contact information for safety purposes
        </motion.p>
      </div>

      {/* Success Message */}
      {successMessages.emergencyDetails && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl"
        >
          {successMessages.emergencyDetails}
        </motion.div>
      )}

      {/* Error Message */}
      {errors.emergencyDetails && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
        >
          {errors.emergencyDetails}
        </motion.div>
      )}

      {/* Form Card */}
      <div className="rounded-2xl shadow-xl animate-slideUp">
        <div className="space-y-4">
          {/* Primary Contact */}
          <div className="bg-red-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Primary Emergency Contact *
            </h3>
            
            <div className="space-y-3">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <input 
                  type="text"
                  placeholder="Contact Name"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  value={formData.primaryContactName}
                  onChange={(e) => handleInputChange('primaryContactName', e.target.value)}
                  required
                />
              </div>
              
              <div className="transform hover:scale-105 transition-transform duration-200">
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  value={formData.primaryContactPhone}
                  onChange={(e) => handleInputChange('primaryContactPhone', e.target.value)}
                  required
                />
              </div>
              
              <div className="transform hover:scale-105 transition-transform duration-200">
                <select 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  value={formData.primaryContactRelation}
                  onChange={(e) => handleInputChange('primaryContactRelation', e.target.value)}
                  required
                >
                  <option value="">Select Relation</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secondary Contact */}
          <div className="bg-orange-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Secondary Emergency Contact
            </h3>
            
            <div className="space-y-3">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <input 
                  type="text"
                  placeholder="Contact Name"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  value={formData.secondaryContactName}
                  onChange={(e) => handleInputChange('secondaryContactName', e.target.value)}
                />
              </div>
              
              <div className="transform hover:scale-105 transition-transform duration-200">
                <input 
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  value={formData.secondaryContactPhone}
                  onChange={(e) => handleInputChange('secondaryContactPhone', e.target.value)}
                />
              </div>
              
              <div className="transform hover:scale-105 transition-transform duration-200">
                <select 
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  value={formData.secondaryContactRelation}
                  onChange={(e) => handleInputChange('secondaryContactRelation', e.target.value)}
                >
                  <option value="">Select Relation</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-3">
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
              <textarea 
                placeholder="Any medical conditions or medications"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 h-20"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
              />
            </div>

            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <textarea 
                placeholder="Any known allergies"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 h-20"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
              />
            </div>

            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Address</label>
              <textarea 
                placeholder="Address where you can be reached in emergency"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 h-20"
                value={formData.emergencyAddress}
                onChange={(e) => handleInputChange('emergencyAddress', e.target.value)}
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading.emergencyDetails || !formData.primaryContactName || !formData.primaryContactPhone || !formData.primaryContactRelation}
          className="w-full sticky bottom-5 mt-6 bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading.emergencyDetails ? 'Saving...' : 'Save Emergency Details'}
        </button>
      </div>
    </div>
  );
};