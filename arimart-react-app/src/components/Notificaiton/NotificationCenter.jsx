import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, X, Settings, Clock, ArrowRight } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    title: "Vista rewards club",
    body: "Earn points without making a purchase. Complete your 1st mission today.",
    date: "Dec 16, 2023",
    read: false,
    icon: "🎯"
  },
  {
    id: 2,
    title: "The Vista rewards club",
    body: "Keep paying with Vista to boost your points and unlock rewards.",
    date: "Dec 12, 2023",
    read: true,
    icon: "💰"
  },
  {
    id: 3,
    title: "The Vista rewards club",
    body: "You're now a member of Vista rewards. Start picking up points.",
    date: "Dec 8, 2023",
    read: true,
    icon: "🎉"
  },
];

export default function NotificationCenter() {
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const markAsRead = (id) => {
    setNotifications(notifs =>
      notifs.map(n => n.id === id ? { ...n, read: true } : n)
    )
  };

  const deleteNotification = (id) => {
    setNotifications(notifs => notifs.filter(n => n.id !== id));
  };
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      // Optional: Show a test notification
      new Notification("Notifications enabled!", {
        body: "You’ll now receive real-time updates.",
        icon: "/icon.png", // optional
      });
    } else if (permission === "denied") {
      console.warn("🚫 Notification permission denied.");
    } else {
      console.log("ℹ️ Notification permission dismissed.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white"></h1>
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <Settings size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {!enabled ? (
          // Notification Setup
          <motion.div
            key="setup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-2xl shadow-lg space-y-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  transition: { repeat: Infinity, duration: 3 }
                }}
                onClick={requestNotificationPermission}
                className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full"
              >
                <Bell className="text-blue-600 dark:text-blue-400" size={24} />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Enable Notifications
              </h3>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 pl-2">
              {[
                "Your payment is due",
                "New purchase confirmation",
                "Order delivery updates",
                "Personalized deals and offers"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={16} className="text-green-500" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={() => setEnabled(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl text-sm font-medium shadow-lg"
              >
                Enable Notifications
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 text-sm border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-xl"
              >
                Later
              </motion.button>
            </div>
          </motion.div>
        ) : notifications.length === 0 ? (
          // Empty State
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col items-center justify-center h-80 text-center space-y-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, duration: 2 }
              }}
            >
              <CheckCircle size={48} className="text-blue-500" />
            </motion.div>
            <p className="text-lg font-medium text-gray-800 dark:text-white">
              No notifications yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Your notifications will appear here once received
            </p>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-2"
            >
              View history <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        ) : (
          // Notifications List
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Tabs */}
            <motion.div
              className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {["all", "unread"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex-1 ${activeTab === tab
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                    }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tab === "all" ? "All" : "Unread"}
                </motion.button>
              ))}
            </motion.div>

            {/* Notifications */}
            <AnimatePresence>
              {notifications
                .filter(n => activeTab === "all" || !n.read)
                .map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`p-4 rounded-xl shadow-sm ${n.read
                        ? "bg-gray-50 dark:bg-gray-800/50"
                        : "bg-blue-50 dark:bg-blue-900/20"
                      } border ${n.read
                        ? "border-gray-200 dark:border-gray-700"
                        : "border-blue-200 dark:border-blue-800"
                      }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-1">{n.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${n.read
                                ? "text-gray-700 dark:text-gray-300"
                                : "text-gray-800 dark:text-white"
                              }`}>
                              {n.title}
                            </h3>
                            {!n.read && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-blue-500 rounded-full"
                              />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {n.body}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {n.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!n.read && (
                          <motion.button
                            onClick={() => markAsRead(n.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-gray-500 hover:text-blue-500"
                          >
                            <CheckCircle size={18} />
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => deleteNotification(n.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-gray-500 hover:text-red-500"
                        >
                          <X size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6"
            >
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1"
              >
                View all notifications <ArrowRight size={16} />
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}