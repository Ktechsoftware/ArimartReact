import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DesktopProducts from '../Products/DesktopProducts';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubcategories, fetchChildSubcategories } from '../../Store/categoriesSlice';
import CategoryGrid from './CategoryGrid';

const SubCategoriesPage = ({ mainCategory, categoryid }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { market } = useParams();
  const formattedMarket = market ? market.charAt(0).toUpperCase() + market.slice(1) : '';

  const dispatch = useDispatch();
  const { subcategories, childSubcategoriesMap } = useSelector(state => state.category);
  const [expandedSubcategories, setExpandedSubcategories] = useState(new Set());

  console.log("Market:", market);
  
  useEffect(() => {
    // Only fetch subcategories for this specific category
    dispatch(fetchSubcategories(categoryid || 1));
  }, [categoryid, dispatch]);

  console.log("Subcategories for category:", categoryid, subcategories);

  const handleSubcategoryClick = (subcategory) => {
    const subcategoryId = subcategory.id;
    
    // Toggle expanded state
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
        // Fetch child subcategories if not already expanded
        dispatch(fetchChildSubcategories(subcategoryId));
      }
      return newSet;
    });
  };

  // Clear expanded subcategories when category changes
  useEffect(() => {
    setExpandedSubcategories(new Set());
  }, [categoryid]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [categoryid]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
                <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                <span className="ml-1 text-sm font-medium text-primary-600 md:ml-2 dark:text-primary-400">
                  {formattedMarket}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Banner */}
        <div className="w-full mb-8 relative rounded-xl overflow-hidden shadow-md">
          <div className="aspect-[3/1] bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{formattedMarket}</h2>
              <p className="text-white/90 text-lg">Shop the best deals on {formattedMarket.toLowerCase()} products</p>
            </motion.div>
          </div>
        </div>

        {/* Additional banners */}
        <div className="w-full mb-6 relative">
          <img src='https://m.media-amazon.com/images/G/31/img24/Fresh/April/Pc_6.jpg' alt='Category banner' className='w-full h-auto object-cover rounded-lg' />
          <img src='https://m.media-amazon.com/images/G/31/img24/Fresh/June/V1/PC/100_CASHBACK-STRIPE_PC.jpg' alt='Category banner' className='w-full h-auto object-cover rounded-lg' />
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{formattedMarket} Categories</h1>
          <p className="text-gray-600 dark:text-gray-400">Browse through our wide range of {formattedMarket.toLowerCase()} products</p>
        </motion.div>

        {/* Subcategories with Child Categories */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="bg-gray-200 dark:bg-gray-800 h-32 rounded-xl animate-pulse"></motion.div>
            ))}
          </div>
        ) : (
          <>
            {subcategories.map((subcategory, i) => (
              <div key={subcategory.id} className="mb-10">
                <CategoryGrid
                  title={subcategory.subcategoryName || subcategory.name}
                  subcategoryid={subcategory.id}
                  items={subcategory.childSubcategories || []}
                  onClickItem={(child) => console.log("Child clicked:", child)}
                  onToggleExpand={() => handleSubcategoryClick(subcategory)}
                  isExpanded={expandedSubcategories.has(subcategory.id)}
                  childSubcategories={childSubcategoriesMap?.[subcategory.id] || []}
                />
              </div>
            ))}

            {/* Products */}
            <DesktopProducts />
          </>
        )}
      </div>
    </div>
  );
};

export default SubCategoriesPage;