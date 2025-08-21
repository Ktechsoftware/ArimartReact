import React, { useState } from 'react';
import { Upload, Calendar, ChevronDown, User, Phone, Mail, MapPin, Users, Globe, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {completePersonalInfoAsync} from '../../Store/authSlice';
import { useAuth } from '../../hooks/useAuth';
export default function PersonalInformationForm() {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, currentPhoneNumber } = useSelector(state => state.deliveryAuth);
   const { user, userId, isAuthenticated } = useAuth();
  if(userId){
    return navigate('/info/docs/register')
  }
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    fatherName: '',
    dateOfBirth: '',
    primaryMobile: currentPhoneNumber || '8810381575', // Pre-fill with phone from OTP
    whatsappNumber: '',
    secondaryMobile: '',
    bloodGroup: '',
    city: '',
    address: '',
    language: '',
    profilePicture: null,
    referralCode: '' // Added missing referral code field
  });
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.fullname || !formData.primaryMobile) {
      alert('Please fill in all required fields (Name and Mobile Number)');
      return;
    }

    // Email validation if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      const resultAction = await dispatch(completePersonalInfoAsync(formData));
      
      if (completePersonalInfoAsync.fulfilled.match(resultAction)) {
        console.log('Registration successful:', resultAction.payload);
        alert('Personal information saved successfully!');
        navigate('/info/docs');
      } else {
        console.error('Registration failed:', resultAction.payload);
        alert(resultAction.payload || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const languages = ['English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Malayalam'];

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="p-4 text-black">
            <h1 className="text-2xl font-bold mb-2">Personal Information</h1>
            <p className="text-gray-600">Enter the details below so we can get to know and serve you better</p>
            {error && (
              <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>

          <div className="p-8 space-y-6">
            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Camera className="w-12 h-12 text-white" />
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border-4 border-white hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => handleInputChange('fullname', e.target.value)}
                onFocus={() => setFocusedField('fullname')}
                onBlur={() => setFocusedField('')}
                placeholder="Please enter your full name"
                required
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  focusedField === 'fullname' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                placeholder="Please enter your email"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  focusedField === 'email' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Father's Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Father's Name</label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                onFocus={() => setFocusedField('fatherName')}
                onBlur={() => setFocusedField('')}
                placeholder="Please enter father's name"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  focusedField === 'fatherName' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                onFocus={() => setFocusedField('dateOfBirth')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  focusedField === 'dateOfBirth' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Mobile Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Primary Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.primaryMobile}
                  onChange={(e) => handleInputChange('primaryMobile', e.target.value)}
                  onFocus={() => setFocusedField('primaryMobile')}
                  onBlur={() => setFocusedField('')}
                  placeholder="+91 9999999999"
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-gray-100 backdrop-blur-sm ${
                    focusedField === 'primaryMobile' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-200'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  onFocus={() => setFocusedField('whatsappNumber')}
                  onBlur={() => setFocusedField('')}
                  placeholder="+91 9999999999"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                    focusedField === 'whatsappNumber' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
            </div>

            {/* Secondary Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Secondary Mobile Number (Optional)</label>
              <input
                type="tel"
                value={formData.secondaryMobile}
                onChange={(e) => handleInputChange('secondaryMobile', e.target.value)}
                onFocus={() => setFocusedField('secondaryMobile')}
                onBlur={() => setFocusedField('')}
                placeholder="+91 9999999999"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  focusedField === 'secondaryMobile' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Blood Group
              </label>
              <div className="relative">
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  onFocus={() => setFocusedField('bloodGroup')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none ${
                    focusedField === 'bloodGroup' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select blood group here</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField('')}
                placeholder="e.g. Bangalore"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  focusedField === 'city' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Enter Complete Address Here</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField('')}
                placeholder="Enter your complete address..."
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none ${
                  focusedField === 'address' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Languages you know
              </label>
              <div className="relative">
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  onFocus={() => setFocusedField('language')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none ${
                    focusedField === 'language' 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select your language</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Referral Code (Optional)</label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => handleInputChange('referralCode', e.target.value)}
                onFocus={() => setFocusedField('referralCode')}
                onBlur={() => setFocusedField('')}
                placeholder="Enter referral code"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                  focusedField === 'referralCode' 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#FF6B74] to-[#FF9A6B] hover:from-[#FF5963] hover:to-[#FF8F5A]'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}