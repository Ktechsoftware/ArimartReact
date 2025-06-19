import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Animated shopping bag */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 10, stiffness: 100 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full blur-xl opacity-70 animate-pulse" />
        <ShoppingBag 
          size={80} 
          className="text-red-500 dark:text-red-400 relative z-10" 
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Floating items animation */}
      <div className="relative w-full max-w-xs mb-10">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 0, x: i * 30 - 60, opacity: 0 }}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0, 0.3, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-1/2 text-gray-400 dark:text-gray-500 text-4xl"
          >
            {["🍎", "🥕", "🥑"][i-1]}
          </motion.div>
        ))}
      </div>

      {/* Text content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Your cart feels lonely
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Your shopping cart is empty. Let's fill it with fresh groceries and delicious treats!
        </p>
      </motion.div>

      {/* Continue shopping button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to="/products"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
        >
          <span>Browse Products</span>
          <ArrowRight size={18} />
        </Link>
      </motion.div>

      {/* Subtle background animation */}
      <div className="fixed inset-0 overflow-hidden z-[-1]">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute text-gray-200 dark:text-gray-800 text-6xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {["🍏", "🍋", "🍒", "🍑", "🥝", "🍇", "🍊", "🍐", "🍓", "🍉"][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
}