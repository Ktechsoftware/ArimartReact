import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import HeroBanner from './HeroBanner';
import { GroupBuySection } from '../../pages/GroupBuy/GroupBuySection';
import { fetchCurrentRunningGroups } from '../../Store/groupBuySlice';

export const GroupBuyPage = () => {
  const dispatch = useDispatch();
  const [loadingMore, setLoadingMore] = useState(false);

  const {
    currentRunningGroups = [],
    currentRunningGroupsPagination = {},
    isLoading: groupsLoading = false,
    error: groupsError = null,
  } = useSelector((state) => state.group);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    dispatch(fetchCurrentRunningGroups({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const handleLoadMore = async () => {
    if (loadingMore || !currentRunningGroupsPagination.hasNextPage) return;

    setLoadingMore(true);
    try {
      await dispatch(fetchCurrentRunningGroups({
        page: currentRunningGroupsPagination.currentPage + 1,
        pageSize: currentRunningGroupsPagination.pageSize || 10,
        append: true
      }));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <HeroBanner />

      <div className="container mx-auto px-4 py-6">
        {/* Compact Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Active Group Buys
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Join groups to get discounts - more members = better deals
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {groupsLoading && currentRunningGroups.length === 0 ? (
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : groupsError ? (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg text-sm">
                {groupsError}
              </div>
            ) : currentRunningGroups.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                <p className="text-gray-500 dark:text-gray-400">No active group buys available</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentRunningGroups.map((product, index) => (
                  <motion.div
                    key={product.gid || product.Gid || product.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image Column */}
                      <div className="sm:w-1/3 p-3">
                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          {product.image ? (
                            <img
                              src={"https://apiari.kuldeepchaurasia.in/uploads/" + product.image}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {Math.round(100 - (product.gprice / product.price * 100))}% OFF
                          </div>
                        </div>
                      </div>

                      {/* Info Column */}
                      <div className="sm:w-2/3 p-3 flex flex-col">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {product.productName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {product.shortdesc}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Original</p>
                            <p className="text-gray-700 dark:text-gray-300 line-through">₹{product.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">Group Price</p>
                            <p className="font-bold text-blue-700 dark:text-blue-300">₹{product.gprice}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Min Qty</p>
                            <p className="text-gray-700 dark:text-gray-300">{product.gqty}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Creator</p>
                            <p className="text-gray-700 dark:text-gray-300 truncate">
                              {product.vendorName || 'Anonymous'}
                            </p>
                          </div>
                        </div>

                        {/* Group Buy Section */}
                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <GroupBuySection
                            userId={userData?.userId || userData?.id}
                            product={product}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Load More */}
                {currentRunningGroupsPagination.hasNextPage && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
                    >
                      {loadingMore ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}

                {/* Count */}
                {currentRunningGroupsPagination.totalCount > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                    Showing {currentRunningGroups.length} of {currentRunningGroupsPagination.totalCount} deals
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};