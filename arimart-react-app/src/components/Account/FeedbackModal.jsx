import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, Frown, Smile, ChevronRight } from 'lucide-react';

const steps = {
  INIT: 'INIT',
  RATING: 'RATING',
  THANKYOU: 'THANKYOU',
};

export default function FeedbackModal({ isOpen, onClose }) {
  const [step, setStep] = useState(steps.INIT);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStartRating = (isPositive) => {
    setStep(steps.RATING);
  };

  const handleSubmit = () => {
    setStep(steps.THANKYOU);
  };

  const resetModal = () => {
    setStep(steps.INIT);
    setRating(0);
    onClose();
  };

  if (!isOpen) return null;

 return (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[1000] sm:items-center backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-t-3xl sm:rounded-2xl shadow-xl w-full max-w-md"
        >
          <button 
            onClick={resetModal}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <AnimatePresence mode="wait">
            {step === steps.INIT && (
              <motion.div
                key="init"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-6 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/40 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="currentColor" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enjoying our app?</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">We'd love to hear your feedback!</p>
                
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleStartRating(false)}
                  >
                    <Frown className="w-6 h-6 text-red-500" />
                    <span>Could improve</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleStartRating(true)}
                  >
                    <Smile className="w-6 h-6 text-green-500" />
                    <span>Love it!</span>
                  </motion.button>
                </div>
                
                <button 
                  onClick={resetModal}
                  className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Maybe later
                </button>
              </motion.div>
            )}

            {step === steps.RATING && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-6 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/40 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-blue-500 dark:text-blue-400" fill="currentColor" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Rate your experience</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">How would you rate our app?</p>
                
                <div className="flex justify-center gap-1 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-2"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600 fill-gray-100 dark:fill-gray-800'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!rating}
                  onClick={handleSubmit}
                  className={`w-full py-3 rounded-lg font-medium ${
                    rating 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit rating
                </motion.button>
              </motion.div>
            )}

            {step === steps.THANKYOU && (
              <motion.div
                key="thankyou"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-6 text-center"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/30 dark:to-pink-800/40 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-pink-500 dark:text-pink-400" fill="currentColor" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank you! 💖</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Your feedback helps us improve</p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 mb-4"
                >
                  Rate us on App Store <ChevronRight className="w-4 h-4" />
                </motion.button>
                
                <button 
                  onClick={resetModal}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
}