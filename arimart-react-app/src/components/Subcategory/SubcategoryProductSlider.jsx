import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, Eye, LoaderCircle } from 'lucide-react';
import ProductCard from '../Products/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { loadMoreSubcategoryProducts } from '../../Store/productsSlice';

const SubcategoryProductSlider = ({ products = [], title = "Products", subcategoryId }) => {
  console.log('SubcategoryProductSlider props:', { products, title, subcategoryId });
  
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);

  // Get subcategory-specific state from Redux
  const { 
    subcategoryPagination = {},
    subcategoryHasMore = {},
    subcategoryLoadingMore = {}
  } = useSelector(state => state.products);

  // Get pagination info for this specific subcategory
  const currentPagination = subcategoryPagination[subcategoryId] || {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false
  };

  const hasMore = subcategoryHasMore[subcategoryId] || false;
  const loadingMore = subcategoryLoadingMore[subcategoryId] || false;

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition);
    }
  }, [products]);

  const scrollTo = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Mouse drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    // Only show loading if products array is empty
    if (products.length === 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [products]);

  // Load more function for subcategory products
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !isInitialLoad && subcategoryId) {
      console.log('Loading more products for subcategory:', subcategoryId);
      dispatch(loadMoreSubcategoryProducts({
        subcategoryId,
        page: currentPagination.currentPage + 1,
        limit: currentPagination.pageSize || 10
      }));
    }
  }, [dispatch, hasMore, loadingMore, isInitialLoad, subcategoryId, currentPagination]);

  // Intersection Observer for auto load more - trigger when scrolling near the end
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
        root: scrollRef.current, // Use the scroll container as root
        rootMargin: '0px 200px 0px 0px', // Load more when 200px before reaching the end
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
  }, [hasMore, loadingMore, isInitialLoad, loadMore, products.length]);

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Products Found</h3>
          <p className="text-sm">No products available in this subcategory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-primary-500 rounded-full mr-3"></span>
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {products.length} products available
            {currentPagination.totalCount > 0 && (
              <span> • {currentPagination.totalCount} total</span>
            )}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => scrollTo('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg transition-colors ${canScrollLeft
                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollTo('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg transition-colors ${canScrollRight
                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`flex flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap space-x-4 overflow-x-auto p-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {products.map((product, index) => (
          <div key={product.id || index} className="min-w-[250px] max-w-[250px]">
            <ProductCard product={product} index={index} />
          </div>
        ))}
        
        {/* Load More Trigger Element - positioned at the end of the scroll container */}
        <div 
          ref={loadMoreRef} 
          className="min-w-[1px] h-full flex items-center justify-center"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-4">
              <LoaderCircle className="w-5 h-5 animate-spin" />
              <span className="text-sm whitespace-nowrap">Loading more...</span>
            </div>
          )}
        </div>
      </div>

      {/* Load More Status */}
      {!hasMore && products.length > 0 && (
        <div className="flex justify-center py-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No more products to load</p>
            <p className="text-xs mt-1">
              Showing {products.length} of {currentPagination.totalCount} products
            </p>
          </div>
        </div>
      )}

      {/* Scroll Indicators */}
      <div className="flex justify-center pb-4">
        <div className="flex space-x-1">
          {products.length > 4 && (
            <>
              <div className={`w-2 h-2 rounded-full transition-colors ${canScrollLeft ? 'bg-gray-300' : 'bg-primary-500'
                }`}></div>
              <div className={`w-2 h-2 rounded-full transition-colors ${canScrollRight ? 'bg-gray-300' : 'bg-primary-500'
                }`}></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryProductSlider;