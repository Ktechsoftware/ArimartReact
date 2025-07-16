import { motion } from "framer-motion";

const CategoryGrid = ({ 
  title, 
  items = [], 
  onClickItem
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
            {title}
          </h2>
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.length > 0 ? (
            items.map((item, i) => (
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
                  {item.subcategoryName || item.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Click to view products
                </p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No subcategories found
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryGrid;  