  import { Clock, ChevronRight, Star } from "lucide-react";
  import { motion, AnimatePresence } from "framer-motion";
  import { useState } from "react";

  const orders = [
    {
      id: 1,
      name: "Dharma Coffee, Ubud",
      time: "Today, 3:39 PM",
      rating: 4.2,
      image: "/images/coffee-shop-1.jpg"
    },
    {
      id: 2,
      name: "Outpost Ubud Cliving",
      time: "Today, 3:40 PM",
      rating: 4.2,
      image: "/images/coffee-shop-2.jpg"
    },
    {
      id: 3,
      name: "Capuccino Coffee, Ubud",
      time: "Today, 3:49 PM",
      rating: 4.2,
      image: "/images/coffee-shop-3.jpg"
    },
    {
      id: 4,
      name: "Anomali Coffee, Ubud",
      time: "Today, 4:09 PM",
      rating: 4.2,
      image: "/images/coffee-shop-4.jpg"
    },
  ];

  const tabs = ["History", "Pending", "Ongoing", "Delivered", "Cancelled"];
  const subTabs = ["All", "Food", "Pay"];

  export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState("History");
    const [activeSubTab, setActiveSubTab] = useState("All");

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto min-h-screen bg-white dark:bg-gray-900 p-4 text-gray-800 dark:text-white"
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full border text-sm font-medium ${
                tab === activeTab
                  ? "bg-black text-white border-black dark:bg-indigo-600 dark:border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Sub-tabs */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 text-xs mb-4"
        >
          {subTabs.map((sub) => (
            <motion.button
              key={sub}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-full font-medium ${
                sub === activeSubTab
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setActiveSubTab(sub)}
            >
              {sub}
            </motion.button>
          ))}
        </motion.div>

        {/* Payment Promo Box */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2 }}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/50 dark:to-indigo-800/50 text-indigo-800 dark:text-indigo-100 rounded-xl mb-6 shadow-sm"
        >
          <div>
            <p className="font-medium text-sm">Pay Transactions</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">Enjoy extra benefits in your trip</p>
          </div>
          <motion.div whileHover={{ x: 2 }}>
            <ChevronRight className="text-indigo-600 dark:text-indigo-300" />
          </motion.div>
        </motion.div>

        {/* Orders List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300 }}
                whileHover={{ y: -3 }}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start gap-3">
                  <motion.img 
                    src={order.image}
                    alt={order.name}
                    className="w-14 h-14 rounded-lg object-cover"
                    whileHover={{ scale: 1.05 }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="font-semibold text-sm">{order.name}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Clock className="inline mr-1" size={12} />
                          Delivered • {order.time}
                        </p>
                      </div>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <ChevronRight className="text-gray-400" size={18} />
                      </motion.div>
                    </div>
                    <motion.div 
                      className="flex items-center text-xs mt-3 gap-1 text-gray-500 dark:text-gray-400"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span>You rated this</span>
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{order.rating}</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </motion.div>
    );
  }