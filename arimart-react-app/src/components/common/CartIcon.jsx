import { ShoppingBag, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CartIcon({ show = true, showGroupCart = true }) {
  const cartIconRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const {
    totalItems,
    groupTotalItems,
    loading,
    currentGroupId,
    regularCartItems,
    groupCartItems
  } = useCart();

  if (!show) {
    console.log("CartIcon hidden because show=false");
    return null;
  }

  // Calculate if we should show separate indicators
  const shouldShowSeparate = showGroupCart && totalItems > 0 && groupTotalItems > 0 && !currentGroupId;

  return (
    <Link to="/cart" className="relative">
      <motion.div
        ref={cartIconRef}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        className="relative"
      >
        <ShoppingBag className="w-6 h-6 text-black dark:text-white" />

        {/* Debug: Always show a small indicator to test */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>

        {/* Combined indicator (when not showing separate) */}
        {(!shouldShowSeparate && (totalItems > 0 || groupTotalItems > 0)) && (
          <motion.span
            key="combined-indicator"
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              backgroundColor: loading ? "#6B7280" : "#EF4444"
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full"
          >
            {loading ? "…" : (currentGroupId ? groupTotalItems : totalItems + groupTotalItems)}
          </motion.span>
        )}

        {/* Separate indicators */}
        {shouldShowSeparate && (
          <div className="absolute -top-3 -right-3 flex flex-col items-end gap-0.5">
            {/* Regular cart indicator */}
            <motion.span
              key="regular-indicator"
              initial={{ scale: 0, x: -5 }}
              animate={{ 
                scale: 1, 
                x: 0,
                backgroundColor: loading ? "#6B7280" : "#EF4444"
              }}
              className="bg-red-500 text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full"
            >
              {loading ? "…" : totalItems}
            </motion.span>
            
            {/* Group cart indicator */}
            <motion.span
              key="group-indicator"
              initial={{ scale: 0, x: -5 }}
              animate={{ 
                scale: 1, 
                x: 0,
                backgroundColor: loading ? "#6B7280" : "#3B82F6"
              }}
              className="bg-blue-500 text-white text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full"
            >
              {loading ? "…" : groupTotalItems}
            </motion.span>
          </div>
        )}
      </motion.div>
      
      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovering && shouldShowSeparate && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 text-xs z-50"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Your items:</span>
              <span className="font-semibold">{totalItems}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Group items:</span>
              <span className="font-semibold">{groupTotalItems}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}