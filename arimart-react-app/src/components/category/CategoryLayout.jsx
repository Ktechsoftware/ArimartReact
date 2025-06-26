import React, { useState } from "react";
import { 
  Home, Shirt, Baby, Soup, Heart, Gem, 
  ShoppingBag, ShoppingCart, ChevronLeft, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const categories = [
  { name: "Women", icon: <Heart size={20} />, color: "bg-pink-100", textColor: "text-pink-600" },
  { name: "Men", icon: <Shirt size={20} />, color: "bg-blue-100", textColor: "text-blue-600" },
  { name: "Kids", icon: <Baby size={20} />, color: "bg-purple-100", textColor: "text-purple-600" },
  { name: "Home", icon: <Home size={20} />, color: "bg-green-100", textColor: "text-green-600" },
  { name: "Beauty", icon: <Gem size={20} />, color: "bg-yellow-100", textColor: "text-yellow-600" },
  { name: "Grocery", icon: <ShoppingCart size={20} />, color: "bg-orange-100", textColor: "text-orange-600" },
  { name: "Bags", icon: <ShoppingBag size={20} />, color: "bg-red-100", textColor: "text-red-600" },
  { name: "Kitchen", icon: <Soup size={20} />, color: "bg-teal-100", textColor: "text-teal-600" },
];

const categoryItems = {
  "Women": [
    { name: "Sarees", image: "https://m.media-amazon.com/images/I/71X8X6RVEHL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "Kurtis", image: "https://m.media-amazon.com/images/I/61HHD3gR3RL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "Dresses", image: "https://m.media-amazon.com/images/I/61xwPp+OZYL._AC_UL480_FMwebp_QL65_.jpg" }
  ],
  "Men": [
    { name: "Shirts", image: "https://m.media-amazon.com/images/I/61nG9h+3QbL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "T-Shirts", image: "https://m.media-amazon.com/images/I/61Y6ArxN8AL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "Jeans", image: "https://m.media-amazon.com/images/I/71d7rfSl0wL._AC_UL480_FMwebp_QL65_.jpg" }
  ],
  "Kids": [
    { name: "Clothing", image: "https://m.media-amazon.com/images/I/81pKb1gWDmL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "Toys", image: "https://m.media-amazon.com/images/I/61yF6Q6XxTL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "Accessories", image: "https://m.media-amazon.com/images/I/61HHD3gR3RL._AC_UL480_FMwebp_QL65_.jpg" }
  ],
  "Grocery": [
    { name: "Staples", image: "https://m.media-amazon.com/images/I/81pKb1gWDmL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "Snacks", image: "https://m.media-amazon.com/images/I/61yF6Q6XxTL._AC_UL480_FMwebp_QL65_.jpg" },
    { name: "Beverages", image: "https://m.media-amazon.com/images/I/61HHD3gR3RL._AC_UL480_FMwebp_QL65_.jpg" }
  ]
};

export default function MobileCategoryView() {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.name || "");

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto px-4 py-2 space-x-2 scrollbar-hide bg-gray-50">
        {categories.map((category) => (
          <motion.button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center rounded-lg p-3 min-w-[80px] ${
              activeCategory === category.name ? category.color : "bg-white"
            } shadow-xs`}
          >
            <div className={`p-2 rounded-full ${
              activeCategory === category.name ? "bg-white" : category.color
            }`}>
              {React.cloneElement(category.icon, {
                className: activeCategory === category.name 
                  ? category.textColor 
                  : "text-gray-600",
                size: 20
              })}
            </div>
            <span className={`text-xs mt-1 ${
              activeCategory === category.name 
                ? `font-bold ${category.textColor}` 
                : "text-gray-700"
            }`}>
              {category.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Category Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-lg font-bold mb-4">{activeCategory}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {(categoryItems[activeCategory] || []).map((item, index) => (
                <motion.div
                  key={`${activeCategory}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-center truncate">
                      {item.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}