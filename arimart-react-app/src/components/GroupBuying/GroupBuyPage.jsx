import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import HeroBanner from './HeroBanner';
import { GroupBuySection } from '../../pages/GroupBuy/GroupBuySection';
import { fetchCurrentRunningGroups, fetchGroupByReferCode, fetchMyJoinedGroups } from '../../Store/groupBuySlice';
import { useLocation, useNavigate } from 'react-router-dom';
import TabBar from './TabBar';
function GroupSearch() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter a group code');
      return;
    }

    setIsLoading(true);

    const { payload } = await dispatch(fetchGroupByReferCode(code));

    setIsLoading(false);

    if (payload?.status === 1 && payload?.gid) {
      navigate(`/group/join/${payload.gid}/${code}`);
    } else {
      setError(payload?.message || "Invalid group code");
    }

  };

  return (
    <div className="flex items-center justify-center dark:bg-gray-900">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Join a Group
        </h1>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter group code"
              className={`w-full pr-32 pl-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${error
                ? 'border-red-500 focus:ring-red-300 dark:focus:ring-red-700'
                : 'border-gray-300 focus:ring-blue-300 dark:focus:ring-blue-700 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200`}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`absolute top-1/2 right-2 transform -translate-y-1/2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${isLoading
                ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                } text-white`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Join'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}


export const GroupBuyPage = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Add this
  const [loadingMore, setLoadingMore] = useState(false);
  const [tabInitialized, setTabInitialized] = useState(false);

  // Add activeTab state with default value
  const [activeTab, setActiveTab] = useState('group_buys');

  const {
    currentRunningGroups = [],
    currentRunningGroupsPagination = {},
    myJoinedGroups = [], // Add this
    isLoading: groupsLoading = false,
    isLoadingMyGroups = false, // Add this
    error: groupsError = null,
  } = useSelector((state) => state.group);

  const userData = useSelector((state) => state.auth.userData);

  // Update useEffect to handle URL params and tab switching
  useEffect(() => {
    if (!userData) return;

    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam === 'my-joined') {
      setActiveTab('group_joined');
    } else {
      setActiveTab('group_buys'); // Set default tab explicitly
    }

    setTabInitialized(true);
  }, [location.search, userData]);

  // Fetch data when tab is initialized and userData is ready
  useEffect(() => {
    if (!tabInitialized || !userData?.userId) return;
    if (activeTab === 'group_buys') {
      dispatch(fetchCurrentRunningGroups({ page: 1, pageSize: 10 }));
    } else if (activeTab === 'group_joined') {
      dispatch(fetchMyJoinedGroups(userData.userId));
    }
  }, [dispatch, activeTab, userData?.userId, tabInitialized]);


  // Add tab change handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Optional: Update URL without causing page reload
    const newUrl = new URL(window.location);
    if (tabId === 'group_joined') {
      newUrl.searchParams.set('tab', 'my-joined');
    } else {
      newUrl.searchParams.delete('tab');
    }
    window.history.pushState({}, '', newUrl);
  };
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
      <TabBar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="container mx-auto px-4 py-6">
        <GroupSearch />

        {/* Conditional rendering based on active tab */}
        {activeTab === 'group_buys' && (
          <>
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
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
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
                          <div className="w-full sm:w-1/3 p-3">
                            <div className="relative w-32 mx-auto h-32 md:h-28 md:w-28 sm:aspect-square sm:w-full sm:h-auto bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                              {product.image ? (
                                <img
                                  src={"https://apiari.kuldeepchaurasia.in/uploads/" + product.image}
                                  alt={product.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="..." />
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
                          </div>
                        </div>

                        {/* Group Buy Section */}
                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <GroupBuySection
                            userId={userData?.userId || userData?.id}
                            product={product}
                            type=''
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
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
              </motion.div>
            </AnimatePresence>
          </>
        )}
        {activeTab === 'group_joined' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Joined Groups
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Groups you've joined and their current status
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isLoadingMyGroups && myJoinedGroups.length === 0 ? (
                  <div className="grid gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      </div>
                    ))}
                  </div>
                ) : myJoinedGroups.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                    <p className="text-gray-500 dark:text-gray-400">You haven't joined any groups yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {myJoinedGroups.map((product, index) => (
                      <motion.div
                        key={product.gid || product.Gid || product.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Image Column */}
                          <div className="w-full sm:w-1/3 p-3">
                            <div className="relative w-32 mx-auto h-32 md:h-28 md:w-28 sm:aspect-square sm:w-full sm:h-auto bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                              {product.image ? (
                                <img
                                  src={"https://apiari.kuldeepchaurasia.in/uploads/" + product.image}
                                  alt={product.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="..." />
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
                          </div>
                        </div>

                        {/* Group Buy Section */}
                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                          <GroupBuySection
                            userId={userData?.userId || userData?.id}
                            product={product}
                            type="joined"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};