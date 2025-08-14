import { Menu,Heart, ArrowLeft, Bell, Search } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/images/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import CartIcon from "../common/CartIcon";
import DesktopSidebar from "../sidebar/DesktopSidebar";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

export default function Header({
  title,
  setbaricon = true,
  setcarticon = true,
  showGroupCart = true
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onHomePage = pathname === "/home";
  const onsearchPage = pathname === "/explore";

  return (
    <>
      <header className="md:hidden sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">

          {/* Left Section */}
          <div className="flex items-center gap-2">
            {onHomePage && isAuthenticated ? (
              // ✅ Show Intro on /home
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <img
                  src="https://img.freepik.com/premium-photo/3d-illustration-cartoon-character-avatar-profile_1183071-136.jpg"
                  className="w-10 h-10 rounded-full"
                  alt="Avatar"
                />
                <motion.h1
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent max-w-[150px] truncate"
                >
                  <Link to="/account" className="text-md font-medium">
                    {userData?.name
                      ?.toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase()) || "Guest"}
                  </Link>
                </motion.h1>
              </motion.div>
            ) : !onHomePage && !setbaricon ? (
              // ✅ Back Button when setbaricon is false
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-black dark:text-white" />
              </button>
            ) : null}

            {/* ✅ Title/Logo always shown on left if not on /home intro */}
            {(!onHomePage || !isAuthenticated) && (
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {title ? title : <img src={logo} className="w-28" alt="Logo" />}
              </h1>
            )}
          </div>

          {/* Right Section — Notifications + Cart */}
          <div className="flex items-center gap-4">
            {!onHomePage && !onsearchPage ? (
              <Link to="/explore" key={uuidv4()}>
                <Search className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </Link>
            ) : ""}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 bg-red-100 dark:bg-red-900 rounded-full"
            >
             <Link to="/wishlist">
                <Heart className="w-5 h-5 text-red-600 dark:text-red-300" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 bg-blue-100 dark:bg-blue-900 rounded-full"
            >
              <Link to="/notification">
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
              </Link>
            </motion.div>
            {setcarticon && <CartIcon show={true} showGroupCart={showGroupCart} />}
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <DesktopSidebar
          key="sidebar-from-header"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}
