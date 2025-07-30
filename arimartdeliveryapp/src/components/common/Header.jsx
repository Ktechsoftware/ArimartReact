import { motion } from "framer-motion";
import { ChevronRight, Menu, Search, Bell, User } from "lucide-react";

export const Header = ({ title }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-16 flex items-center px-4 sm:px-6"
    >
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        <motion.div 
          initial={{ x: -10 }}
          animate={{ x: 0 }}
          className="flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.span>
          </h1>
        </motion.div>
      </div>

      <div className="flex-1 flex justify-end items-center gap-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative hidden sm:block"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 text-sm rounded-full bg-gray-50 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white"
        >
          <User className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
};