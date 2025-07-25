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

  // Demo images
  const demoImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
  ];

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
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryClick(cat)}
                className={`flex flex-col items-center p-2 mb-1 cursor-pointer ${selectedCategory?.id === cat.id
                    ? 'bg-blue-50 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm mb-1">
                  <img
                    src={demoImages[index % demoImages.length]}
                    alt={cat.categoryName}
                    className="w-full h-full object-cover"
                  />
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
                className="mr-3 p-1 rounded-full bg-gray-100 dark:bg-gray-700"
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
          <div className="h-full fixed overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm px-4 py-3">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                {selectedCategory?.categoryName || "Loading..."}
              </h1>
            </div>

            {loadingSubcategories ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : subcategories.length === 0 ? (
              // Add this "Not Found" component here
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
              // Existing subcategories grid
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {subcategories.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSubcategoryClick(sub)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-sm mb-1">
                      <img
                        src={demoImages[(index + 2) % demoImages.length]}
                        alt={sub.subcategoryName}
                        className="w-full h-full object-cover"
                      />

                    </div>
                    <span className="text-xs text-center text-gray-700 dark:text-gray-300 font-medium">
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