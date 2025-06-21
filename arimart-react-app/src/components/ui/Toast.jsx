// Paste the entire Toast and ToastExample code here, but keep only the <Toast /> component export.
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useState, useEffect } from "react";

const Toast = ({ type = "success", message = "", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastConfig = {
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    error: {
      icon: <AlertCircle className="w-6 h-6" />,
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
  };

  const { icon, bg, text, border } = toastConfig[type] || toastConfig.success;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg ${bg} ${text} ${border} border max-w-xs md:max-w-md backdrop-blur-sm bg-opacity-80`}
        >
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 text-sm font-medium">{message}</div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
