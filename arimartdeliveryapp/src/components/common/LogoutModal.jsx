import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { useState } from "react";

export const LogoutModal = () => {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm text-red-500 hover:shadow-md transition-all"
      >
        <div className="p-2 rounded-lg bg-red-100">
          <LogOut size={20} />
        </div>
        <span className="font-medium">Log Out</span>
      </button>

      {/* Modal Overlay and Content */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
            />

            {/* Modal */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-w-md mx-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300
              }}
            >
              {/* Handle Bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Close Button */}
                <button
                  onClick={handleCancel}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <LogOut size={24} className="text-red-500" />
                  </div>
                </div>

                {/* Title and Message */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Logout Confirmation
                  </h3>
                  <p className="text-gray-600">
                    Are you sure you want to logout from your account?
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Yes, Logout
                  </motion.button>
                  
                  <motion.button
                    onClick={handleCancel}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>

              {/* Safe Area for Mobile */}
              <div className="h-8" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};