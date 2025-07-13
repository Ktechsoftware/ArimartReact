import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../Store/productsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Filter, ChevronDown } from 'lucide-react';
import FilterSheet from '../Explore/FilterSheet';
import { Link } from 'react-router-dom';

const MobileSearchPage = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchInputRef = useRef(null);

  // Filter options
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load search history and products
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product => 
        product?.productName?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        product?.categoryName?.toLowerCase().includes(searchQuery?.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, products]);

  // Save to search history
  const saveToHistory = (query) => {
    if (!query.trim()) return;
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 5);
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    saveToHistory(searchQuery);
    searchInputRef.current.blur();
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts([]);
    searchInputRef.current.focus();
  };

  // Recent search item click
  const handleHistoryItemClick = (item) => {
    setSearchQuery(item);
    searchInputRef.current.focus();
  };

  // Apply filters
  const applyFilters = () => {
    handleSearchSubmit();
    setShowFilters(false);
  };


  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              placeholder="Search by name or category..."
              className="block w-full pl-10 pr-12 py-2 border border-gray-200 dark:border-gray-700 rounded-full bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-72px)] overflow-y-auto pb-4">
        {/* Show search history when input is empty */}
        {!searchQuery && (
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Recent Searches</h3>
            {searchHistory.length > 0 ? (
              <div className="space-y-2">
                {searchHistory.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleHistoryItemClick(item)}
                    className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xs cursor-pointer"
                  >
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-800 dark:text-gray-200">{item}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No search history yet
              </div>
            )}
          </div>
        )}

        {/* Show real-time search results */}
        {searchQuery && (
          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xs border border-gray-100 dark:border-gray-700"
                  >
                    <Link to={`/category/${encodeURIComponent(product.categoryName)}/${encodeURIComponent(product.subcategoryName)}/product/${product.id}`} className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {product.productName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {product.categoryName}
                        </p>
                      </div>
                      {/* <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                        {product.image && (
                          <img 
                            src={`http://localhost:5015/Uploads/${product.image}`}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div> */}
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Bottom Sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <FilterSheet isOpen={showFilters} onClose={() => setShowFilters(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSearchPage;