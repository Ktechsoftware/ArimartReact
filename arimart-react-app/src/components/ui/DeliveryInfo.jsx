import { motion } from "framer-motion";
import { ChevronRight, LocateFixedIcon } from "lucide-react";

export function DeliveryInfo() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-1"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="md:hidden flex items-center justify-between p-3 rounded-lg cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 shadow-sm"
      >
        <motion.p 
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
          animate={{ x: [0, 2, 0] }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 2 
          }}
        >
          <span className="text-blue-600 dark:text-blue-400 text-lg"><LocateFixedIcon/></span>
          Add delivery location to check extra discount
        </motion.p>
        
        <motion.div
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ChevronRight 
            size={18} 
            className="text-blue-500 dark:text-blue-400" 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}