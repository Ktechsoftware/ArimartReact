import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchSubcategories, fetchChildSubcategories } from '../../Store/categoriesSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';

export default function MobileCategoryLayout() {
  const dispatch = useDispatch();
  const {
    categories,
    subcategories,
    childSubcategories,
    loadingCategories,
    loadingSubcategories,
    loadingChildSubcategories
  } = useSelector((state) => state.category);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [view, setView] = useState('categories'); // 'categories', 'subcategories', 'childCategories'
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    dispatch(fetchSubcategories(category.id));
    setView('subcategories');
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    dispatch(fetchChildSubcategories(subcategory.id));
    setIsBottomSheetOpen(true);
  };

  const handleBack = () => {
    if (view === 'childCategories') {
      setView('subcategories');
      setIsBottomSheetOpen(false);
    } else if (view === 'subcategories') {
      setView('categories');
    }
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
    <div className="relative h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center">
        {view !== 'categories' && (
          <button
            onClick={handleBack}
            className="mr-3 p-1 rounded-full bg-gray-100 dark:bg-gray-700"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {view === 'categories' ? 'Categories' :
            view === 'subcategories' ? selectedCategory?.categoryName :
              selectedSubcategory?.subcategoryName}
        </h1>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-56px)] overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          {view === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 grid grid-cols-2 gap-3"
            >
              {loadingCategories ? (
                <div className="flex justify-center items-center p-4">
                  <LoaderCircle className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              ) : (
                categories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(cat)}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 relative">
                      <img
                        src={demoImages[index % demoImages.length]}
                        alt={cat.categoryName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                        <h3 className="text-white font-semibold text-sm">
                          {cat.categoryName}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {view === 'subcategories' && (
            <motion.div
              key="subcategories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="p-4 space-y-3"
            >
              {loadingSubcategories ? (
                <div className="flex justify-center items-center p-4">
                  <LoaderCircle className="w-6 h-6 text-gray-500 animate-spin" />
                </div>
              ) : (
                subcategories.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubcategoryClick(sub)}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={demoImages[(index + 2) % demoImages.length]}
                        alt={sub.subcategoryName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {sub.subcategoryName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tap to view products
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sheet for Child Categories */}
      <AnimatePresence>
        {isBottomSheetOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBottomSheetOpen(false)}
              className="fixed inset-0 bg-black z-20"
            />

            {/* Bottom Sheet */}
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 30,
                mass: 0.5
              }}
              className="fixed bottom-16 left-0 right-0 z-30 bg-white dark:bg-gray-800 rounded-t-3xl shadow-xl"
            >
              {/* Handle */}
              <div className="py-3 flex justify-center">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="px-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  {selectedSubcategory?.subcategoryName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {childSubcategories.length} subcategories
                </p>
              </div>

              {/* Content */}
              <div className="h-[60vh] overflow-y-auto p-4 grid grid-cols-2 gap-3">
                {loadingChildSubcategories ? (
                  <div className="flex justify-center items-center p-4">
                    <LoaderCircle className="w-6 h-6 text-gray-500 animate-spin" />
                  </div>
                ) : (
                  childSubcategories.map((child, index) => (
                    <motion.div
                      key={child.id}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-xs overflow-hidden border border-gray-100 dark:border-gray-600"
                    >
                      <div className="aspect-square bg-gray-100 dark:bg-gray-600 relative">
                        <img
                          src={demoImages[(index + 4) % demoImages.length]}
                          alt={child.childcategoryName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white text-center">
                          {child.childcategoryName}
                        </h4>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}