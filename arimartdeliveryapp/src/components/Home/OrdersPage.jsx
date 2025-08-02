import { AnimatePresence, motion } from "framer-motion";
import {  Package} from "lucide-react";
import { useState } from "react";
import { OrdersList } from "./OrdersList";

export const OrdersPage = () => {
  const [orders] = useState(sampleOrders);
  const [storeType, setStoreType] = useState('meal');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleExpand = (index) => {
    setExpandedOrder(expandedOrder === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Tab Filter */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center px-4 pt-4"
      >
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-xs inline-flex">
          <div className="relative flex">
            <motion.button
              onClick={() => setStoreType("meal")}
              className={`px-5 py-2 rounded-lg z-10 flex items-center text-sm font-medium ${
                storeType === "meal" ? "text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="w-4 h-4 mr-2" />
              Meal
            </motion.button>

            <motion.button
              onClick={() => setStoreType("store")}
              className={`px-5 py-2 rounded-lg z-10 flex items-center text-sm font-medium ${
                storeType === "store" ? "text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Package className="w-4 h-4 mr-2" />
              Store
            </motion.button>

            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-xs"
              initial={false}
              animate={{
                left: storeType === "meal" ? "0%" : "50%",
                width: "50%"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center mt-20 space-y-4 px-4"
        >
          <div className="p-6 bg-blue-50 rounded-full">
            <Package className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-600 font-medium">No Orders Found</p>
          <p className="text-gray-400 text-sm text-center max-w-xs">
            When you receive new orders, they'll appear here
          </p>
        </motion.div>
      ) : (
        <>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 text-center text-gray-400 text-sm mb-2 mt-2 flex items-center justify-center"
          >
            <Package className="w-4 h-4 mr-1.5 text-gray-300" /> 
            Tap to view pickup details
          </motion.p>
          <OrdersList
            orders={orders}
            expandedOrder={expandedOrder}
            toggleExpand={toggleExpand}
          />
        </>
      )}
    </div>
  );
};

const sampleOrders = [
  {
    id: "11250",
    date: "25/08/2023",
    status: "Pickup Pending",
    total: 2300,
    payment: "Paid",
    timeLeft: "1:04 Hrs",
    pickupDeadline: "5:30 PM, Thu, 25/08/2023",
    pickups: [
      {
        centerName: "Pickup Center-1",
        address: "Nikhita Stores, 201/B, Nirant Apts, Andheri East 400069",
        items: [
          { name: "Besan Ladoo", weight: "500g", qty: 2 },
        ],
      },
      {
        centerName: "Pickup Center-2",
        address: "Ananta Stores, 204/C, Apts, Andheri East 400069",
        items: [
          { name: "Atta Ladoo", weight: "500g", qty: 3 },
        ],
      },
    ],
    delivery: {
      name: "Delivery",
      address: "201/D, Ananta Apts, Near Jal Bhawan, Andheri 400069",
    },
  },
];

export default OrdersPage;