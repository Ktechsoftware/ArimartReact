import { useEffect, useState } from "react";
import { CheckCircle, QrCode, PackageCheck } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const DeliveryScanPage = () => {
  const [scannedData, setScannedData] = useState("");
  const [manualEntry, setManualEntry] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  // Start scanner
  useEffect(() => {
  if (confirmed || scannedData) return;

  const scanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250,
    // supportedScanTypes: [Html5QrcodeScanner.SCAN_TYPE_CAMERA] ❌ Remove this
  });

  scanner.render(
    (decodedText) => {
      console.log("Scanned:", decodedText);
      setScannedData(decodedText);
      scanner.clear();
    },
    (scanErr) => {
      console.warn("Scan Error:", scanErr);
    }
  );

  return () => {
    scanner.clear().catch((e) => console.error("Cleanup error", e));
  };
}, [confirmed, scannedData]);


  const handleConfirm = () => {
    const orderId = scannedData || manualEntry;
    if (!orderId) return setError("Enter or scan a valid Order ID.");
    setConfirmed(true);
    // TODO: Send API request to confirm delivery
    console.log("Delivery confirmed for order:", orderId);
  };

  return (
    <div className="p-6">
      {!confirmed ? (
        <>
          <h2 className="text-lg font-semibold text-center mb-4">Scan QR / Barcode</h2>
          <div id="reader" className="mx-auto max-w-sm rounded overflow-hidden shadow" />
          <p className="text-sm text-gray-400 text-center mt-2">Supports QR + Barcodes</p>

          <div className="my-6 text-center">
            <p className="text-sm text-gray-500 mb-1">Or enter Order ID manually</p>
            <input
              type="text"
              placeholder="Enter Order ID"
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full max-w-sm mx-auto text-center"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            onClick={handleConfirm}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full block mx-auto"
          >
            Confirm Delivery
          </button>
        </>
      ) : (
        <div className="text-center mt-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-green-700">Delivery Confirmed</p>

          <div className="bg-gray-100 mt-4 p-4 rounded-lg text-left max-w-sm mx-auto">
            <p className="text-gray-600 text-sm mb-1">Order ID:</p>
            <p className="text-black font-semibold">{scannedData || manualEntry}</p>
          </div>

          <button
            className="mt-6 text-blue-500 underline"
            onClick={() => {
              setScannedData("");
              setManualEntry("");
              setConfirmed(false);
              setError("");
            }}
          >
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
};
