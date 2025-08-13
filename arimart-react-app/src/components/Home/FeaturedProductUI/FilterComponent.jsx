import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Tag } from 'lucide-react';

const FilterComponent = forwardRef(({ 
    activeFilter, 
    setActiveFilter, 
    showFilters, 
    setShowFilters 
}, ref) => {
    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'bestseller', name: 'Best Sellers' },
        { id: 'trending', name: 'Trending' },
        { id: 'new-arrivals', name: 'New Arrivals' },
        { id: 'deals', name: 'Deals' },
        { id: 'featured', name: 'Featured' },
        { id: 'premium', name: 'Premium' }
    ];

    return (
        <>
            {/* Sticky Filter Header - NO REF HERE */}
            <div className="sticky top-12 z-10 bg-white dark:bg-gray-800 shadow-sm">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-xl font-bold">Recommended for you</h1>
                        <button
                            onClick={() => setShowFilters(true)}
                            className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full"
                        >
                            <Filter size={16} />
                            <span>Filters</span>
                        </button>
                    </div>

                    {/* Category Filters - Horizontal Scroll */}
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-2 pb-1">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveFilter(category.id)}
                                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-all duration-200 ${
                                        activeFilter === category.id
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {showFilters && (
                <div className="fixed inset-0 z-20 bg-black/50 flex justify-end">
                    <motion.div
                        ref={ref}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="w-4/5 max-w-sm bg-white dark:bg-gray-800 h-full shadow-xl"
                    >
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button 
                                onClick={() => setShowFilters(false)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-4">
                            <h4 className="font-medium mb-3 flex items-center">
                                <Tag size={16} className="mr-2" />
                                Categories
                            </h4>
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setActiveFilter(category.id);
                                            setShowFilters(false); // Close modal after selection
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                                            activeFilter === category.id
                                                ? 'bg-orange-500 text-white shadow-md'
                                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                                        }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>

                            {/* Clear Filters Button */}
                            <div className="mt-6 pt-4 border-t dark:border-gray-700">
                                <button
                                    onClick={() => {
                                        setActiveFilter('all');
                                        setShowFilters(false);
                                    }}
                                    className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
});


FilterComponent.displayName = 'FilterComponent';
export default FilterComponent;