import React, { useState, useEffect } from 'react';
import { Scan, Package, AlertCircle, CheckCircle2, Truck } from 'lucide-react';

const DeliveryPartnerApp = ({ onOrderScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [manualOrderId, setManualOrderId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [deliveryPartnerId] = useState(101); // Current logged in delivery partner

  // Demo data matching your backend structure
  const availableOrders = {
    "ORD-181540A9": {
      trackId: "ORD-181540A9",
      orderDate: "2025-08-18T10:30:00Z",
      totalItems: 2,
      totalAmount: 850.00,
      status: "Assigned",
      customerDetails: {
        name: "Rajesh Kumar",
        phone: "+91 9876543210",
        address: "A-123, Sector 15, Noida, UP - 201301",
        latitude: 28.5355,
        longitude: 77.3910
      },
      items: [
        {
          id: 1,
          qty: 2,
          productName: "Basmati Rice Premium",
          price: 250.00,
          unit: "1kg",
          categoryName: "Groceries"
        },
        {
          id: 2,
          qty: 3,
          productName: "Fresh Milk",
          price: 50.00,
          unit: "500ml",
          categoryName: "Dairy"
        }
      ]
    },
    "ORD-181545B2": {
      trackId: "ORD-181545B2",
      orderDate: "2025-08-18T11:15:00Z",
      totalItems: 1,
      totalAmount: 420.00,
      status: "Assigned",
      customerDetails: {
        name: "Priya Sharma",
        phone: "+91 8765432109",
        address: "B-456, DLF Phase 3, Gurgaon, HR - 122002",
        latitude: 28.4595,
        longitude: 77.0266
      },
      items: [
        {
          id: 3,
          qty: 1,
          productName: "Organic Vegetables Box",
          price: 420.00,
          unit: "1 box",
          categoryName: "Vegetables"
        }
      ]
    },
    "ORD-181550C7": {
      trackId: "ORD-181550C7",
      orderDate: "2025-08-18T12:00:00Z",
      totalItems: 4,
      totalAmount: 1250.00,
      status: "Assigned",
      customerDetails: {
        name: "Amit Singh",
        phone: "+91 7654321098",
        address: "C-789, Dwarka Sector 21, New Delhi - 110075",
        latitude: 28.5921,
        longitude: 77.0460
      },
      items: [
        {
          id: 4,
          qty: 2,
          productName: "Chicken Fresh",
          price: 300.00,
          unit: "1kg",
          categoryName: "Meat"
        },
        {
          id: 5,
          qty: 1,
          productName: "Bread Whole Wheat",
          price: 45.00,
          unit: "1 loaf",
          categoryName: "Bakery"
        }
      ]
    }
  };

  const processOrder = (trackId) => {
    const orderData = availableOrders[trackId];
    
    if (!orderData) {
      setLastScanned({ error: true, message: "Order not found" });
      return;
    }

    const newDelivery = {
      ...orderData,
      scannedAt: new Date().toLocaleTimeString('en-IN', { 
        hour12: false,
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: 'Picked Up',
      deliveryPartnerId: deliveryPartnerId
    };

    // Call the parent callback to add order to main list
    if (onOrderScanned) {
      onOrderScanned(newDelivery);
    }

    setLastScanned(newDelivery);
    setShowSuccess(true);
  };

  const startScan = () => {
    setIsScanning(true);
    setShowSuccess(false);

    // Simulate scanning
    setTimeout(() => {
      const orderIds = Object.keys(availableOrders);
      const randomOrderId = orderIds[Math.floor(Math.random() * orderIds.length)];
      processOrder(randomOrderId);
      setIsScanning(false);
      
      // Auto hide success after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handleManualEntry = () => {
    if (!manualOrderId.trim()) return;
    
    processOrder(manualOrderId.trim());
    setManualOrderId('');
    setShowManualInput(false);
    
    // Auto hide success after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Auto-hide success messages
  useEffect(() => {
    if (showSuccess || lastScanned?.error) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setLastScanned(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, lastScanned]);

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-16">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Order Scanner</h1>
                <p className="text-sm text-gray-500">Scan orders to add to delivery list</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString('en-IN')}</p>
              <p className="text-xs text-gray-500">Partner ID: {deliveryPartnerId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && lastScanned && !lastScanned.error && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-3" />
            <div className="flex-1">
              <p className="font-semibold">Order Added for Delivery!</p>
              <p className="text-sm opacity-90">{lastScanned.trackId} - {lastScanned.customerDetails?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {lastScanned?.error && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-3" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm opacity-90">{lastScanned.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Scanner Area */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="font-semibold text-gray-800 mb-4 text-center">Scan Order Barcode</h2>
            
            {/* Scanner Viewfinder */}
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative mb-6">
              {isScanning ? (
                <>
                  <div className="absolute inset-4 border-2 border-white rounded-lg">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400"></div>
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-400 animate-pulse"></div>
                  </div>
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">Scanning for orders...</p>
                  </div>
                </>
              ) : (
                <div className="text-center text-white">
                  <Scan className="w-12 h-12 mx-auto mb-3 opacity-60" />
                  <p className="text-sm opacity-80">Point camera at order barcode</p>
                </div>
              )}
            </div>

            {/* Scan Button */}
            <button
              onClick={startScan}
              disabled={isScanning}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all mb-3 ${
                isScanning
                  ? 'bg-gray-400'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {isScanning ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scanning...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Scan className="w-5 h-5 mr-2" />
                  Start Scanning
                </div>
              )}
            </button>

            {/* Manual Entry Toggle */}
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="w-full py-2 text-sm text-blue-600 font-medium"
            >
              Can't scan? Enter Order ID manually
            </button>

            {/* Manual Input */}
            {showManualInput && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Order ID (Track ID)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualOrderId}
                    onChange={(e) => setManualOrderId(e.target.value)}
                    placeholder="e.g., ORD-181540A9"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleManualEntry}
                    disabled={!manualOrderId.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium disabled:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start">
            <Package className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">How to use:</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Scan the barcode on each order package to add it to your delivery list. 
                Once scanned, the order will appear in your delivery list where you can 
                navigate to customers and mark orders as delivered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerApp;