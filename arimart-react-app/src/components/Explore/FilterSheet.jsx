import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const categories = [
  { label: "Meat and Seafood", icon: "🥩" },
  { label: "Frozen Foods", icon: "❄️" },
  { label: "Canned and Jarred Goods", icon: "🥫" },
  { label: "Deli and Prepared", icon: "🥙" },
  { label: "Household and Cleaning", icon: "🧴" },
  { label: "Pet Supplies", icon: "🐶" },
  { label: "Organic and Natural Foods", icon: "🥬" },
];

export default function FilterSheet({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl p-6 shadow-2xl dark:bg-gray-900"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter By The Categories</h2>
            <button onClick={onClose}>
              <X className="text-gray-500 dark:text-gray-300" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose from the below categories</p>

          <div className="space-y-3">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-xl"
              >
                <div className="text-xl">{cat.icon}</div>
                <span className="text-sm font-medium">{cat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
