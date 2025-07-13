import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ShoppingBag, Package } from "lucide-react";

export default function CheckoutConfirmModal({ isOpen, onClose, onCheckoutBoth, onCheckoutCurrent, cartType }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop with blur effect */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal container */}
        <motion.div
          className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Modal content */}
          <div className="p-6">
            {/* Header with icon */}
            <motion.div
              className="flex flex-col items-center mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Checkout Options</h2>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-center text-gray-600 dark:text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              You have items in both carts. How would you like to proceed?
            </motion.p>

            {/* Buttons */}
           <motion.div
  className="flex flex-col gap-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  {/* Button Row - Responsive Layout */}
  <div className="flex flex-col sm:flex-row gap-3 w-full">
    {/* Checkout Both Button */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
      onClick={onCheckoutBoth}
    >
      <Package className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>Checkout Both</span>
    </motion.button>

    {/* Checkout Current Button */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base ${
        cartType === "group"
          ? "bg-gradient-to-r from-green-600 to-teal-600 text-white"
          : "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
      }`}
      onClick={onCheckoutCurrent}
    >
      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>
        {cartType === "group" ? "Group Cart only" : "Regular Cart only"}
      </span>
    </motion.button>
  </div>

  {/* Cancel Button - Full Width */}
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full py-3 px-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm sm:text-base"
    onClick={onClose}
  >
    Continue Shopping
  </motion.button>
</motion.div>
          </div>

          {/* Footer */}
          <motion.div
            className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 text-center text-xs text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            You can checkout separately later from your cart
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}