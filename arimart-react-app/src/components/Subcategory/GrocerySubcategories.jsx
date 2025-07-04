import { motion } from "framer-motion";

const GrocerySubcategories = ({category}) => {
  if (category) {
    const formattedCategory = category.toLowerCase().replace(/ /g, "-");  
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
                  {category.title}
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item, i) => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center"
                    >
                      <div>
                        <h3 className="font-medium text-gray-700 dark:text-gray-200">{item}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">120+ products</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrocerySubcategories;