import { Clock, ChevronRight, Package, AlertCircle, Loader2, ShoppingBag, Truck, CheckCircle2, XCircle, Users, Share2, Copy, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory, getGroupOrderHistory, clearOrderError } from "../../Store/orderSlice";
import { fetchGroupStatus } from '../../Store/groupBuySlice'
import { Navigate, useNavigate } from "react-router-dom";

const statusTabs = ["All", "Pending to share", "Placed", "Assigned", "Picked Up", "Shipped", "Delivered"];

export default function OrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state selection
  const userId = useSelector((state) => state.auth?.userData?.id);
  const orderState = useSelector((state) => state.order);
  const groupState = useSelector((state) => state.group);
  const { orders = [], loading = false, error = null } = orderState || {};
  const { statusByGid = {} } = groupState || {};
  console.log(statusByGid)
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategoryTab, setActiveCategoryTab] = useState("All");
  const [copiedCode, setCopiedCode] = useState(null);

  // Dynamically generate category tabs from order data
  const categoryTabs = useMemo(() => {
    if (!orders || orders.length === 0) return ["All"];

    const categories = new Set(["All"]); // Start with "All"

    orders.forEach(order => {
      if (order.categoryName) {
        categories.add(order.categoryName);
      }
    });

    return Array.from(categories).sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    });
  }, [orders]);
  console.log("order data : ", orders)
  useEffect(() => {
    if (userId) {
      dispatch(getOrderHistory(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const uniqueGroupIds = new Set();

    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.groupid !== null && item.groupid !== undefined) {
            uniqueGroupIds.add(item.groupid);
          }
        });
      }
    });

    uniqueGroupIds.forEach(groupid => {
      dispatch(fetchGroupStatus(groupid));
    });

  }, [orders, dispatch, userId]);


  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const uniqueGroupIds = new Set();

    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.groupid !== null && item.groupid !== undefined) {
            uniqueGroupIds.add(item.groupid);
          }
        });
      }
    });

    const groupIdsToFetch = [...uniqueGroupIds].filter(
      gid => gid && !statusByGid[gid]
    );

    if (groupIdsToFetch.length > 0) {
      console.log("Group IDs to fetch:", groupIdsToFetch);
      groupIdsToFetch.forEach(groupid => {
        dispatch(fetchGroupStatus(groupid));
      });
    }
  }, [orders, dispatch, statusByGid]);


  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearOrderError());
      }
    };
  }, [dispatch, error]);

  const handleRetry = () => {
    if (userId) {
      dispatch(getOrderHistory(userId));
      dispatch(getGroupOrderHistory({ userId }));
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'shipped':
        return 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'picked up':
        return 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
      case 'assigned':
        return 'bg-purple-100/80 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      case 'placed':
        return 'bg-indigo-100/80 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200';
      case 'pending to share':
        return 'bg-orange-100/80 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      default:
        return 'bg-gray-100/80 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'picked up':
        return <Package className="w-4 h-4" />;
      case 'assigned':
        return <ShoppingBag className="w-4 h-4" />;
      case 'placed':
        return <Clock className="w-4 h-4" />;
      case 'pending to share':
        return <Share2 className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getGroupStatusText = (groupId) => {
    const groupStatus = statusByGid[groupId];
    if (!groupStatus) return "Loading...";

    if (groupStatus.status === 'complete') {
      return "Group Complete";
    } else if (groupStatus.status === 'pending') {
      const remaining = groupStatus.remainingMembers;
      return `${remaining} members pending`;
    }
    return groupStatus.status;
  };

  const copyToClipboard = async (text, type = 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareGroup = (groupCode, productName) => {
    const shareText = `Join my group order for ${productName}! Use code: ${groupCode}`;

    if (navigator.share) {
      navigator.share({
        title: 'Join Group Order',
        text: shareText,
        url: window.location.origin
      });
    } else {
      copyToClipboard(shareText, 'share');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      let orderStatus = order.status;

      // Handle group orders - check if any item has groupid and should be in "Pending to share"
      if (order.items && Array.isArray(order.items)) {
        const hasGroupItems = order.items.some(item => item.groupid !== null && item.groupid !== undefined);
        if (hasGroupItems) {
          // Get the first groupid to check status
          const firstGroupId = order.items.find(item => item.groupid !== null && item.groupid !== undefined)?.groupid;
          if (firstGroupId) {
            const groupStatus = statusByGid[firstGroupId];
            if (groupStatus && groupStatus.status === 'pending') {
              orderStatus = 'Pending to share';
            }
          }
        }
      }

      const statusMatch = activeTab === "All" || orderStatus === activeTab;
      const categoryMatch = activeCategoryTab === "All" ||
        order.categoryName === activeCategoryTab;
      return statusMatch && categoryMatch;
    });
  }, [orders, activeTab, activeCategoryTab, statusByGid]);

  // Fixed count orders by status including group logic - using items array groupid
  const getOrderCount = (status) => {
    return orders.filter(order => {
      let orderStatus = order.status;

      // Handle group orders - check if any item has groupid
      if (order.items && Array.isArray(order.items)) {
        const hasGroupItems = order.items.some(item => item.groupid !== null && item.groupid !== undefined);
        if (hasGroupItems) {
          // Get the first groupid to check status
          const firstGroupId = order.items.find(item => item.groupid !== null && item.groupid !== undefined)?.groupid;
          if (firstGroupId) {
            const groupStatus = statusByGid[firstGroupId];
            if (groupStatus && groupStatus.status === 'pending') {
              orderStatus = 'Pending to share';
            }
          }
        }
      }

      return orderStatus === status;
    }).length;
  };

  // Fixed isGroupOrder function to check items array
  const isGroupOrder = (order) => {
    return (
      order.items &&
      Array.isArray(order.items) &&
      order.items.some(item => item.groupid !== null && item.groupid !== undefined)
    );
  };

  // Fixed getGroupId helper function
  const getGroupId = (order) => {
    if (order.items && Array.isArray(order.items)) {
      const groupItem = order.items.find(item => item.groupid !== null && item.groupid !== undefined);
      return groupItem?.groupid;
    }
    return null;
  };

  // Fixed getGroupCode helper function  
  const getGroupCode = (order) => {
    // You might need to add groupCode to your data structure or use groupid as code
    const groupId = getGroupId(order);
    return groupId ? `GROUP-${groupId}` : null;
  };

  const isGroupOrderItem = (item) => {
    return item.groupid !== null && item.groupid !== undefined;
  };

  // ProductItem component for reusable item display
  const ProductItem = ({ item, isGroupOrder }) => {
    const groupStatus = isGroupOrder && item.groupid ? statusByGid[item.groupid] : null;

    return (
      <>
        {/* Product Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-16 h-16 rounded-md bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center flex-shrink-0 overflow-hidden relative"
        >
          {item.productImage ? (
            <img
              src={"http://localhost:5015/Uploads/" + item.productImage}
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          )}
          {isGroupOrder && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <Users className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <div className="flex gap-4">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                  {item.productName || 'Product Name N/A'}
                </h3>

                {/* Group Order Badge with specific group status */}
                {isGroupOrder && item.groupid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full font-medium"
                  >
                    <Users className="w-2.5 h-2.5" />
                    <span>{getGroupStatusText(item.groupid)}</span>
                  </motion.div>
                )}
              </div>
              {/* Category Tags */}
              <div className="flex flex-wrap gap-1 mt-1 mb-1.5">
                {[item.categoryName, item.subCategoryName, item.childCategoryName]
                  .filter(Boolean)
                  .map((cat, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-full text-gray-600 dark:text-gray-300">
                      {cat}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Price</p>
              <p className="font-medium text-xs text-gray-900 dark:text-white">
                ₹{item.deliveryprice?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Qty</p>
              <p className="font-medium text-xs text-gray-900 dark:text-white">
                {item.qty || 'N/A'}
              </p>
            </div>
          </div>

          {/* Group Status and Actions for each item */}
          {isGroupOrder && groupStatus && item.groupid && (
            <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-orange-700 dark:text-orange-300">
                    {getGroupStatusText(item.groupid)}
                  </span>
                </div>
                {groupStatus.status === 'pending' && (
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const groupCode = `GROUP-${item.groupid}`;
                        copyToClipboard(groupCode, 'code');
                      }}
                      className="text-xs px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Code
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const groupCode = `GROUP-${item.groupid}`;
                        shareGroup(groupCode, item.productName || 'Product');
                      }}
                      className="text-xs px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      Share
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-gray-100"
    >
      {/* Header */}
      <div className="mb-2">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Your Orders
        </motion.h1>
      </div>

      {/* Status Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-1"
      >
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {statusTabs.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === activeTab
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800/70"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === "Pending to share" && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                  {getOrderCount("Pending to share")}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Category Tabs */}
      {categoryTabs.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {categoryTabs.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`px-2 py-1 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${category === activeCategoryTab
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800/70"
                  }`}
                onClick={() => setActiveCategoryTab(category)}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-medium text-red-700 dark:text-red-300">Error loading orders</h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 w-8 h-8 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
        </motion.div>
      )}

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {!loading && !error && filteredOrders.length > 0 ? (
            <>
              {/* Summary Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4"
              >
                {/* Total Orders */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/40 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                  <p className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-300">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-indigo-900 dark:text-indigo-100">{orders.length}</p>
                </div>

                {/* Delivered */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-300">Delivered</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100">
                    {getOrderCount('Delivered')}
                  </p>
                </div>

                {/* In Progress */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">In Progress</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {orders.filter(o => ['Placed', 'Assigned', 'Picked Up', 'Shipped'].includes(o.status)).length}
                  </p>
                </div>

                {/* Pending to Share */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/40 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                  <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {getOrderCount('Pending to share')}
                  </p>
                </div>
              </motion.div>

              {/* Orders */}
              {filteredOrders.map((order, index) => {
                const isGroupOrderCheck = isGroupOrder(order);
                const groupId = getGroupId(order);
                const groupStatus = isGroupOrderCheck && groupId ? statusByGid[groupId] : null;
                let displayStatus = order.status;

                // Override status for pending group orders
                if (isGroupOrderCheck && groupStatus && groupStatus.status === 'pending') {
                  displayStatus = 'Pending to share';
                }

                return (
                  <motion.div
                    key={order.id || order.trackId || index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, delay: index * 0.03 }}
                    whileHover={{ y: -3 }}
                    className={`group p-4 rounded-lg bg-white dark:bg-gray-900 shadow-xs border cursor-pointer hover:shadow-sm transition-all ${isGroupOrderCheck
                      ? 'border-orange-200 dark:border-orange-800/50 bg-gradient-to-r from-orange-50/30 to-white dark:from-orange-900/10 dark:to-gray-900'
                      : 'border-gray-200 dark:border-gray-800'
                      }`}
                    onClick={() => {
                      if (order.trackId) {
                        navigate("/orders/track/" + order.trackId)
                      }
                    }}
                  >
                    <div className="flex flex-col gap-3">
                      {/* Order header with tracking info and group indicator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {order.trackId || order.id?.slice(0, 8) || 'N/A'}
                          </p>
                          {order.trackId && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full">
                              Trackable
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(order.orderDate || order.addedDate, true)}</span>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="flex flex-col gap-3">
                        {order.items?.length === 1 ? (
                          // Single item display
                          <div className="flex items-start gap-3">
                            <ProductItem
                              item={order.items[0]}
                              isGroupOrder={isGroupOrderItem(order.items[0])}
                            />
                          </div>
                        ) : (
                          // Multiple items display
                          order.items?.map((item, itemIndex) => (
                            <div key={item.id} className="flex items-start gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 mr-1">
                                {itemIndex + 1}.
                              </div>
                              <ProductItem
                                item={item}
                                isGroupOrder={isGroupOrderItem(item)}
                              />
                            </div>
                          ))
                        )}
                      </div>

                      {/* Order footer with summary and status */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-sm">
                          <span className="text-gray-500 dark:text-gray-400 mr-1">Total:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ₹{order.totalAmount?.toLocaleString() || 'N/A'}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1.5">
                            ({order.totalItems || order.items?.length || 0} items)
                          </span>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium w-fit ${getStatusColor(displayStatus)}`}
                        >
                          {getStatusIcon(displayStatus)}
                          <span>{displayStatus || 'Unknown'}</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </>
          ) : !loading && !error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {activeTab !== "All" || activeCategoryTab !== "All"
                  ? "No matching orders found"
                  : "Your order history is empty"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {activeTab !== "All" || activeCategoryTab !== "All"
                  ? "Try adjusting your filters to see more orders"
                  : "When you place orders, they'll appear here"}
              </p>
              {!userId && (
                <p className="text-sm text-red-500 mt-4">
                  Please sign in to view your orders
                </p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Copy Success Toast */}
      <AnimatePresence>
        {copiedCode && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {copiedCode === 'code' ? 'Code copied!' : 'Share text copied!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}