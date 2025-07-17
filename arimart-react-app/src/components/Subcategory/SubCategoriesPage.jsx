import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubcategories } from '../../Store/categoriesSlice';
import { fetchSubcategoryproducts } from '../../Store/productsSlice';
import SubcategoryProductSlider from './SubcategoryProductSlider';

const SubCategoriesPage = ({ mainCategory, categoryid }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { market } = useParams();
  const formattedMarket = market ? market.charAt(0).toUpperCase() + market.slice(1) : '';

  const dispatch = useDispatch();
  const { subcategories } = useSelector(state => state.category);
  const { subcategoryProducts = {}, loading } = useSelector(state => state.products);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchSubcategories(categoryid || 1)).finally(() => {
      setIsLoading(false);
    });
  }, [categoryid, dispatch]);

  useEffect(() => {
    // Fetch products for all subcategories when they load
    if (subcategories.length > 0) {
      subcategories.forEach(subcategory => {
        dispatch(fetchSubcategoryproducts({ 
          subcategoryId: subcategory.id,
          page: 1,
          limit: 10
        }));
      });
    }
  }, [subcategories, dispatch]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

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

        {/* Banner Section */}
        <section id="banner" className="w-full mb-8 relative rounded-xl overflow-hidden shadow-md">
          <div className="aspect-[3/1] bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center p-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{formattedMarket}</h2>
              <p className="text-white/90 text-lg">Shop the best deals on {formattedMarket.toLowerCase()} products</p>
            </motion.div>
          </div>
        </section>

        {/* Subcategories with Products */}
        <section id="subcategories" className="space-y-12">
          {isLoading ? (
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full w-1/3 animate-pulse"></div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="bg-gray-200 dark:bg-gray-800 h-64 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            subcategories.map((subcategory) => {
              // Get products for this specific subcategory
              const subcategoryProductsData = subcategoryProducts[subcategory.id] || [];
              
              return (
                <motion.div 
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 relative inline-block">
                      <span className="relative z-10 px-4 bg-gray-50 dark:bg-gray-900">
                        {subcategory.subcategoryName || subcategory.name}
                      </span>
                      <span className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 z-0"></span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Explore our {subcategory.subcategoryName || subcategory.name} collection
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : (
                    <SubcategoryProductSlider 
                      products={subcategoryProductsData} 
                      title={subcategory.subcategoryName || subcategory.name}
                      subcategoryId={subcategory.id}
                    />
                  )}
                </motion.div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default SubCategoriesPage;