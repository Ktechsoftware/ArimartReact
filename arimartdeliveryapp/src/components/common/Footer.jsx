import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Package, User } from "lucide-react";

export const Footer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-sm p-3 flex justify-center z-30"
    >
      <div className="flex gap-2 max-w-md w-full">
        <button
          onClick={() => {
            navigate("/orders");
            setActiveTab("orders");
          }}
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === "orders" 
              ? "bg-blue-50 text-blue-600 shadow-inner" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Package className={`w-5 h-5 ${activeTab === "orders" ? "text-blue-600" : "text-gray-500"}`} />
          <span className="text-xs mt-1 font-medium">Orders</span>
        </button>

        <button
          onClick={() => {
            navigate("/account");
            setActiveTab("account");
          }}
          className={`flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === "account" 
              ? "bg-blue-50 text-blue-600 shadow-inner" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === "account" ? "text-blue-600" : "text-gray-500"}`} />
          <span className="text-xs mt-1 font-medium">Account</span>
        </button>
      </div>
    </motion.div>
  );
};