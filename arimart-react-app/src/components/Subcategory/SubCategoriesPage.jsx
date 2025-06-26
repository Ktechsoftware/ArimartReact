import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GrocerySubcategories from './GrocerySubcategories';
import DesktopProducts from '../Products/DesktopProducts';
import { useParams, Link } from 'react-router-dom';

const SubCategoriesPage = ({ mainCategory }) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { market, subcategory, id } = useParams();
  
  // Capitalize first letter of market name
  const formattedMarket = market ? market.charAt(0).toUpperCase() + market.slice(1) : '';
  
  // Mock data - replace with your API call
  const subCategories = {
    'Grocery': [
      {
        name: 'Staples',
        icon: '🌾',
        subSubCategories: ['Rice', 'Wheat', 'Pulses', 'Flour', 'Salt & Sugar']
      },
      {
        name: 'Snacks & Beverages',
        icon: '🍿',
        subSubCategories: ['Chips', 'Biscuits', 'Noodles', 'Soft Drinks', 'Juices']
      },
      {
        name: 'Packaged Food',
        icon: '🥫',
        subSubCategories: ['Ready-to-Eat', 'Sauces', 'Breakfast Cereals', 'Jams']
      },
      {
        name: 'Personal & Baby Care',
        icon: '🧴',
        subSubCategories: ['Shampoo', 'Soap', 'Diapers', 'Baby Food', 'Skincare']
      },
      {
        name: 'Household Care',
        icon: '🏠',
        subSubCategories: ['Detergents', 'Cleaners', 'Pest Control', 'Air Fresheners']
      },
      {
        name: 'Dairy & Eggs',
        icon: '🥛',
        subSubCategories: ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Eggs']
      },
      {
        name: 'Home & Kitchen',
        icon: '🍳',
        subSubCategories: ['Cookware', 'Cutlery', 'Storage', 'Bakeware']
      }
    ]
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [mainCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
                <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-primary-600 md:ml-2 dark:text-primary-400">
                  {formattedMarket}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Banner Carousel */}
        <div className="w-full mb-8 relative rounded-xl overflow-hidden shadow-md">
          <div className="aspect-[3/1] bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{formattedMarket}</h2>
              <p className="text-white/90 text-lg">Shop the best deals on {formattedMarket.toLowerCase()} products</p>
            </motion.div>
          </div>
        </div>
       <div className="w-full mb-6 relative">
  {/* Full-width banner image */}
  <img 
    src='https://m.media-amazon.com/images/G/31/img24/Fresh/April/Pc_6.jpg' 
    alt='Category banner' 
    className='w-full h-auto object-cover rounded-lg'
  />
  <img 
   src='https://m.media-amazon.com/images/G/31/img24/Fresh/June/V1/PC/100_CASHBACK-STRIPE_PC.jpg' 
    alt='Category banner' 
    className='w-full h-auto object-cover rounded-lg'
  />
</div>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {formattedMarket} Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse through our wide range of {formattedMarket.toLowerCase()} products
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-200 dark:bg-gray-800 h-32 rounded-xl animate-pulse"
              ></motion.div>
            ))}
          </div>
        ) : (
          <>
            <GrocerySubcategories/>

            {/* Sub-subcategories Panel */}
            <AnimatePresence>
              {selectedSubCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-12 overflow-hidden"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <motion.h2 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-bold text-gray-800 dark:text-white"
                      >
                        {subCategories[mainCategory].find(c => c.name === selectedSubCategory)?.name}
                      </motion.h2>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedSubCategory(null)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {subCategories[mainCategory]
                        .find(c => c.name === selectedSubCategory)
                        ?.subSubCategories.map((item, i) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-600 transition-all cursor-pointer shadow-sm"
                          > 
                            <div className="font-medium text-gray-700 dark:text-gray-200 truncate">{item}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">120+ products</div>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Featured Products */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Popular in {formattedMarket}
                </h2>
                <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
                  View all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 aspect-square flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <DesktopProducts/>
          </>
        )}
      </div>
    </div>
  );
};

export default SubCategoriesPage;