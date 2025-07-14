import { Menu, ShoppingCart, ArrowLeft, Sun, Moon } from "lucide-react";
import { useRef, useState } from "react";
import SidebarMenu from "../sidebar/SidebarMenu";
import logo from '../../assets/images/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import CartIcon from "../common/CartIcon";

export default function Header({ 
  title, 
  setbaricon = true, 
  setcarticon = true, 
  cartIconRef,
  showGroupCart = true  // New prop to control group cart display
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <>
      <header className="md:hidden sticky top-0 z-50 border dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 shadow-lg backdrop-blur-md">
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
          <div className="relative">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white inline-block">
              {title ? title : <img src={logo} className="mx-auto w-32" alt="Logo" />}
            </h1>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-transparent"></div>
          </div>
          <div className="flex items-center gap-4">
            {setcarticon && (
              <CartIcon show={true} showGroupCart={showGroupCart} />
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