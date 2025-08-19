import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ChevronDown,
  Package,
  CheckCircle2,
  ChevronUp,
  Calendar,
  User,
  Navigation,
  Truck
} from 'lucide-react';

export const OrdersList = ({ 
  orders = [], 
  expandedOrder, 
  toggleExpand,
  onMarkDelivered,
  onNavigateToCustomer 
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const statusStyles = {
    'Pickup Pending': 'bg-pink-100 text-pink-700',
    'Pickup Failed': 'bg-red-100 text-red-800',
    'Pickup Rescheduled': 'bg-blue-100 text-blue-800',
    'Delivery Failed': 'bg-red-100 text-red-800',
    'Delivery Pending': 'bg-amber-100 text-amber-800',
    'Delivery Rescheduled': 'bg-blue-100 text-blue-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Paid': 'bg-green-100 text-green-800',
    'Picked Up': 'bg-blue-100 text-blue-700',
    'Assigned': 'bg-orange-100 text-orange-700'
  };

  const statusOptions = [
    'Select an option',
    'In Transit',
    'Picked Up',
    'Delayed',
    'Unable to Pickup'
  ];

  const warehouseLocation = {
    latitude: 28.6139,
    longitude: 77.2090,
    address: "Arimart Warehouse, Connaught Place, Delhi"
  };

  const openNavigation = (order) => {
    if (onNavigateToCustomer) {
      onNavigateToCustomer(order);
    } else {
      const { latitude, longitude } = order.customerDetails || order.delivery;
      const googleMapsUrl = `https://www.google.com/maps/dir/${warehouseLocation.latitude},${warehouseLocation.longitude}/${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  const markAsDelivered = (order) => {
    if (onMarkDelivered) {
      onMarkDelivered(order.trackId || order.id);
    }
  };

  const totalReady = orders.filter(order => 
    order.status === 'Picked Up' || order.status === 'Pickup Pending'
  ).length;
  const totalDelivered = orders.filter(order => order.status === 'Delivered').length;

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h1 className="font-bold text-gray-900 text-lg">My Deliveries</h1>
                <p className="text-sm text-gray-500">{totalReady} pending • {totalDelivered} delivered</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-IN')}</p>
              <p className="text-xs text-gray-500">Total Orders: {orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-500 mb-2">No deliveries yet</p>
            <p className="text-sm text-gray-400">Scan your first order to start delivering</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.trackId || order.id}
              className={`rounded-xl bg-white shadow-xs border border-gray-100 transition-all ${
                expandedOrder === index ? "ring-2 ring-blue-100" : "hover:shadow-sm"
              }`}
            >
              {/* Order Header - Always Visible */}
              <div
                onClick={() => toggleExpand(index)}
                className="flex items-center justify-between cursor-pointer p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.trackId || `Order #${order.id}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> 
                      {order.date || new Date(order.orderDate).toLocaleDateString('en-IN')}
                    </p>
                    {order.scannedAt && (
                      <p className="text-xs text-blue-600 mt-0.5">Scanned: {order.scannedAt}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}>
                    {order.status}
                  </span>
                  {expandedOrder === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedOrder === index && (
                <div className="px-4 pb-4 space-y-4">
                  {/* Customer Info */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.customerDetails?.name || 'Customer Name'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.customerDetails?.phone || order.phone || 'Phone not available'}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={`tel:${order.customerDetails?.phone || order.phone || ''}`}
                        className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm"
                      >
                        <Phone className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mt-1">
                          <MapPin className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">Delivery Address</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {order.customerDetails?.address || order.delivery?.address || 'Address not available'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openNavigation(order)}
                        className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  {order.items && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <p className="text-xs font-medium text-gray-600 mb-3">ITEMS TO DELIVER:</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white rounded-xl p-3 mb-2 last:mb-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {item.productName || item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.qty} • {item.unit || item.weight}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pickup Centers for original order structure */}
                  {order.pickups && (
                    <div className="space-y-3">
                      {order.pickups.map((pickup, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{pickup.centerName}</p>
                                <p className="text-xs text-gray-500 mt-1">{pickup.address}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Phone className="w-4 h-4 text-white" />
                              </button>
                              <button className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          </div>
                          
                          {pickup.items.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 bg-white rounded-xl p-3 mb-2 last:mb-0">
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <div className={`w-8 h-8 rounded-full ${item.name.includes('Besan') ? 'bg-yellow-400' : 'bg-yellow-600'}`}></div>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.weight}</p>
                                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">₹ {order.totalAmount || order.total}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {order.payment || 'Paid'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Time Alert */}
                  {order.pickupDeadline && order.timeLeft && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-red-800">Delivery Pickup By</p>
                          <p className="text-xs text-gray-600 mt-1">Tomorrow</p>
                          <p className="text-sm font-semibold text-gray-900">{order.pickupDeadline}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800">TIME LEFT</span>
                          </div>
                          <div className="bg-red-100 px-3 py-1 rounded-full">
                            <span className="text-sm font-bold text-red-800">{order.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Update Status Dropdown */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-red-600">Update Status</p>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left shadow-sm"
                      >
                        <span className="text-sm text-gray-600">
                          {selectedStatus || 'Select an option'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                          {statusOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedStatus(option === 'Select an option' ? '' : option);
                                setShowDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {order.status === 'Picked Up' && (
                      <>
                        <button
                          onClick={() => openNavigation(order)}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-2xl transition-colors flex items-center justify-center"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate to Customer
                        </button>
                        <button
                          onClick={() => markAsDelivered(order)}
                          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-2xl transition-colors flex items-center justify-center"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Delivered
                        </button>
                      </>
                    )}
                    
                    {order.status === 'Delivered' && (
                      <div className="text-center py-3">
                        <span className="text-sm text-green-600 font-medium">
                          ✅ Delivered {order.deliveredAt ? `at ${order.deliveredAt}` : ''}
                        </span>
                      </div>
                    )}

                    {/* Confirm Pickup Button for original order structure */}
                    {(order.status === 'Pickup Pending' || order.pickups) && (
                      <button
                        onClick={() => markAsDelivered(order)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 rounded-2xl shadow-lg"
                      >
                        Confirm Pickup
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};