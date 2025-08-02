import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Gift, HelpCircle, FileText, Shield, LogOut, Bell, ChevronRight, Star, Wallet, LetterTextIcon, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { icon: <User size={20} />, label: "Edit Profile", route: "/editprofile" },
    { icon: <MapPin size={20} />, label: "Allotted Area", route: "/allotedarea" },
    { icon: <Gift size={20} />, label: "Refer and Earn", route: "/refer&earn" },
    { icon: <LetterTextIcon size={20} />, label: "Leave Application", route: "/leaveapplication" },
    { icon: <Wallet size={20} />, label: "My Wallet", route: "/wallet" },
    { icon: <HelpCircle size={20} />, label: "Support", route: "/support" },
    { icon: <HelpCircle size={20} />, label: "FAQ", route: "/faq" },
    { icon: <FileText size={20} />, label: "Terms and Conditions", route: "/termandcondition" },
    { icon: <Shield size={20} />, label: "Privacy Policy", route: "/privacypolicy" }, // Add this route if not added yet
    { icon: <Settings size={20} />, label: "Setting", route: "/settings" }, // Add this route if not added yet
    { icon: <LogOut size={20} />, label: "Log Out", route: "/logout", color: "text-red-500" } // Handle logout logic on click
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-gray-50 min-h-screen"
    >
      {/* Profile Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <User size={28} />
            </motion.div>
            <div>
              <motion.h1
                className="text-xl font-bold"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
              >Amazon Sharma</motion.h1>
              <motion.p
                className="text-sm opacity-90"
                initial={{ x: -10 }}
                animate={{ x: 0, transition: { delay: 0.1 } }}
              >+91 9999988888</motion.p>
              <motion.p
                className="text-sm opacity-90"
                initial={{ x: -10 }}
                animate={{ x: 0, transition: { delay: 0.2 } }}
              >loremipsum@gmail.com</motion.p>
            </div>
          </div>
          <motion.div
            className="flex items-center bg-white/20 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <Star size={16} className="mr-1" />
            <span>4.9</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Menu Items */}
      <motion.div className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            <Link to={item.route}>
              <motion.button
                className={`w-full flex items-center justify-between p-4 rounded-xl bg-white shadow-xs hover:shadow-sm transition-all ${item.color || "text-gray-700"}`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color ? "bg-red-100" : "bg-blue-100"}`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts Section */}
      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.5 } }}
      >
        <div className="bg-white p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 flex items-center">
              <Bell size={18} className="mr-2 text-blue-500" />
              Alerts
            </h3>
            <span className="text-sm text-gray-500">Aware Messages 1 in n / apps</span>
          </div>
          <motion.div
            className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center"
            whileHover={{ scale: 1.01 }}
          >
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Bell size={16} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-700">You have new notifications</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};