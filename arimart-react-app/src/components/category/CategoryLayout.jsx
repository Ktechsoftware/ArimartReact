import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchSubcategories } from '../../Store/categoriesSlice';
import { fetchSubcategoryproducts } from '../../Store/productsSlice';
import { motion } from 'framer-motion';
import TopProducts from '../Explore/TopProducts';

export default function CategoryLayout() {
  const dispatch = useDispatch();
  const {
    categories,
    subcategories,
    loadingCategories,
    loadingSubcategories,
  } = useSelector((state) => state.category);

  const {
    subcategoryProducts,
    subcategoryHasMore,
    subcategoryLoadingMore
  } = useSelector(state => state.products);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Load first category's subcategories by default
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const firstCategory = categories[0];
      setSelectedCategory(firstCategory);
      dispatch(fetchSubcategories(firstCategory.id));
    }
  }, [categories, dispatch]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    dispatch(fetchSubcategories(category.id));
    setShowLeftPanel(true);
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    dispatch(fetchSubcategoryproducts({
      subcategoryId: subcategory.id,
      page: 1,
      limit: 10
    }));
    setShowLeftPanel(false);
  };

  const handleBackToSubcategories = () => {
    setSelectedSubcategory(null);
    setShowLeftPanel(true);
  };

  // Demo images as fallback
  const demoImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
  ];

  // Function to get category image
  const getCategoryImage = (category, index) => {
    return category.image || demoImages[index % demoImages.length];
  };

  // Function to get subcategory image
  const getSubcategoryImage = (subcategory, index) => {
    return subcategory.image || demoImages[(index + 2) % demoImages.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Panel - Categories (small width) */}
      {showLeftPanel && (
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="w-20 md:w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
        >
          <div className="py-2">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center p-2 mb-1 cursor-pointer transition-all duration-300 ${selectedCategory?.id === cat.id
                    ? 'bg-blue-50 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {/* 3D Category Image Container */}
                <div className="relative w-12 h-12 mb-1 group">
                  {/* Main image container with 3D effects */}
                  <div className="relative w-full h-full transform transition-transform duration-300 group-hover:scale-110">
                    {/* Shadow layer for depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full transform translate-y-1 translate-x-1 opacity-30"></div>
                    
                    {/* Main image circle */}
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow-lg border-2 border-white dark:border-gray-600">
                      {/* Inner glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                      
                      {/* Category Image */}
                      <img
                        src={getCategoryImage(cat, index)}
                        alt={cat.categoryName}
                        className="w-full h-full object-cover relative z-10"
                        onError={(e) => {
                          e.target.src = demoImages[index % demoImages.length];
                        }}
                      />
                      
                      {/* Top highlight for 3D effect */}
                      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-full"></div>
                    </div>

                    {/* Selected indicator */}
                    {selectedCategory?.id === cat.id && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-xs text-center text-gray-700 dark:text-gray-300 font-medium truncate w-full">
                  {cat.categoryName}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Right Panel - Subcategories or Products */}
      <div className={`flex-1 overflow-hidden ${!showLeftPanel ? 'w-full' : ''}`}>
        {selectedSubcategory ? (
          // Products View (full width)
          <div className="h-full">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center">
              <button
                onClick={handleBackToSubcategories}
                className="mr-3 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedSubcategory.subcategoryName}
              </h1>
            </div>

            <div className="p-2">
              <TopProducts
                products={subcategoryProducts[selectedSubcategory.id] || []}
                subcategoryId={selectedSubcategory.id}
                hasMore={subcategoryHasMore[selectedSubcategory.id] || false}
                loadingMore={subcategoryLoadingMore[selectedSubcategory.id] || false}
                pagination={{ page: 1, limit: 10 }}
                hideTitle={true}
              />
            </div>
          </div>
        ) : (
          // Subcategories View
          <div className="h-full px-3 fixed overflow-y-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-full bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute -right-5 -top-5 w-20 h-20 bg-white bg-opacity-15 rounded-full"></div>
                <motion.h2
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  className="text-xl font-bold relative z-10"
                >
                   {selectedCategory?.categoryName || "Loading..."}
                </motion.h2>
                <motion.p
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm mt-1 relative z-10"
                >
                  Here are some picks just for you 🎉
                </motion.p>
              </div>
            </motion.div>

            {loadingSubcategories ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : subcategories.length === 0 ? (
              // "Not Found" component
              <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No Subcategories Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  We couldn't find any subcategories for {selectedCategory?.categoryName}
                </p>
                <button
                  onClick={() => dispatch(fetchSubcategories(selectedCategory.id))}
                  className="px-4 py-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              // Subcategories grid with 3D effect
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {subcategories.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubcategoryClick(sub)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    {/* 3D Subcategory Image Container */}
                    <div className="relative w-20 h-20 mb-2">
                      {/* Shadow layer for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full transform translate-y-1 translate-x-1 opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                      
                      {/* Main image circle */}
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow-lg border-3 border-white dark:border-gray-600 transform transition-transform duration-300 group-hover:scale-105">
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                        
                        {/* Subcategory Image */}
                        <img
                          src={getSubcategoryImage(sub, index)}
                          alt={sub.subcategoryName}
                          className="w-full h-full object-cover relative z-10"
                          onError={(e) => {
                            e.target.src = demoImages[(index + 2) % demoImages.length];
                          }}
                        />
                        
                        {/* Top highlight for 3D effect */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-full"></div>
                        
                        {/* Bottom subtle shadow */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>
                      </div>
                    </div>

                    <span className="text-xs text-center text-gray-700 dark:text-gray-300 font-medium max-w-full">
                      {sub.subcategoryName}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}