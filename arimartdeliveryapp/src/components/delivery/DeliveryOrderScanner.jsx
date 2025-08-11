import React, { useState } from 'react';
import { Scan, Package, MapPin, Clock, CheckCircle2, Truck, Plus, List } from 'lucide-react';

const DeliveryScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [activeTab, setActiveTab] = useState('scan');

  // Demo order data - ready for pickup
  const availableOrders = {
    "ORD001": {
      id: "ORD001",
      customer: "John Smith",
      address: "123 Main St, Apt 4B",
      city: "Downtown",
      phone: "(555) 123-4567",
      items: 2,
      priority: "Standard",
      estimatedTime: "15 min"
    },
    "ORD002": {
      id: "ORD002",
      customer: "Sarah Johnson",
      address: "456 Oak Avenue",
      city: "Westside",
      phone: "(555) 987-6543",
      items: 1,
      priority: "Express",
      estimatedTime: "8 min"
    },
    "ORD003": {
      id: "ORD003",
      customer: "Mike Davis",
      address: "789 Pine Road, Suite 12",
      city: "Eastside",
      phone: "(555) 456-7890",
      items: 3,
      priority: "Standard",
      estimatedTime: "20 min"
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setShowSuccess(false);

    // Simulate scanning
    setTimeout(() => {
      const orderIds = Object.keys(availableOrders);
      const randomOrderId = orderIds[Math.floor(Math.random() * orderIds.length)];
      const scannedOrder = availableOrders[randomOrderId];
      
      // Check if already in delivery list
      const alreadyAdded = todayDeliveries.find(order => order.id === randomOrderId);
      
      if (!alreadyAdded) {
        const newDelivery = {
          ...scannedOrder,
          scannedAt: new Date().toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: 'Ready'
        };
        setTodayDeliveries([...todayDeliveries, newDelivery]);
        setLastScanned(newDelivery);
        setShowSuccess(true);
      } else {
        setLastScanned({ ...scannedOrder, duplicate: true });
      }
      
      setIsScanning(false);
      
      // Auto hide success after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1500);
  };

  const markAsDelivered = (orderId) => {
    setTodayDeliveries(todayDeliveries.map(order => 
      order.id === orderId 
        ? { ...order, status: 'Delivered', deliveredAt: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) }
        : order
    ));
  };

  const getPriorityColor = (priority) => {
    return priority === 'Express' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
  };

  const totalReady = todayDeliveries.filter(order => order.status === 'Ready').length;
  const totalDelivered = todayDeliveries.filter(order => order.status === 'Delivered').length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="w-6 h-6 text-blue-600 mr-2" />
              <div>
                <h1 className="font-bold text-gray-900">Scan your Orders</h1>
                <p className="text-xs text-gray-500">Today: {totalReady} ready, {totalDelivered} delivered</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && lastScanned && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-green-500 text-white p-3 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <div className="flex-1">
              <p className="font-medium">Order Added!</p>
              <p className="text-sm opacity-90">{lastScanned.id} - {lastScanned.customer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Warning */}
      {lastScanned?.duplicate && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-orange-500 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            <div>
              <p className="font-medium">Already Scanned</p>
              <p className="text-sm opacity-90">{lastScanned.id} is already in your delivery list</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'scan' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500'
            }`}
          >
            <Scan className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Scan</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'list' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-500'
            }`}
          >
            <List className="w-4 h-4 mx-auto mb-1" />
            <span className="text-xs">Deliveries ({todayDeliveries.length})</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'scan' ? (
          /* Scanner Tab */
          <div className="space-y-4">
            {/* Quick Scan Area */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                {/* Compact Scanner */}
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative mb-4">
                  {isScanning ? (
                    <>
                      <div className="absolute inset-3 border border-white rounded">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-400 animate-pulse"></div>
                      </div>
                      <div className="text-white text-sm">Scanning...</div>
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <Scan className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs opacity-75">Point camera at order barcode</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    isScanning
                      ? 'bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {isScanning ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scanning
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Scan Order
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Recent Scans */}
            {todayDeliveries.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-3 border-b">
                  <h3 className="font-medium text-gray-900">Recent Scans</h3>
                </div>
                <div className="divide-y max-h-48 overflow-y-auto">
                  {todayDeliveries.slice(-3).reverse().map((order) => (
                    <div key={order.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900 mr-2">{order.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(order.priority)}`}>
                              {order.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{order.customer}</p>
                          <p className="text-xs text-gray-500">Scanned: {order.scannedAt}</p>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Delivery List Tab */
          <div className="space-y-3">
            {todayDeliveries.length === 0 ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No deliveries scanned yet</p>
                <p className="text-sm text-gray-400">Scan your first order to get started</p>
              </div>
            ) : (
              todayDeliveries.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-semibold text-gray-900 mr-2">{order.id}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </span>
                        </div>
                        <p className="font-medium text-gray-800">{order.customer}</p>
                        <p className="text-sm text-gray-600">{order.phone}</p>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{order.address}, {order.city}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          <span>{order.items} item{order.items > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{order.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Scanned: {order.scannedAt}</span>
                      {order.deliveredAt && <span>Delivered: {order.deliveredAt}</span>}
                    </div>

                    {order.status === 'Ready' && (
                      <button
                        onClick={() => markAsDelivered(order.id)}
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 inline mr-1" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryScanner;