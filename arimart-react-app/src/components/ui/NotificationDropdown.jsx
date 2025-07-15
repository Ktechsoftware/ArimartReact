import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight } from "lucide-react";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(3);

  const notifications = [
    {
      id: 1,
      title: "Order Shipped",
      message: "Your order #12345 has been shipped",
      time: "2 hours ago",
      read: false,
      icon: "🚚"
    },
    {
      id: 2,
      title: "Special Offer",
      message: "Get 20% off on your next purchase",
      time: "5 hours ago",
      read: false,
      icon: "🎁"
    },
    {
      id: 3,
      title: "New Arrival",
      message: "Check out our new summer collection",
      time: "1 day ago",
      read: true,
      icon: "👕"
    }
  ];

  return (
    <div className="relative">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
      >
        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
          >
            {unreadCount}
          </motion.span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div 
            className="absolute mt-3"
            style={{right:"-150px"}}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Tail element */}
            <div className="relative">
              <div className="absolute -top-2 right-36 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-t border-l border-gray-200 dark:border-gray-700 z-10"></div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {unreadCount} new messages
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl mt-0.5">{notification.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/notification"
                  className="flex items-center justify-between p-4 text-sm font-medium text-blue-600 dark:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition-colors"
                >
                  View all messages
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;