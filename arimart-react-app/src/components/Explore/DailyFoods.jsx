import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import FilterSheet from "./FilterSheet";

const categories = ["Frozen", "Fresh", "Drink & Water", "Meat", "Vegetable"];

const products = [
  {
    name: "Beetroot",
    desc: "Local shop",
    img: "https://via.placeholder.com/80x80?text=Beetroot",
    weight: "500 gm",
    price: "14.29$",
  },
  {
    name: "Italian Avocado",
    desc: "Local shop",
    img: "https://via.placeholder.com/80x80?text=Avocado",
    weight: "450 gm",
    price: "14.29$",
  },
  {
    name: "Beef Mixed",
    desc: "Cut Bone",
    img: "https://via.placeholder.com/80x80?text=Beef",
    weight: "1000 gm",
    price: "14.29$",
  },
  {
    name: "Plant Hunter",
    desc: "Frozen pack",
    img: "https://via.placeholder.com/80x80?text=Plant",
    weight: "250 gm",
    price: "14.29$",
  },
  {
    name: "Sprite",
    desc: "Can & Bottle",
    img: "https://via.placeholder.com/80x80?text=Sprite",
    weight: "250 gm",
    price: "14.29$",
  },
  {
    name: "Szam amm",
    desc: "Process food",
    img: "https://via.placeholder.com/80x80?text=Szam",
    weight: "300 gm",
    price: "14.29$",
  },
];

export default function DailyFoods() {
  const [activeTab, setActiveTab] = useState("Fresh");
   const [showFilter, setShowFilter] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 text-gray-900 dark:text-white">
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-xl mb-6"
      >
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search for 'Grocery'"
          className="bg-transparent outline-none flex-1 text-sm"
        />
        <motion.button 
        onClick={() => setShowFilter(true)}
          whileHover={{ rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {products.map((product, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + idx * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
    >
      <img
        src={product.img}
        alt={product.name}
        className="w-20 h-20 mx-auto object-contain mb-3"
      />
      <div className="text-center">
        <p className="font-semibold text-sm">{product.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.desc}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.weight}</p>
        <p className="font-semibold text-green-600 dark:text-green-400 mt-2">{product.price}</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-3 bg-green-500 hover:bg-green-600 text-white text-sm w-full py-2 rounded-lg flex items-center justify-center"
        >
          <span>+</span>
        </motion.button>
      </div>
    </motion.div>
  ))}
</div>

      <FilterSheet isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
}