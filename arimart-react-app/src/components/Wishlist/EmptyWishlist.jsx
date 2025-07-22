import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function EmptyWishlist() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center px-6"
      >
        {/* Image */}
        <motion.img
          src="/wishlist-empty.png" // You can store this image locally or use the URL directly
          alt="Wishlist Empty"
          className="w-48 mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
          }}
        />

        {/* Text */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Wishlist is Empty!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Tap heart button to start saving your favorite items.
        </p>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/explore")}
          className="bg-black text-white px-6 py-2 rounded-full font-medium shadow hover:bg-gray-800 transition"
        >
          Explore
        </motion.button>
      </motion.div>
    </div>
  );
}
