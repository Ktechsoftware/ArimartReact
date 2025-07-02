import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function CartIcon({ show = true }) {
  const cartIconRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const { totalItems, loading } = useCart();

  if (!show) return null;

  return (
    <Link to="/cart" className="relative">
      <motion.div
        ref={cartIconRef}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <ShoppingCart className="w-6 h-6 text-black dark:text-white" />
      </motion.div>

      {totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            backgroundColor: loading ? "#6B7280" : "#EF4444" // gray-500 / red-500
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full"
        >
          {loading ? "…" : totalItems}
        </motion.span>
      )}
    </Link>
  );
}