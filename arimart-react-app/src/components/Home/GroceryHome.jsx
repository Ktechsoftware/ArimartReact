import { Bell, SlidersHorizontal, Search, User } from "lucide-react";
import MainPage from "../MainPage";
import HotDealsCarousel from "./HotDealsCarousel";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FilterSheet from "../Explore/FilterSheet";
import ProductCard from "../Products/ProductCard";
import SearchItems from "../Explore/SearchItems";
import Categories from "../category/Categories";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const categories = [
  { label: "Vegetable", color: "bg-purple-100", icon: "🥦" },
  { label: "Coffee & Drinks", color: "bg-pink-100", icon: "☕" },
  { label: "Milk & Dairy", color: "bg-yellow-100", icon: "🥛" },
];

const offers = [
  {
    name: "Fresh Carrot",
    img: "https://via.placeholder.com/80x80?text=Carrot",
    rating: 5,
    weight: "1kg, Priceg",
    price: "$4.99",
    bg: "bg-purple-100",
  },
  {
    name: "Fresh Salmon",
    img: "https://via.placeholder.com/80x80?text=Salmon",
    rating: 5,
    weight: "1kg, Priceg",
    price: "$4.99",
    bg: "bg-orange-100",
  },
];

export default function GroceryHome() {
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-2 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm"
      >
        <div>
          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Welcome back,
          </motion.p>
          <motion.h1
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Yogesh!
          </motion.h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Icon with Badge */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 bg-blue-100 dark:bg-blue-900 rounded-full"
          >
            <Link to="/notification">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
              >
                3
              </motion.span>
            </Link>
          </motion.div>

          {/* Profile Icon with Online Status */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 bg-purple-100 dark:bg-purple-900 rounded-full"
          >
            <Link to="/account/editprofile">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>

    <SearchItems/>
    <Categories/>
    {loading ? (
  <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between mb-6 animate-pulse">
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      <div className="h-4 bg-orange-300 rounded w-1/3"></div>
    </div>
    <div className="w-20 h-20 bg-gray-300 rounded-lg ml-4"></div>
  </div>
) : (
      <div className="bg-gradient-to-br from-green-50 to-green-200 dark:from-green-900 dark:to-green-600 p-4 rounded-xl flex items-center justify-between mb-6">
  <div>
    <p className="font-semibold text-gray-800 dark:text-gray-200">Get Fresh Grocery</p>
    <p className="text-sm dark:text-gray-300">in your Door</p>
    <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm mt-1 block">
      49% Discount
    </span>
  </div>
  <img
    src="https://via.placeholder.com/100x100?text=Grocery+Guy"
    alt="promo"
    className="w-20 h-20 object-cover rounded-lg"
  />
</div>
       )}
      <MainPage />
      <HotDealsCarousel />
      <div className="relative overflow-hidden py-4 px-3 sm:px-6 md:px-8">

      {/* Special Offers */}
      <h2 className="text-xl md:text-3xl font-bold text-base mb-2">Special Offers</h2>
      <ProductCard/>
      </div>
      <FilterSheet isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
}
