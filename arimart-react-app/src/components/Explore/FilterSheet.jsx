import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, ChevronDown, Check, Star } from "lucide-react";
import { useState } from "react";

export default function FilterSheet({ isOpen, onClose, applyFilters }) {
  const [activeTab, setActiveTab] = useState("categories");
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    price: null,
    rating: null,
    availability: false
  });

  const categories = [
    { id: "fruits", label: "Fruits & Vegetables", icon: "🍎" },
    { id: "dairy", label: "Dairy & Breakfast", icon: "🥛" },
    { id: "snacks", label: "Snacks & Beverages", icon: "🍿" },
    { id: "home", label: "Home Care", icon: "🏠" },
    { id: "personal", label: "Personal Care", icon: "🧴" }
  ];

  const priceRanges = [
    { id: "under100", label: "Under ₹100" },
    { id: "100-200", label: "₹100 - ₹200" },
    { id: "200-500", label: "₹200 - ₹500" },
    { id: "above500", label: "Above ₹500" }
  ];

  const ratings = [4, 3, 2, 1];

  const toggleFilter = (type, value) => {
    setSelectedFilters(prev => {
      if (type === "categories") {
        const newCategories = prev.categories.includes(value)
          ? prev.categories.filter(c => c !== value)
          : [...prev.categories, value];
        return { ...prev, categories: newCategories };
      } else {
        return { ...prev, [type]: prev[type] === value ? null : value };
      }
    });
  };

  const handleApply = () => {
    applyFilters(selectedFilters);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
          />
          
          {/* Filter Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-2xl dark:bg-gray-900 h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {["categories", "price", "rating", "availability"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-medium capitalize ${activeTab === tab ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "categories" && (
                <div className="space-y-3">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => toggleFilter("categories", cat.id)}
                      className={`flex items-center gap-3 w-full p-3 rounded-xl text-left ${selectedFilters.categories.includes(cat.id) ? "bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-orange-800" : "bg-gray-50 dark:bg-gray-800"}`}
                    >
                      <div className="text-xl">{cat.icon}</div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">{cat.label}</span>
                      {selectedFilters.categories.includes(cat.id) && (
                        <Check className="w-4 h-4 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "price" && (
                <div className="space-y-3">
                  {priceRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => toggleFilter("price", range.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-xl ${selectedFilters.price === range.id ? "bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-orange-800" : "bg-gray-50 dark:bg-gray-800"}`}
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{range.label}</span>
                      {selectedFilters.price === range.id && (
                        <Check className="w-4 h-4 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "rating" && (
                <div className="space-y-3">
                  {ratings.map(rating => (
                    <button
                      key={rating}
                      onClick={() => toggleFilter("rating", rating)}
                      className={`flex items-center justify-between w-full p-3 rounded-xl ${selectedFilters.rating === rating ? "bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-orange-800" : "bg-gray-50 dark:bg-gray-800"}`}
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? "fill-orange-400 stroke-orange-400" : "fill-gray-300 stroke-gray-300 dark:fill-gray-600 dark:stroke-gray-600"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">& Up</span>
                      </div>
                      {selectedFilters.rating === rating && (
                        <Check className="w-4 h-4 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "availability" && (
                <div className="space-y-3">
                  <button
                    onClick={() => toggleFilter("availability", true)}
                    className={`flex items-center justify-between w-full p-3 rounded-xl ${selectedFilters.availability ? "bg-orange-50 dark:bg-gray-800 border border-orange-200 dark:border-orange-800" : "bg-gray-50 dark:bg-gray-800"}`}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Available Now</span>
                    {selectedFilters.availability && (
                      <Check className="w-4 h-4 text-orange-500" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-900">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFilters({
                    categories: [],
                    price: null,
                    rating: null,
                    availability: false
                  })}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}