import { ShoppingCart, Search, ChevronDown, User, ClockAlertIcon, GroupIcon, Bell } from "lucide-react";
import logo from '../../assets/images/logo.png';
import { motion } from "framer-motion";
import { useState } from "react";
import DesktopCategory from "../category/DesktopCategory";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchDropdown } from "./SearchDropdown";
import { useCart } from "../../context/CartContext";
import CartIcon from "../common/CartIcon";
import NotificationDropdown from "../ui/NotificationDropdown";


export default function DesktopHeader() {
  const [isHoveringCart, setIsHoveringCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const { totalItems, loading } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
    }
  };
  return (
    <>
      <header className="w-full shadow-sm px-4 py-2 bg-white dark:bg-gray-900 sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">

          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/home"><img src={logo} className="mx-auto w-40" alt="Logo" /></Link>
          </motion.div>

          {/* Delivery Info with animated chevron */}
          <div className="hidden md:flex flex-col relative group">
            <div className="flex items-center gap-1 cursor-pointer">
              <span className="text-sm font-semibold text-black dark:text-white">Delivery in 22 minutes</span>
              <motion.div
                animate={{ rotate: isHoveringCart ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300">B5, Ghazipur Village, Ghazi...</span>

            {/* Animated dropdown (hidden by default) */}
            <motion.div
              className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              initial={{ y: -10, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">Your delivery address</p>
            </motion.div>
          </div>

          {/* Search Box with focus animation */}
          {/* <motion.div
            className="flex flex-1 max-w-md mx-4 bg-gray-100 dark:bg-gray-800 rounded-full items-center px-3 py-2"
            whileFocus={{
              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
              backgroundColor: "rgba(255, 255, 255, 1)",
            }}
            transition={{ duration: 0.2 }}
          >
            <Search className="text-gray-400 dark:text-gray-300 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleSearch(e);
                }
              }}
              placeholder='Search "paneer"'
              className="w-full bg-transparent focus:outline-none text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400"
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xs text-blue-500 ml-2"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </motion.button>
            )}
          </motion.div> */}
          <div className="flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full items-center px-3 py-2">
                <Search className="text-gray-400 dark:text-gray-300 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder='Search "paneer"'
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="text-xs text-blue-500 ml-2"
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>

            {showDropdown && searchQuery && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <SearchDropdown
                  query={searchQuery}
                  onClose={() => setShowDropdown(false)}
                />
              </>
            )}
          </div>

          {/* Login & Cart with hover animations */}
          <div className="flex items-center gap-4">
            <Link to='/group-buying'>
              <motion.button
                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md text-sm text-gray-800 dark:text-white relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHoveringCart(true)}
                onHoverEnd={() => setIsHoveringCart(false)}
              >
                <GroupIcon />
                <span>🔥 Running Group Buy Deals</span>
              </motion.button>
            </Link>
            {!isAuthenticated ? (
              <Link to="/auth">
                <motion.button
                  className="flex items-center gap-1 text-sm text-black dark:text-white hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4" />
                  Login
                </motion.button>
              </Link>
            ) : (
              <>
                <NotificationDropdown/>
                <Link to="/account">
                  <motion.button
                    className="flex items-center gap-1 text-sm text-black dark:text-white"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <UserCircle className="w-5 h-5" />
                    My Account
                  </motion.button>
                </Link>
              </>
            )}
            <CartIcon show={true} />
          </div>
        </div>
      </header> 
      <DesktopCategory />
    </>
  );
}