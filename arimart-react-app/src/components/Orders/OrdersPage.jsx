import { Clock, ChevronRight, Package, AlertCircle, Loader2, ShoppingBag, Truck, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderHistory, clearOrderError } from "../../Store/orderSlice";

const statusTabs = ["All", "Placed", "Assigned", "Picked Up", "Shipped", "Delivered"];

export default function OrdersPage() {
  const dispatch = useDispatch();
  
  // Redux state selection
  const userId = useSelector((state) => state.auth?.userData?.id);
  const orderState = useSelector((state) => state.order);
  const { orders = [], loading = false, error = null } = orderState || {};
  
  const [activeTab, setActiveTab] = useState("All");
  const [activeCategoryTab, setActiveCategoryTab] = useState("All");

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

  useEffect(() => {
    if (userId) {
      dispatch(getOrderHistory(userId));
    }
  }, [dispatch, userId]);

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
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const statusMatch = activeTab === "All" || order.status === activeTab;
      const categoryMatch = activeCategoryTab === "All" || 
                           order.categoryName === activeCategoryTab;
      return statusMatch && categoryMatch;
    });
  }, [orders, activeTab, activeCategoryTab]);

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
              className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === activeTab
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800/70"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
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
                className={`px-2 py-1 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  category === activeCategoryTab
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              >
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/40 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{orders.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/40 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">Delivered</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {orders.filter(o => o.status === 'Delivered').length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {orders.filter(o => ['Placed', 'Assigned', 'Picked Up', 'Shipped'].includes(o.status)).length}
                  </p>
                </div>
              </motion.div>

              {/* Orders */}
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id || order.trackId || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, delay: index * 0.03 }}
                  whileHover={{ y: -3 }}
                  className="group p-5 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    if (order.trackId) {
                      console.log('Navigate to tracking:', order.trackId);
                    }
                  }}
                >
                  <div className="md:flex items-start gap-4">
                    {/* Product Image */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-20 h-20 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center flex-shrink-0 overflow-hidden"
                    >
                      {order.imageUrl ? (
                        <img 
                          src={order.imageUrl} 
                          alt={order.productName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-1">
                            {order.productName || 'Product Name Not Available'}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Order ID: {order.trackId || order.id || 'N/A'}
                            </p>
                            {order.trackId && (
                              <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full">
                                Trackable
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.div 
                          whileHover={{ x: 2 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ChevronRight className="text-gray-400" size={20} />
                        </motion.div>
                      </div>

                      {/* Category Information */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {order.categoryName && (
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-600 dark:text-gray-300">
                            {order.categoryName}
                          </span>
                        )}
                        {order.subCategoryName && (
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-600 dark:text-gray-300">
                            {order.subCategoryName}
                          </span>
                        )}
                        {order.childCategoryName && (
                          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-600 dark:text-gray-300">
                            {order.childCategoryName}
                          </span>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ₹{order.deliveryprice?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quantity</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {order.qty || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ₹{(order.deliveryprice * order.qty)?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Status and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span>{order.status || 'Unknown'}</span>
                        </motion.div>
                        
                        {order.addedDate && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(order.addedDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
    </motion.div>
  );
}