import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Star, LoaderCircle, Filter } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadMoreProducts, loadMoreSubcategoryProducts } from "../../Store/productsSlice";
import ProductCard from "../Products/ProductCard";
import FilterSheet from './FilterSheet'

const TopProducts = ({ 
  products = [], 
  title = "Products", 
  subcategoryId = null,
  hasMore: propHasMore,
  loadingMore: propLoadingMore,
  pagination: propPagination
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const { 
    loadingMore: globalLoadingMore, 
    hasMore: globalHasMore, 
    pagination: globalPagination,
    filters,
    loading: productsLoading,
    subcategoryLoadingMore,
    subcategoryHasMore,
    subcategoryPagination
  } = useSelector(state => state.products);

  // Determine which states to use based on whether we have subcategoryId
  const hasMore = subcategoryId ? 
    (propHasMore !== undefined ? propHasMore : subcategoryHasMore[subcategoryId]) : 
    globalHasMore;
    
  const loadingMore = subcategoryId ? 
    (propLoadingMore !== undefined ? propLoadingMore : subcategoryLoadingMore[subcategoryId]) : 
    globalLoadingMore;
    
  const pagination = subcategoryId ? 
    (propPagination || subcategoryPagination[subcategoryId] || { page: 1, limit: 10 }) : 
    globalPagination;

  // Updated load more function
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !isInitialLoad && subcategoryId) {
      const currentPage = pagination.currentPage || pagination.page || 1;
      const nextPage = currentPage + 1;
      
      dispatch(loadMoreSubcategoryProducts({ 
        subcategoryId: subcategoryId,
        page: nextPage,
        limit: pagination.pageSize || pagination.limit || 10
      }));
    }
  }, [dispatch, hasMore, loadingMore, isInitialLoad, subcategoryId, pagination]);

  // Rest of the component remains the same...
  useEffect(() => {
    if (productsLoading || (products.length === 0 && !productsLoading)) {
      setLoading(productsLoading);
      if (!productsLoading) {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [products, productsLoading]);

  // Intersection Observer for auto load more
  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loadingMore && !isInitialLoad) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, isInitialLoad, loadMore]);

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {products.length} products available
          </p>
        </div>
        
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filters</span>
        </button>

        <FilterSheet 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-pulse border border-gray-100 dark:border-gray-700"
            >
              <div className="w-20 h-20 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-3" />
              <div className="space-y-2 text-center">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mx-auto" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-green-300 dark:bg-green-700 rounded w-1/2 mx-auto mt-2" />
                <div className="h-9 bg-green-400 dark:bg-green-600 rounded-lg w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="space-y-4">
          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>

          {/* Load More Trigger Element */}
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {loadingMore && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <LoaderCircle className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading more products...</span>
              </div>
            )}
            {!hasMore && products.length > 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">No more products to load</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <PlusCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try selecting a different category or subcategory
          </p>
        </div>
      )}
    </div>
  );
};

export default TopProducts;