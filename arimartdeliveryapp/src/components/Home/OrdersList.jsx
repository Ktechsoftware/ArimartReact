import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'
import {
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Navigation,
  Truck,
  BarChart3,
  QrCode,
  RefreshCw,
  ChevronDown,
  Loader2
} from 'lucide-react';
import {
  fetchActiveDeliveries,
  updateDeliveryStatus,
  updateOrderStatusLocal,
  selectActiveDeliveries,
  selectCompletedDeliveries,
  selectDeliveryStats,
  selectDeliveryPartner,
  selectIsLoading,
  selectError
} from '../../Store/deliveryOrderSlice';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Loading Skeleton Components
const OrderCardSkeleton = () => (
  <div className="bg-white rounded-3xl border-2 border-gray-100 p-3 animate-pulse">
    <div className="flex justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      <div className="text-right space-y-1">
        <div className="h-6 bg-gray-200 rounded-full w-16 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-12 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-10"></div>
      </div>
    </div>
  </div>
);

const StatsCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-3 shadow-sm animate-pulse">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-6 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-6 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-10"></div>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-6 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
  </div>
);

// Button Loading Component
const LoadingButton = ({ children, isLoading, ...props }) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    className={`${props.className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
  >
    {isLoading ? (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading...</span>
      </div>
    ) : (
      children
    )}
  </button>
);

export const OrdersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userId } = useAuth();

  // Redux state
  const activeDeliveries = useSelector(selectActiveDeliveries);
  const completedDeliveries = useSelector(selectCompletedDeliveries);
  const stats = useSelector(selectDeliveryStats);
  const deliveryPartner = useSelector(selectDeliveryPartner);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  // Local state
  const [activeTab, setActiveTab] = useState('active');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Fetch active deliveries on component mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchActiveDeliveries(userId));
    }
  }, [dispatch, userId]);

  const refreshDeliveries = async () => {
    if (userId) {
      setRefreshing(true);
      try {
        await dispatch(fetchActiveDeliveries(userId)).unwrap();
      } catch (error) {
        console.error('Failed to refresh deliveries:', error);
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleMarkAsDelivered = (trackId) => {
    navigate("/order/deliveryotp", { 
      state: { trackId, userId } 
    });
  };

  const handleMarkAsShipped = async (trackId) => {
    setActionLoading(prev => ({ ...prev, [trackId]: 'shipping' }));
    try {
      await dispatch(updateDeliveryStatus({
        TrackId: trackId,
        deliveryPartnerId: userId,
        Status: 'shipped'
      })).unwrap();

      dispatch(updateOrderStatusLocal({ trackId, status: 'In Transit' }));
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [trackId]: null }));
    }
  };

  const openNavigation = (order) => {
    // Navigate with order data as state
    navigate('/order/navigate', {
      state: {
        orderData: order,
        pickup: {
          lat: order.deliveryInfo?.pickupLocation?.latitude || 19.1139,
          lng: order.deliveryInfo?.pickupLocation?.longitude || 72.8518,
          address: order.deliveryInfo?.pickupLocation?.address
        },
        delivery: {
          lat: order.shippingAddress?.latitude || order.deliveryLocation?.latitude,
          lng: order.shippingAddress?.longitude || order.deliveryLocation?.longitude,
          address: order.shippingAddress?.fullAddress || order.deliveryLocation?.address
        },
        customer: order.customer,
        trackId: order.trackId
      }
    });
  };

  const toggleExpand = (trackId) => {
    setExpandedOrder(expandedOrder === trackId ? null : trackId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Picked Up': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Header with Stats */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="px-4 py-4">
          {isLoading && !activeDeliveries.length ? (
            <StatsCardSkeleton />
          ) : (
            <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center justify-between gap-4 mb-3">
              {/* Left: Title + Name */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-sm leading-tight">My Deliveries</h1>
                  <p className="text-[11px] text-gray-500">
                    {deliveryPartner?.name || user?.name || 'Delivery Partner'}
                  </p>
                </div>
              </div>

              {/* Middle: Stats inline */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-blue-700">{stats.totalPending}</span>
                  <span className="text-[10px] text-blue-600">Pending</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-green-700">{stats.totalDelivered}</span>
                  <span className="text-[10px] text-green-600">Delivered</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-purple-700">{stats.todayDeliveries}</span>
                  <span className="text-[10px] text-purple-600">Today</span>
                </div>
              </div>

              {/* Right: Refresh Button */}
              <button
                onClick={refreshDeliveries}
                disabled={refreshing || isLoading}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing || isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${activeTab === 'active'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Active ({isLoading && !activeDeliveries.length ? '...' : activeDeliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${activeTab === 'completed'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Completed ({isLoading && !completedDeliveries.length ? '...' : completedDeliveries.length})
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-2xl p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === 'active' && (
          <ActiveDeliveriesTab
            orders={activeDeliveries}
            expandedOrder={expandedOrder}
            toggleExpand={toggleExpand}
            handleMarkAsDelivered={handleMarkAsDelivered}
            handleMarkAsShipped={handleMarkAsShipped}
            openNavigation={openNavigation}
            getStatusColor={getStatusColor}
            navigate={navigate}
            isLoading={isLoading}
            actionLoading={actionLoading}
          />
        )}

        {activeTab === 'completed' && (
          <CompletedDeliveriesTab
            orders={completedDeliveries}
            getStatusColor={getStatusColor}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

// Active Deliveries Tab Component
const ActiveDeliveriesTab = ({
  orders,
  expandedOrder,
  toggleExpand,
  handleMarkAsDelivered,
  handleMarkAsShipped,
  openNavigation,
  getStatusColor,
  navigate,
  isLoading,
  actionLoading
}) => {
  // Show loading skeletons while data is loading
  if (isLoading && !orders.length) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Check if orders is an array and has length
  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Deliveries</h3>
        <p className="text-sm text-gray-500 mb-6">Scan orders to add them to your delivery list</p>
        <button
          onClick={() => navigate('/order/scan')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-2xl transition-colors"
        >
          Scan New Order
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard
          key={order.trackId}
          order={order}
          isExpanded={expandedOrder === order.trackId}
          toggleExpand={() => toggleExpand(order.trackId)}
          onMarkAsDelivered={() => handleMarkAsDelivered(order.trackId)}
          onMarkAsShipped={() => handleMarkAsShipped(order.trackId)}
          onNavigate={() => openNavigation(order)}
          getStatusColor={getStatusColor}
          actionLoading={actionLoading[order.trackId]}
        />
      ))}
    </div>
  );
};

// Completed Deliveries Tab Component
const CompletedDeliveriesTab = ({ orders, getStatusColor, isLoading }) => {
  // Show loading skeletons while data is loading
  if (isLoading && !orders.length) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, index) => (
          <OrderCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Deliveries</h3>
        <p className="text-sm text-gray-500">Delivered orders will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.trackId} className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{order.trackId}</p>
                <p className="text-sm text-gray-500">{order.customerName}</p>
                {order.deliveredAt && (
                  <p className="text-xs text-gray-400">Delivered at {order.deliveredAt}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor('Delivered')}`}>
                Delivered
              </span>
              <p className="text-sm font-semibold text-gray-900 mt-1">₹{order.totalAmount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced Order Card Component with loading states
const OrderCard = ({
  order,
  isExpanded,
  toggleExpand,
  onMarkAsDelivered,
  onMarkAsShipped,
  onNavigate,
  getStatusColor,
  actionLoading
}) => {
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-3xl border-2 transition-all duration-300 ${isExpanded ? "border-blue-200 shadow-lg" : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}>
      {/* Order Header */}
      <div
        onClick={toggleExpand}
        className="flex justify-between cursor-pointer p-3"
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            {order.deliveryInfo?.priority === 'Urgent' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <Clock className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-bold text-gray-900 text-lg">{order.trackId}</p>
              {order.deliveryInfo?.priority && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(order.deliveryInfo.priority)}`}>
                  {order.deliveryInfo.priority}
                </span>
              )}
            </div>
            <div className="flex flex-col space-x-3 mt-1">
              <p className="text-xs text-gray-500">
                Ordered: {formatDate(order.orderDate)}
              </p>
              {order.deliveryInfo?.deliveryWindow && (
                <span className="text-xs bg-blue-50 text-blue-700 py-1 rounded-lg">
                  {order.deliveryInfo.deliveryWindow}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right space-y-1">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
          <p className="text-xs text-gray-500">{order.paymentMethod}</p>
        </div>
      </div>
      {/* Chevron Animation (only visible when collapsed) */}
      {!isExpanded && (
        <div className="w-full flex items-center justify-center">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <ChevronDown className="w-6 h-6 text-gray-600" />
          </motion.div>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Product Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm">
                {order.product?.image ? (
                  <img
                    src={"https://apiari.kuldeepchaurasia.in/Uploads/" + order.product.image}
                    alt={order.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{order.product?.name || 'Product not found'}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="ml-2 font-semibold text-purple-700">₹{order.product?.price || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Qty:</span>
                    <span className="ml-2 font-semibold">{order.qty}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Weight:</span>
                    <span className="ml-2 font-semibold">{order.product?.weight || 'N/A'}</span>
                  </div>
                </div>
                {order.product?.description && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {order.product.description.replace(/['"]/g, '')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                  {order.customer?.profileImage && order.customer?.profileImage !== 'default-avatar.png' ? (
                    <img
                      src={order.customer.profileImage}
                      alt={order.customer?.name || "User"}
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-green-200 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-lg">
                        {order.customer?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="font-bold text-gray-900">{order.customer?.name}</p>
                  <p className="text-sm text-gray-600">{order.customer?.phone}</p>
                  {order.customer?.email !== 'N/A' && order.customer?.email && (
                    <p className="text-xs text-gray-500">{order.customer.email}</p>
                  )}
                  {order.customerRating && (
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-yellow-600">★ {order.customerRating}/5</span>
                    </div>
                  )}
                </div>
              </div>
              <a
                href={`tel:${order.customer?.phone}`}
                className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4">
            <div className="space-y-3">
              {/* Pickup Location */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">PICKUP FROM</p>
                  <p className="font-bold text-gray-900">{order.deliveryInfo?.pickupLocation?.address}</p>
                  <p className="text-sm text-gray-600">{order.deliveryInfo?.pickupLocation?.contactPhone}</p>
                  <p className="text-xs text-gray-500">{order.deliveryInfo?.pickupLocation?.workingHours}</p>
                </div>
              </div>

              {/* Dotted Line */}
              <div className="ml-4 border-l-2 border-dashed border-gray-300 h-4"></div>

              {/* Delivery Location */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mt-1">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-700 uppercase tracking-wide">DELIVER TO</p>
                    <p className="font-bold text-gray-900">{order.shippingAddress?.contactPerson}</p>
                    <p className="text-sm text-gray-700 leading-relaxed mt-1">
                      {order.shippingAddress?.fullAddress}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{order.shippingAddress?.phone}</p>

                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      {order.deliveryInfo?.estimatedDistance && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                          📍 {order.deliveryInfo.estimatedDistance}
                        </span>
                      )}
                      {order.deliveryInfo?.estimatedTime && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                          ⏱️ {order.deliveryInfo.estimatedTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onNavigate}
                  className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-colors shadow-sm"
                >
                  <Navigation className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Timeline */}
          {(order.pickedUpTime || order.shippedTime) && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">DELIVERY TIMELINE</p>
              <div className="space-y-2">
                {order.pickedUpTime && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Picked up at {formatDate(order.pickedUpTime)}</span>
                  </div>
                )}
                {order.shippedTime && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">In transit since {formatDate(order.shippedTime)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-sm text-gray-400">Expected delivery by {formatDate(order.estimatedDeliveryTime)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Special Instructions & Notes */}
          {(order.specialInstructions || order.deliveryNotes || order.isFragile) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-2">SPECIAL NOTES</p>
              <div className="space-y-2">
                {order.isFragile && (
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">⚠️</span>
                    <span className="text-sm font-medium text-red-700">Fragile Item - Handle with care</span>
                  </div>
                )}
                {order.specialInstructions && (
                  <p className="text-sm text-gray-700">{order.specialInstructions}</p>
                )}
                {order.deliveryNotes && (
                  <p className="text-sm text-gray-700">{order.deliveryNotes}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {order.status === 'Picked Up' && (
              <>
                <LoadingButton
                  onClick={onMarkAsShipped}
                  isLoading={actionLoading === 'shipping'}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <Truck className="w-5 h-5" />
                  <span>Mark as In Transit</span>
                </LoadingButton>
                <button
                  onClick={onNavigate}
                  className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Navigate to Customer</span>
                </button>
              </>
            )}

            {order.status === 'In Transit' && (
              <>
                <button
                  onClick={onMarkAsDelivered}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2 mb-3"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Mark as Delivered</span>
                </button>
                <button
                  onClick={onNavigate}
                  className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Navigate to Customer</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};