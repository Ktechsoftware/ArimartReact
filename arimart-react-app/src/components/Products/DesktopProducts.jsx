import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import {
  searchProducts,
  loadMoreSearchResults,
} from '../../Store/searchSlice';

const DesktopProducts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  const {
    results,
    loading,
    error,
    hasMore,
    pagination,
  } = useSelector((state) => state.search);

  const { selectedFilters } = useSelector((state) => state.filters);

  // 👇 Helper to build filter request
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

  // ✅ Final useEffect to trigger search based on query + filters
  useEffect(() => {
    if (query) {
      const filterParams = getSearchParamsFromFilters(selectedFilters);

      dispatch(searchProducts({
        query,
        page: 1,
        pageSize: 12,
        ...filterParams,
      }));
    }
  }, [query, selectedFilters]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(loadMoreSearchResults({ query }));
    }
  };

  const displayTitle = query
    ? `Search Results for "${query}"`
    : 'Popular Products';

  return (
    <div className="py-8 px-4 bg-white dark:bg-gray-900">
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

      {results.length === 0 && !loading && (
        <p className="text-center text-gray-500 dark:text-gray-400">No products found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:p-4">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DesktopProducts;
