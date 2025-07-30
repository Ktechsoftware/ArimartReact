import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Check } from "lucide-react";

// Upload Document Component
export const UploadDocument = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const updated = [...images];
      updated[index] = { file, url: imageUrl };
      setImages(updated);
    }
  };

  const handleRemove = (index) => {
    const updated = [...images];
    updated[index] = null;
    setImages(updated);
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
    <div className="relative min-h-screen pb-32 px-4 bg-gray-50">
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
          Aadhar Card Details
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          Upload focused photos of your Aadhar Card for faster verification
        </motion.p>
      </div>

      {/* Upload Sections */}
      <div className="space-y-6">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {i === 0 ? "Front Side" : "Back Side"}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {i === 0 
                ? "Clear photo showing your name and photo" 
                : "Clear photo showing the QR code and other details"}
            </p>

            {images[i] ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <img
                  src={images[i].url}
                  alt="Uploaded"
                  className="w-full rounded-lg border-2 border-gray-100 object-cover max-h-64"
                />
                <button
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  onClick={() => handleRemove(i)}
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
                <span className="text-xs text-gray-500">
                  JPG, PNG (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, i)}
                  className="hidden"
                />
              </label>
            )}
          </motion.div>
        ))}
      </div>

      {/* Sticky Submit Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-white via-white to-transparent"
      >
        <button
          onClick={handleSubmit}
          disabled={!images[0] || isSubmitting}
          className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all ${
            images[0] 
              ? "bg-gradient-to-r from-[#FF5963] to-[#FFAF70] text-white hover:shadow-xl"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Documents"}
        </button>
      </motion.div>
    </div>
  );
};