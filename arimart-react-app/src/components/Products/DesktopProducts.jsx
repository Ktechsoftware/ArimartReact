import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import {
  searchProducts,
  loadMoreSearchResults,
  clearSearchResults,
} from '../../Store/searchSlice';

const DesktopProducts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const loadMoreRef = useRef(null);

  const {
    results,
    loading,
    error,
    hasMore,
    pagination,
  } = useSelector((state) => state.search);

  const { selectedFilters } = useSelector((state) => state.filters);

  // Helper to build filter request
  const getSearchParamsFromFilters = (filters) => {
    const params = {};

    // Handle price range
    if (filters.priceRanges && filters.priceRanges.length > 0) {
      const selected = filters.priceRanges[0]; // "0-50"
      const [min, max] = selected.split('-');
      params.priceMin = parseFloat(min);
      params.priceMax = parseFloat(max);
    }

    // Add more filters (discountRanges, brands, etc.) here if needed

    return params;
  };

  // Memoized load more function
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && query) {
      const filterParams = getSearchParamsFromFilters(selectedFilters);
      dispatch(loadMoreSearchResults({ 
        query,
        ...filterParams
      }));
    }
  }, [hasMore, loading, query, selectedFilters, dispatch]);

  // Search effect - triggers on query or filter changes
  useEffect(() => {
    if (!query) return;

    const filterParams = getSearchParamsFromFilters(selectedFilters);
    dispatch(clearSearchResults());
    dispatch(searchProducts({
      query,
      page: 1,
      pageSize: 12,
      ...filterParams,
    }));
  }, [query, selectedFilters, dispatch]);

  // Intersection Observer effect for auto-loading
  useEffect(() => {
    const currentRef = loadMoreRef.current;
    
    if (!currentRef || !hasMore || loading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { 
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleLoadMore, hasMore, loading]);

  const displayTitle = query
    ? `Search Results for "${query}"`
    : 'Popular Products';

  return (
    <div className="md:py-8 md:px-4 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {displayTitle}
        </h2>
      </div>

      {loading && pagination.page === 1 && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="p-4 text-red-500 text-center">
          Error: {error}
        </div>
      )}

      {results.length === 0 && !loading && query && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No products found for "{query}".
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:p-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Auto-load trigger element - only show when there are more items to load */}
      {hasMore && results.length > 0 && (
        <div 
          ref={loadMoreRef} 
          className="h-10 flex justify-center items-center"
        >
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          )}
        </div>
      )}

      {/* Loading indicator for subsequent pages */}
      {loading && pagination.page > 1 && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading more products...</span>
        </div>
      )}
    </div>
  );
};

export default DesktopProducts;