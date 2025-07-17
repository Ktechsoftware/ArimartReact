import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle, X, Settings, Clock, ArrowRight, Receipt, Wallet
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  deleteNotification
} from "../../Store/notificationSlice";

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const { list: notifications, unreadCount } = useSelector((state) => state.notifications);
  const [enabled, setEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // true if more pages to load


  useEffect(() => {
    dispatch(fetchNotifications({ page, pageSize: 10 }))
      .unwrap()
      .then((data) => {
        if (!data.notifications || data.notifications.length < 10) {
          setHasMore(false); // No more pages to fetch
        }
      });
  }, [page]);

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);


  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id));
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      new Notification("Notifications enabled!", {
        body: "You’ll now receive real-time updates.",
        icon: "/icon.png",
      });
      setEnabled(true);
    } else {
      console.warn("🚫 Notification permission denied.");
    }
  };

  const getIconByTitle = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes("order")) return <Receipt className="text-blue-600" size={20} />;
    if (lower.includes("payment")) return <Wallet className="text-green-600" size={20} />;
    return <Bell className="text-gray-500" size={20} />;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
  };

  const observerRef = useRef();

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore]);
 
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-white dark:bg-gray-900 min-h-screen">
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h1>
        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
          <Settings size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {!enabled ? (
          <motion.div>
            {/* Notification setup logic */}
          </motion.div>
        ) : notifications.length === 0 ? (
          <motion.div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
            <CheckCircle size={48} className="text-blue-500 animate-pulse" />
            <p className="text-lg font-medium text-gray-800 dark:text-white">No notifications yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Your notifications will appear here once received.
            </p>
          </motion.div>
        ) : (
          <motion.div className="space-y-4">
            <motion.div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              {["all", "unread"].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex-1 ${activeTab === tab
                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-800 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                  {tab === "all" ? "All" : "Unread"}
                </motion.button>
              ))}
            </motion.div>

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
                        <div className="mt-1">{getIconByTitle(n.title)}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            {n.urlt ? (
                              <Link to={n.urlt} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                {n.title}
                              </Link>
                            ) : (
                              <h3 className={`font-medium ${n.read ? "text-gray-700 dark:text-gray-300" : "text-gray-800 dark:text-white"}`}>
                                {n.title}
                              </h3>
                            )}
                            {!n.read && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 bg-blue-500 rounded-full"
                              />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{n.message || n.body}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(n.addedDate || n.createdAt || n.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!n.read && (
                          <motion.button
                            onClick={() => handleMarkAsRead(n.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-gray-500 hover:text-blue-500"
                          >
                            <CheckCircle size={18} />
                          </motion.button>
                        )}
                        <motion.button
                          onClick={() => handleDeleteNotification(n.id)}
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
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={observerRef} className="h-8" />
    </div>
  );
}
