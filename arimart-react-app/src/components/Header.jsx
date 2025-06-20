import { Menu, ShoppingCart, ArrowLeft, Sun, Moon } from "lucide-react";
import { useState } from "react";
import SidebarMenu from "./SidebarMenu";
import logo from '../assets/images/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Header({ title, setbaricon = true, setcarticon = true }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <>
      <header className="sticky top-2 m-2 rounded-3xl z-50 border dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="">
            {setbaricon ? (
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 -m-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Menu className="w-6 h-6 text-black dark:text-white" />
              </button>
            ) : (
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-black dark:text-white" />
              </button>
            )}
          </div>

          <h1 className="text-xl ml-10 font-bold text-black dark:text-white">
            {title ? title : <img src={logo} className="mx-auto w-40" alt="Logo" />}
          </h1>

          <div className="flex items-center gap-4">
            {/* Dark/Light Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative p-1 flex items-center transition-colors"
            >
              <motion.div
                animate={{
                  x: darkMode ? 24 : 0,
                  backgroundColor: darkMode ? "#4B5563" : "#F59E0B",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 rounded-full absolute flex items-center justify-center"
              >
                {darkMode ? (
                  <Moon className="w-3 h-3 text-white" />
                ) : (
                  <Sun className="w-3 h-3 text-white" />
                )}
              </motion.div>
            </motion.button>

            {setcarticon && (
              <Link to="/cart" className="relative">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <ShoppingCart className="w-6 h-6 text-black dark:text-white" />
                </motion.div>
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  0
                </motion.span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <SidebarMenu open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
}