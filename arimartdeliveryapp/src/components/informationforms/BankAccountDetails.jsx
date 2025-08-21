import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateBankDetails,
  saveBankDetails,
  getBankDetails,
  clearError,
  clearSuccessMessage,
  selectBankDetails,
  selectLoading,
  selectErrors,
  selectSuccessMessages
} from '../../Store/deliveryUserDetailsSlice'
import { useAuth } from '../../hooks/useAuth';

export const BankAccountDetails = () => { // Default userId for demo
  const navigate = useNavigate();
  const dispatch = useDispatch();
const {userId } = useAuth();
  // Redux state
  const formData = useSelector(selectBankDetails);
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  const successMessages = useSelector(selectSuccessMessages);

  // Load existing data on component mount
  useEffect(() => {
    if (userId) {
      dispatch(getBankDetails(userId));
    }
  }, [dispatch, userId]);

  // Clear success message after showing
  useEffect(() => {
    if (successMessages.bankDetails) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage({ section: 'bankDetails' }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessages.bankDetails, dispatch]);

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (errors.bankDetails) {
      dispatch(clearError({ section: 'bankDetails' }));
    }
    
    dispatch(updateBankDetails({ [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['accountHolderName', 'accountNumber', 'confirmAccountNumber', 'ifscCode', 'bankName', 'branchName', 'accountType'];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        return false;
      }
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        // You could set a local error state here for better UX
        alert('Account numbers do not match');
      }
      return;
    }

    // Transform form data to match API expectations
    const apiData = {
      accountHolderName: formData.accountHolderName,
      accountNumber: formData.accountNumber,
      confirmAccountNumber: formData.confirmAccountNumber,
      ifscCode: formData.ifscCode,
      bankName: formData.bankName,
      branchName: formData.branchName,
      accountType: formData.accountType,
      upiId: formData.upiId || null
    };

    try {
      await dispatch(saveBankDetails({ userId, data: apiData })).unwrap();
      // Navigate back or to next step on success
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const isAccountNumberMismatch = formData.accountNumber && formData.confirmAccountNumber && 
                                  formData.accountNumber !== formData.confirmAccountNumber;

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
          Bank Details
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          Provide your bank account details for payment processing
        </motion.p>
      </div>

      {/* Success Message */}
      {successMessages.bankDetails && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl"
        >
          {successMessages.bankDetails}
        </motion.div>
      )}

      {/* Error Message */}
      {errors.bankDetails && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
        >
          {errors.bankDetails}
        </motion.div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-slideUp">
        <div className="space-y-4">
          {/* Account Holder Name */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
            <input 
              type="text"
              placeholder="Enter full name as per bank"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              value={formData.accountHolderName}
              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
              required
            />
          </div>

          {/* Account Number */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
            <input 
              type="text"
              placeholder="Enter account number"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              required
            />
          </div>

          {/* Confirm Account Number */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number *</label>
            <input 
              type="text"
              placeholder="Re-enter account number"
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 ${
                isAccountNumberMismatch 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-200 focus:ring-green-500'
              }`}
              value={formData.confirmAccountNumber}
              onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value)}
              required
            />
            {isAccountNumberMismatch && (
              <p className="text-red-500 text-sm mt-1">Account numbers do not match</p>
            )}
          </div>

          {/* IFSC Code */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
            <input 
              type="text"
              placeholder="Enter IFSC code"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              value={formData.ifscCode}
              onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
              required
            />
          </div>

          {/* Bank Name */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
            <input 
              type="text"
              placeholder="Enter bank name"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              required
            />
          </div>

          {/* Branch Name */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
            <input 
              type="text"
              placeholder="Enter branch name"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              value={formData.branchName}
              onChange={(e) => handleInputChange('branchName', e.target.value)}
              required
            />
          </div>

          {/* Account Type */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
            <select 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              value={formData.accountType}
              onChange={(e) => handleInputChange('accountType', e.target.value)}
              required
            >
              <option value="">Select Account Type</option>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
            </select>
          </div>

          {/* UPI ID */}
          <div className="transform hover:scale-105 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID (Optional)</label>
            <input 
              type="text"
              placeholder="yourname@upi"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading.bankDetails || !validateForm()}
          className="w-full sticky bottom-3 mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading.bankDetails ? 'Saving...' : 'Save Bank Details'}
        </button>
      </div>
    </div>
  );
}