import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, QrCode, PackageCheck, AlertCircle, Loader2, Plus } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  scanOrderForDelivery,
  addManualOrder,
  clearMessages,
  resetScanState,
  setScanningState,
  selectIsLoading,
  selectError,
  selectSuccessMessage,
  selectScanResult,
  selectDeliveryPartner
} from '../../Store/deliveryOrderSlice'

export const DeliveryScanPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);
  const scanResult = useSelector(selectScanResult);
  const deliveryPartner = useSelector(selectDeliveryPartner);
  
  // Local state
  const [scannedData, setScannedData] = useState("");
  const [manualEntry, setManualEntry] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);

  // Mock delivery partner ID (in real app, get from auth/login)
  const deliveryPartnerId = deliveryPartner?.id || 1;

  // Initialize QR Scanner
  useEffect(() => {
    if (!scannerActive || scannedData || scanResult) return;

    dispatch(setScanningState(true));

    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    });

    scanner.render(
      (decodedText) => {
        console.log("QR/Barcode scanned:", decodedText);
        setScannedData(decodedText);
        setScannerActive(false);
        dispatch(setScanningState(false));
        
        // Auto-confirm scan
        handleConfirmScan(decodedText);
        scanner.clear();
      },
      (scanErr) => {
        // Silent error handling for continuous scanning
      }
    );

    return () => {
      scanner.clear().catch((e) => console.error("Scanner cleanup error:", e));
      dispatch(setScanningState(false));
    };
  }, [scannerActive, scannedData, scanResult, dispatch]);

  const handleConfirmScan = (trackId) => {
    if (!trackId.trim()) {
      dispatch({ type: 'delivery/setError', payload: 'Please enter or scan a valid Track ID' });
      return;
    }

    // Dispatch scan action
    dispatch(scanOrderForDelivery({ 
      trackId: trackId.trim(), 
      deliveryPartnerId 
    }));
  };

  const handleManualConfirm = () => {
    if (!manualEntry.trim()) {
      dispatch({ type: 'delivery/setError', payload: 'Please enter a valid Track ID' });
      return;
    }

    handleConfirmScan(manualEntry);
  };

  const handleManualAdd = () => {
    if (!manualEntry.trim()) {
      dispatch({ type: 'delivery/setError', payload: 'Please enter a valid Track ID' });
      return;
    }

    // Add order manually (mock order details - in real app, fetch from API)
    const mockOrderDetails = {
      id: Date.now(),
      trackId: manualEntry.trim(),
      customerName: "Customer Name",
      deliveryAddress: "Customer Address",
      customerPhone: "+91 XXXXXXXXXX",
      totalAmount: 299,
      items: [{ name: "Sample Product", qty: 1, price: 299 }]
    };

    dispatch(addManualOrder({ 
      trackId: manualEntry.trim(), 
      orderDetails: mockOrderDetails 
    }));
    
    setManualEntry("");
    setShowManualEntry(false);
  };

  const startNewScan = () => {
    dispatch(resetScanState());
    dispatch(clearMessages());
    setScannedData("");
    setManualEntry("");
    setShowManualEntry(false);
    setScannerActive(true);
  };

  const toggleManualEntry = () => {
    setShowManualEntry(!showManualEntry);
    setScannerActive(false);
    dispatch(clearMessages());
  };

  // Success state
  if (scanResult || successMessage) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Assigned Successfully!
          </h2>
          
          <p className="text-sm text-gray-600 mb-4">
            {successMessage || "Order has been added to your delivery list"}
          </p>

          {scanResult?.orderDetails && (
            <div className="bg-gray-50 rounded-2xl p-4 text-left mb-6 border">
              <p className="text-xs font-medium text-gray-500 mb-2">ORDER DETAILS</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Track ID:</span>
                  <span className="text-sm font-medium">{scanResult.orderDetails.trackId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="text-sm font-medium">{scanResult.orderDetails.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium">₹{scanResult.orderDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={startNewScan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-2xl transition-colors"
          >
            Scan Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Scan Order</h1>
        <p className="text-sm text-gray-600">Scan QR code or enter Track ID manually</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Toggle Buttons */}
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
        <button
          onClick={() => {
            setScannerActive(true);
            setShowManualEntry(false);
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
            !showManualEntry 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <QrCode className="w-4 h-4 inline mr-2" />
          QR Scan
        </button>
        <button
          onClick={toggleManualEntry}
          className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
            showManualEntry 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Manual Entry
        </button>
      </div>

      {/* QR Scanner */}
      {!showManualEntry && (
        <div className="mb-6">
          <div 
            id="reader" 
            className="rounded-2xl overflow-hidden shadow-sm border bg-gray-50"
            style={{ minHeight: scannerActive ? '300px' : '200px' }}
          >
            {!scannerActive && (
              <div className="flex flex-col items-center justify-center h-48">
                <QrCode className="w-12 h-12 text-gray-400 mb-3" />
                <button
                  onClick={() => setScannerActive(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-2xl transition-colors"
                >
                  Start Scanning
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            {scannerActive ? 'Point camera at QR code or barcode' : 'Click to start camera'}
          </p>
        </div>
      )}

      {/* Manual Entry */}
      {showManualEntry && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Track ID / Order ID
            </label>
            <input
              type="text"
              placeholder="Enter Track ID (e.g., ORD-123456)"
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-center font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleManualConfirm}
              disabled={isLoading || !manualEntry.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-2xl transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <PackageCheck className="w-4 h-4 mr-2" />
              )}
              Assign Order
            </button>
            
            <button
              onClick={handleManualAdd}
              disabled={!manualEntry.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-2xl transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Manually
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            "Assign Order" fetches from server • "Add Manually" adds to your list
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Processing order...</p>
        </div>
      )}
    </div>
  );
};