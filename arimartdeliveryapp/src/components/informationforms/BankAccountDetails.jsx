import React, { useState } from 'react';
import {motion} from 'framer-motion'
import { ArrowLeft, Car, CreditCard, Phone, Shield, User, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BankAccountDetails = ({ onBack }) => {
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: '',
    upiId: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          Bank Details
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          Upload focused photos of below documents for faster verification
        </motion.p>
      </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 animate-slideUp">
          <div className="space-y-4">
            {/* Account Holder Name */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
              <input 
                type="text"
                placeholder="Enter full name as per bank"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
              />
            </div>

            {/* Account Number */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input 
                type="text"
                placeholder="Enter account number"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              />
            </div>

            {/* Confirm Account Number */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Account Number</label>
              <input 
                type="text"
                placeholder="Re-enter account number"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={formData.confirmAccountNumber}
                onChange={(e) => handleInputChange('confirmAccountNumber', e.target.value)}
              />
            </div>

            {/* IFSC Code */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input 
                type="text"
                placeholder="Enter IFSC code"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value)}
              />
            </div>

            {/* Bank Name */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input 
                type="text"
                placeholder="Enter bank name"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
              />
            </div>

            {/* Branch Name */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
              <input 
                type="text"
                placeholder="Enter branch name"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={formData.branchName}
                onChange={(e) => handleInputChange('branchName', e.target.value)}
              />
            </div>

            {/* Account Type */}
            <div className="transform hover:scale-105 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
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

          <button className="w-full sticky bottom-3 mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Save Bank Details
          </button>
        </div>
      </div>
  );
};