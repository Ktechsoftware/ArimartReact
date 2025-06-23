import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, MapPin, Check, ChevronDown, Plus } from "lucide-react";

const DeliveryAddressModal = ({ isOpen, onClose, currentAddress }) => {
  const [selectedAddress, setSelectedAddress] = useState(currentAddress);
  const [showAddressList, setShowAddressList] = useState(false);

  // Sample addresses - replace with your actual address data
  const addresses = [
    {
      id: 1,
      name: "Home",
      address: "123 Grocery Lane, Apt 4B, Freshville, 12345",
      isDefault: true
    },
    {
      id: 2,
      name: "Work",
      address: "456 Market Street, Suite 200, Businesstown, 67890",
      isDefault: false
    },
    {
      id: 3,
      name: "Summer House",
      address: "789 Beach Road, Coastal City, 34567",
      isDefault: false
    }
  ];

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    setShowAddressList(false);
  };

  const handleSave = () => {
    // Here you would typically call an API to update the address
    console.log("Address changed to:", selectedAddress);
    onClose();
  };

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

            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => setShowAddressList(!showAddressList)}
                  className="w-full flex justify-between items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedAddress?.name || "Select address"}
                    </p>
                    {selectedAddress && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {selectedAddress.address}
                      </p>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: showAddressList ? 180 : 0 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showAddressList && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="max-h-60 overflow-y-auto">
                        {addresses.map((address) => (
                          <motion.button
                            key={address.id}
                            whileHover={{ backgroundColor: "#f3f4f6" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAddressChange(address)}
                            className={`w-full text-left p-3 flex items-start gap-3 ${
                              selectedAddress?.id === address.id 
                                ? 'bg-green-50 dark:bg-gray-700' 
                                : 'bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className="mt-1">
                              {selectedAddress?.id === address.id ? (
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-gray-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {address.name}
                                {address.isDefault && (
                                  <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {address.address}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="mt-4 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Add new address
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={!selectedAddress}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  selectedAddress
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Save Address
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeliveryAddressModal;