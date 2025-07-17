import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, CheckCircle, X, ShoppingBag, CreditCard, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteNotification, markAsRead } from "../../Store/notificationSlice";

const NotificationIcon = ({ title }) => {
  const iconSize = 16;
  const iconClass = "text-white";

  if (title.includes('%order%') || title.toLowerCase().includes('order')) {
    return (
      <div className="bg-purple-500 p-2 rounded-full">
        <ShoppingBag size={iconSize} className={iconClass} />
      </div>
    );
  }

  if (title.toLowerCase().includes('payment')) {
    return (
      <div className="bg-green-500 p-2 rounded-full">
        <CreditCard size={iconSize} className={iconClass} />
      </div>
    );
  }

  if (title.toLowerCase().includes('success')) {
    return (
      <div className="bg-blue-500 p-2 rounded-full">
        <CheckCircle size={iconSize} className={iconClass} />
      </div>
    );
  }

  // Default icon
  return (
    <div className="bg-gray-500 p-2 rounded-full">
      <Bell size={iconSize} className={iconClass} />
    </div>
  );
};

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useSelector(state => state.notifications.list);
  const unreadCount = useSelector(state => state.notifications.unreadCount);
  const dispatch = useDispatch();

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  return (
    <div className="relative">
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsOpen(true)}
      >
        <Bell className="w-5 h-5 dark:text-blue-300" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full"
          >
            {unreadCount}
          </motion.span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div
            className="absolute mt-3 z-50"
            style={{ right: "-150px" }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="relative">
              <div className="absolute -top-2 right-36 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-t border-l border-gray-200 dark:border-gray-700 z-10"></div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {unreadCount > 0
                      ? `${unreadCount} new message${unreadCount !== 1 ? 's' : ''}`
                      : 'No new messages'}
                  </p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <NotificationIcon title={notification.title} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {notification.title.replace('%order%', '')}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                {new Date(notification.addedDate).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                              {notification.message}
                            </p>

                            {notification.urlt && (
                              <a
                                href={notification.urlt}
                                className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                View details
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center p-8 text-center"
                    >
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        className="mb-4"
                      >
                        <Mail
                          size={48}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </motion.div>
                      <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
                        No notifications yet
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        We'll notify you when something arrives
                      </p>
                    </motion.div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <Link
                    to="/notification"
                    className="flex items-center justify-between p-4 text-sm font-medium text-blue-600 dark:text-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition-colors"
                  >
                    View all messages
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;