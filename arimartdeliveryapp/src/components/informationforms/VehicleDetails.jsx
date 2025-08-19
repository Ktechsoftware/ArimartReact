import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

// Vehicle Details Component
export const VehicleDetails = ({ onBack }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        vehicleType: '',
        vehicleNumber: '',
        brand: '',
        model: '',
        year: '',
        color: '',
        registrationDate: '',
        insuranceNumber: '',
        drivingLicense: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    // State for single image
    const [image, setImage] = useState(null);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage({ file, url: imageUrl });
        }
    };

    const handleRemove = () => {
        setImage(null);
    };


    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate("/documents");
        }, 1500);
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
                    Upload focused photos of below documents for faster verification
                </motion.p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-slideUp">
                <div className="space-y-4">
                    {/* Vehicle Type */}
                    <div className="transform hover:scale-105 transition-transform duration-200">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={formData.vehicleType}
                            onChange={(e) => handleInputChange('vehicleType', e.target.value)}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                        <input
                            type="text"
                            placeholder="Enter vehicle number"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            value={formData.vehicleNumber}
                            onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                        />
                    </div>

                    {/* Brand & Model */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="transform hover:scale-105 transition-transform duration-200">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <input
                                type="text"
                                placeholder="Brand"
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                value={formData.brand}
                                onChange={(e) => handleInputChange('brand', e.target.value)}
                            />
                        </div>
                        <div className="transform hover:scale-105 transition-transform duration-200">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input
                                type="text"
                                placeholder="Model"
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                value={formData.model}
                                onChange={(e) => handleInputChange('model', e.target.value)}
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
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                        >
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Upload Driving License</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Clear photo of your driving license (JPG, PNG, Max 5MB)
                            </p>

                            {image ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative"
                                >
                                    <img
                                        src={image.url}
                                        alt="Uploaded"
                                        className="w-full rounded-lg border-2 border-gray-100 object-cover max-h-64"
                                    />
                                    <button
                                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                                        onClick={handleRemove}
                                    >
                                        <X className="text-gray-600" />
                                    </button>
                                    <div className="flex items-center mt-2 text-green-500 text-sm font-medium">
                                        <Check className="mr-1" />
                                        Uploaded Successfully
                                    </div>
                                </motion.div>
                            ) : (
                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-pink-400 transition-colors group">
                                    <div className="bg-gradient-to-r from-[#FF5963] to-[#FFAF70] p-3 rounded-full mb-3 text-white group-hover:opacity-90 transition-opacity">
                                        <Upload size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 mb-1">
                                        Click to Upload
                                    </span>
                                    <span className="text-xs text-gray-500">JPG, PNG (Max 5MB)</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleUpload(e)}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </motion.div>
                    </div>

                </div>

                <button className="w-full sticky bottom-5 mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Save Vehicle Details
                </button>
            </div>
        </div>
    );
};