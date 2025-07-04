import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";

const CategoryGrid = ({ 
  title, 
  items = [], 
  onClickItem, 
  onToggleExpand, 
  isExpanded = false, 
  childSubcategories = [] 
}) => {
//   console.log("CategoryGrid items:", items);
//   console.log("CategoryGrid title:", title);
//   console.log("CategoryGrid childSubcategories:", childSubcategories);
   
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md overflow-hidden"
    >
      <div className="p-6">
        {/* Header with expand/collapse button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
            {title}
          </h2>
          <button
            onClick={onToggleExpand}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? (
                <ChevronUpCircle className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownCircle className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Child Subcategories */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {childSubcategories.length > 0 ? (
                  childSubcategories.map((item, i) => (
                    <motion.div
                      key={item.id || item.name || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer transition-colors hover:bg-primary-50 dark:hover:bg-gray-600"
                      onClick={() => onClickItem?.(item)}
                    >
                      <h3 className="font-medium text-gray-700 dark:text-gray-200 truncate text-sm">
                        {item.childcategoryName || item.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        120+ products
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                    No subcategories found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CategoryGrid;