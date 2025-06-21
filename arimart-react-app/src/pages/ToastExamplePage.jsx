import { useState } from "react";
import Toast from "../components/ui/Toast";

const ToastExamplePage = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [toastMessage, setToastMessage] = useState("");

  const showNotification = (type, message) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        <button onClick={() => showNotification("success", "Order placed successfully!")} className="px-4 py-2 bg-green-500 text-white rounded">Success</button>
        <button onClick={() => showNotification("error", "Failed to process payment")} className="px-4 py-2 bg-red-500 text-white rounded">Error</button>
        <button onClick={() => showNotification("info", "New feature available")} className="px-4 py-2 bg-blue-500 text-white rounded">Info</button>
        <button onClick={() => showNotification("warning", "Low inventory warning")} className="px-4 py-2 bg-yellow-500 text-white rounded">Warning</button>
      </div>

      {showToast && (
        <Toast
          type={toastType}
          message={toastMessage}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ToastExamplePage;
