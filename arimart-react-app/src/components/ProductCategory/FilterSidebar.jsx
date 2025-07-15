import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFilter } from '../../Store/filterSlice';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.filters);
  const [expandedGroups, setExpandedGroups] = React.useState({
    categories: true,
    priceRanges: true,
    discounts: true,
    grocery: true,
    payOnDelivery: true
  });

  const handleToggle = (category, value) => {
    console.log('Toggled Filter:', category, value);
    dispatch(toggleFilter({ category, value }));
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const renderGroup = (title, options, key) => (
    <motion.div 
      className="mb-2 border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        className="flex items-center justify-between w-full py-2 group"
        onClick={() => toggleGroup(key)}
      >
        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: expandedGroups[key] ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expandedGroups[key] && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden space-y-1 mt-1"
          >
            {options.map((opt, idx) => (
              <motion.li 
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label className="inline-flex items-center w-full p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() =>
                        handleToggle(key,
                          key === 'priceRanges'
                            ? `${opt.min}-${opt.max}`
                            : opt.value || opt.name
                        )
                      }
                    />
                    <div className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-sm bg-white dark:bg-gray-800 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus:ring-2 peer-focus:ring-blue-200 dark:peer-focus:ring-blue-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {opt.label || opt.name}
                    {opt.count && (
                      <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
                        ({opt.count})
                      </span>
                    )}
                  </span>
                </label>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <motion.aside 
      className="sticky top-20 w-full max-w-[240px] h-[calc(100vh-5rem)] overflow-y-auto p-3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Filters</h2>
        <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Reset all
        </button>
      </div>

      <div className="space-y-1">
        {renderGroup("Categories", data.categories || [], "categories")}
        {renderGroup("Price Range", data.priceRanges || [], "priceRanges")}
        {renderGroup("Discounts", data.discountRanges || [], "discountRanges")}
        {renderGroup("Grocery", data.grocery || [], "grocery")}
        {renderGroup("Pay on Delivery", data.payOnDelivery || [], "payOnDelivery")}
      </div>

      {/* Applied filters chips */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Applied filters</h3>
        <div className="flex flex-wrap gap-1.5">
          <motion.span 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            whileHover={{ scale: 1.05 }}
          >
            Electronics
            <button className="ml-1 inline-flex items-center justify-center text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100">
              <X className="w-2.5 h-2.5" />
            </button>
          </motion.span>
        </div>
      </div>
    </motion.aside>
  );
};

export default FilterSidebar; 