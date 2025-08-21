import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  RefreshCw
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

export const OrdersList = () => {
  const dispatch = useDispatch();
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

  // Mock delivery partner (in real app, get from auth)
  const deliveryPartnerId = deliveryPartner?.id || 1;

  // Fetch active deliveries on component mount
  useEffect(() => {
    dispatch(fetchActiveDeliveries(deliveryPartnerId));
  }, [dispatch, deliveryPartnerId]);

  const refreshDeliveries = () => {
    dispatch(fetchActiveDeliveries(deliveryPartnerId));
  };

  const handleMarkAsDelivered = async (trackId) => {
    try {
      // Update status via API
      await dispatch(updateDeliveryStatus({
        TrackId: trackId,
        DeliveryPartnerId: deliveryPartnerId,
        Status: 'delivered'
      })).unwrap();
      
      // Update local state
      dispatch(updateOrderStatusLocal({ trackId, status: 'Delivered' }));
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  const handleMarkAsShipped = async (trackId) => {
    try {
      await dispatch(updateDeliveryStatus({
        TrackId: trackId,
        DeliveryPartnerId: deliveryPartnerId,
        Status: 'shipped'
      })).unwrap();
      
      dispatch(updateOrderStatusLocal({ trackId, status: 'In Transit' }));
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  const openNavigation = (order) => {
    const customerLat = order.deliveryLocation?.latitude || 28.6139;
    const customerLng = order.deliveryLocation?.longitude || 77.2090;
    
    // Open Google Maps navigation
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${customerLat},${customerLng}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header with Stats */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">My Deliveries</h1>
                <p className="text-sm text-gray-500">
                  {deliveryPartner?.name || 'Delivery Partner'}
                </p>
              </div>
            </div>
            
            <button
              onClick={refreshDeliveries}
              disabled={isLoading}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-blue-700">{stats.totalPending}</div>
              <div className="text-xs text-blue-600">Pending</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-green-700">{stats.totalDelivered}</div>
              <div className="text-xs text-green-600">Delivered</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-purple-700">{stats.todayDeliveries}</div>
              <div className="text-xs text-purple-600">Today</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'active' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active ({activeDeliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'completed' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({completedDeliveries.length})
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
          />
        )}
        
        {activeTab === 'completed' && (
          <CompletedDeliveriesTab 
            orders={completedDeliveries}
            getStatusColor={getStatusColor}
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
  getStatusColor 
}) => {
  const navigate = useNavigate();
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Deliveries</h3>
        <p className="text-sm text-gray-500 mb-6">Scan orders to add them to your delivery list</p>
        <button
          onClick={navigate('/order/scan')}
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
        />
      ))}
    </div>
  );
};

// Completed Deliveries Tab Component
const CompletedDeliveriesTab = ({ orders, getStatusColor }) => {
  if (orders.length === 0) {
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

// Order Card Component
const OrderCard = ({ 
  order, 
  isExpanded, 
  toggleExpand, 
  onMarkAsDelivered, 
  onMarkAsShipped,
  onNavigate,
  getStatusColor 
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 transition-all ${
      isExpanded ? "ring-2 ring-blue-100" : "hover:shadow-sm"
    }`}>
      {/* Order Header */}
      <div
        onClick={toggleExpand}
        className="flex items-center justify-between cursor-pointer p-4"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{order.trackId}</p>
            <p className="text-sm text-gray-500">{order.customerName}</p>
            {order.scannedAt && (
              <p className="text-xs text-gray-400">Added: {order.scannedAt}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <p className="text-sm font-semibold text-gray-900">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-sm text-gray-500">{order.customerPhone}</p>
                </div>
              </div>
              <a 
                href={`tel:${order.customerPhone}`}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Phone className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Delivery Address</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {order.deliveryAddress || order.customerDetails?.address}
                  </p>
                  {order.estimatedDistance && (
                    <p className="text-xs text-blue-600 mt-1">
                      Distance: {order.estimatedDistance}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onNavigate}
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Navigation className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-medium text-gray-600 mb-3">ITEMS TO DELIVER:</p>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white rounded-xl p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {order.status === 'Picked Up' && (
              <>
                <button
                  onClick={onMarkAsShipped}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-colors"
                >
                  Mark as In Transit
                </button>
                <button
                  onClick={onNavigate}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-2xl transition-colors flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate to Customer
                </button>
              </>
            )}
            
            {order.status === 'In Transit' && (
              <button
                onClick={onMarkAsDelivered}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-2xl transition-colors flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};