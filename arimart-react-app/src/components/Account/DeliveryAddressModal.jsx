import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, MapPin, Check, ChevronDown, Plus } from "lucide-react";
import { AddressSection } from "../common/AddressSection";
import { useSelector } from "react-redux";

const DeliveryAddressModal = ({ isOpen, onClose }) => {
const userData = useSelector(state => state.auth.userData);
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
            className="bg-white dark:bg-gray-900 p-6 rounded-t-3xl sm:rounded-2xl shadow-xl w-full max-w-3xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="text-green-600 dark:text-green-400" />
                Change Delivery Address
              </h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
             <AddressSection userData={userData} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryAddressModal;