import { motion } from "framer-motion";
import { useState } from "react";
import {
  Package,
  Wallet,
  Heart,
  Store,
  MapPin,
  Gift,
  Star,
  LogOut,
  Share2,
  Edit,
  ChevronRight,
  User, SunMoon
} from "lucide-react";
import LogoutModal from "../Auth/LogoutModal";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import FeedbackModal from "./FeedbackModal";
import DeliveryAddressModal from "./DeliveryAddressModal";

const settings = [
  { label: "Theme", icon: <SunMoon size={20} />, to: "#", isTheme: true },
  { label: "My Orders", icon: <Package size={20} />, to: "/orders" },
  { label: "My Wallet", icon: <Wallet size={20} />, to: "/home/wallet" },
  { label: "Wishlist", icon: <Heart size={20} />, to: "/wishlist" },
  { label: "Followed Shop", icon: <Store size={20} />, to: "#" },
  { label: "Delivery Address", icon: <MapPin size={20} />, to: "#" },
  { label: "Share & Earn", icon: <Share2 size={20} />, to: "/home/referandearn" },
  { label: "Promocodes & Gift Cards", icon: <Gift size={20} />, to: "/promocodes" },
  { label: "Rate Us", icon: <Star size={20} />, to: "#" },
  { label: "Logout", icon: <LogOut size={20} />, to: "#", isDestructive: true },
];

const AccountSettings = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const [isRateus, setIsRateus] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto min-h-screen  dark:from-gray-900 dark:to-gray-800 p-4 text-gray-800 dark:text-white"
    >
      {/* Profile Header */}
      <Link to="/account/editprofile">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center text-white">
                <User size={24} />
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 p-1 rounded-full shadow-md"
              >
                <Edit size={14} className="text-red-500" />
              </motion.button>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">Yogesh</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">+91 9876543210</p>
            </div>
          </div>
          <ChevronRight className="text-gray-400" />
        </motion.div>
      </Link>
      {/* Settings List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {settings.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (item.label === "Logout") setShowModal(true);
              else if (item.label === "Rate Us") setIsRateus(true);
              else if (item.label === "Delivery Address") setShowAddressModal(true);
              else if (item.isTheme) setThemeSelectorOpen(true);
              else navigate(item.to);
            }}

            className={`flex items-center justify-between p-4 cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all ${item.isDestructive
              ? 'hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className={`p-2 rounded-lg ${item.isDestructive
                  ? 'bg-red-100 dark:bg-red-900/50 text-red-500'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                whileHover={{ rotate: 10 }}
              >
                {item.icon}
              </motion.div>
              <span
                className={`text-sm font-medium ${item.isDestructive ? 'text-red-500' : ''
                  }`}
              >
                {item.label}
              </span>
            </div>
            <ChevronRight className="text-gray-400" size={18} />
          </motion.div>
        ))}

      </motion.div>

      {/* App Version */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center text-xs text-gray-400"
      >
        v1.0.0
      </motion.div>
      {themeSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-72"
          >
            <h2 className="text-lg font-semibold mb-4 text-center">Choose Theme</h2>
            <div className="space-y-3">
              {["system", "light", "dark"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    localStorage.setItem("arimart-theme", opt);
                    if (opt === "dark") {
                      document.documentElement.classList.add("dark");
                    } else if (opt === "light") {
                      document.documentElement.classList.remove("dark");
                    } else {
                      const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                      document.documentElement.classList.toggle("dark", isSystemDark);
                    }
                    setThemeSelectorOpen(false);
                  }}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${(darkMode && opt === "dark") || (!darkMode && opt === "light")
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                >
                  {opt === "system" && "System Default"}
                  {opt === "light" && "Light Mode"}
                  {opt === "dark" && "Dark Mode"}
                </button>
              ))}
            </div>
            <button
              onClick={() => setThemeSelectorOpen(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 block mx-auto"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}


      <LogoutModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <FeedbackModal isOpen={isRateus} onClose={() => setIsRateus(false)} />
      <DeliveryAddressModal      
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        currentAddress={currentAddress}
      />
    </motion.div>
  );
};

export default AccountSettings;