import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import FilterSheet from "./FilterSheet";
import SearchItems from "./SearchItems";
import TopProducts from "./TopProducts";

const categories = ["Frozen", "Fresh", "Drink & Water", "Meat", "Vegetable"];


export default function DailyFoods() {
  const [activeTab, setActiveTab] = useState("Fresh");
  return (
    <div className="max-w-6xl mx-auto  bg-white dark:bg-gray-900 min-h-screen p-4 text-gray-900 dark:text-white">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-xl font-bold">Daily foods</h1>
        <div className="w-10"></div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-4 overflow-x-auto text-sm mb-6 scrollbar-hide"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveTab(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`pb-2 px-1 whitespace-nowrap ${
              activeTab === cat
                ? "text-green-600 dark:text-green-400 font-medium"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {cat}
            {activeTab === cat && (
              <motion.div 
                layoutId="tabIndicator"
                className="h-0.5 bg-green-600 dark:bg-green-400 mt-1"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

<SearchItems/>
      
<TopProducts/>
      
    </div>
  );
}