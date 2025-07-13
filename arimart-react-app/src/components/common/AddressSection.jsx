import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, MapPin, Plus, X } from 'lucide-react';

export const AddressSection = ({ userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState(userData?.adddress || '');

  const handleSave = () => {
    // Here you would typically save to your database/state
    console.log('Saved address:', address);
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl">
        <div className="p-2 bg-orange-100 dark:bg-gray-700 rounded-full">
          <MapPin className="text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Delivery Address</p>
          {userData?.adddress ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userData.adddress}</p>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No address saved</p>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
              userData?.adddress 
                ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {userData?.adddress ? 'Edit' : (
              <>
                <Plus className="w-3 h-3" />
                Add
              </>
            )}
          </button>
          {userData?.adddress && (
            <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                {userData?.adddress ? 'Edit Address' : 'Add Address'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                rows={3}
                placeholder="Enter your full address"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Address
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};