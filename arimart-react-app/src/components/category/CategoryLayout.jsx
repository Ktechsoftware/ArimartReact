import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchCategories, fetchSubcategories } from '../../Store/categoriesSlice';
import { fetchProducts, fetchSubcategoryproducts, resetProducts } from '../../Store/productsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle } from 'lucide-react';
import TopProducts from '../Explore/TopProducts';

export default function CategoryLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    categories,
    subcategories,
    childSubcategories,
    loadingCategories,
    loadingSubcategories,
    loadingChildSubcategories
  } = useSelector((state) => state.category);

  const {
    items: products,
    loading: productsLoading,
    pagination,
    hasMore,
    loadingMore,
    subcategoryProducts,
    subcategoryPagination,
    subcategoryHasMore,
    subcategoryLoadingMore
  } = useSelector(state => state.products);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [view, setView] = useState('categories'); // 'categories', 'subcategories', 'products'

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const location = useLocation();
  const incomingCategory = location.state?.selectedCategory;

  useEffect(() => {
    if (incomingCategory) {
      setSelectedCategory(incomingCategory);
      setSelectedSubcategory(null);
      dispatch(fetchSubcategories(incomingCategory.id));
      setView('subcategories');
    }
  }, [incomingCategory, dispatch]);


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    dispatch(fetchSubcategories(category.id));
    setView('subcategories');
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log("Clicking subcategory:", subcategory);
    setSelectedSubcategory(subcategory);
    setView('products');

    // Fetch first page of subcategory products
    dispatch(fetchSubcategoryproducts({
      subcategoryId: subcategory.id,
      page: 1,
      limit: 10
    }));
  };

  const handleBack = () => {
    if (view === 'products') {
      setView('subcategories');
      setSelectedSubcategory(null);
      // Reset products when going back
      dispatch(resetProducts());
    } else if (view === 'subcategories') {
      setView('categories');
      setSelectedCategory(null);
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
              view === 'products' ? selectedSubcategory?.subcategoryName : 'Products'}
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
              ) : subcategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 9l6 6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    No subcategories found
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    There are no subcategories available in this category yet.
                  </p>
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

          {view === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <TopProducts
                products={subcategoryProducts[selectedSubcategory?.id] || []}
                title={selectedSubcategory?.subcategoryName || 'Products'}
                subcategoryId={selectedSubcategory?.id}
                // Pass subcategory-specific pagination states
                hasMore={subcategoryHasMore[selectedSubcategory?.id] || false}
                loadingMore={subcategoryLoadingMore[selectedSubcategory?.id] || false}
                pagination={subcategoryPagination[selectedSubcategory?.id] || { page: 1, limit: 10 }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}