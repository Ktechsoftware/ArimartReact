import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Clock, Package } from "lucide-react";
import HomepageFeaturedProducts from "../Home/FeaturedProductUI/HomepageFeaturedProducts";


const ForYouPage = () => {
  // Example data
  const sections = [
    {
      id: 1,
      title: "Top Picks For You",
      icon: <Star className="text-yellow-400" />,
      products: [...Array(6)].map((_, i) => ({
        id: i,
        name: `Top Pick ${i + 1}`,
        price: `₹${(i + 1) * 25}`,
        img: "https://via.placeholder.com/150",
      })),
    },
    {
      id: 2,
      title: "Buy Again",
      icon: <ShoppingBag className="text-green-400" />,
      products: [...Array(4)].map((_, i) => ({
        id: i,
        name: `Buy Again ${i + 1}`,
        price: `₹${(i + 1) * 30}`,
        img: "https://via.placeholder.com/150",
      })),
    },
    {
      id: 3,
      title: "Deals of the Day",
      icon: <Clock className="text-red-400" />,
      products: [...Array(5)].map((_, i) => ({
        id: i,
        name: `Deal Item ${i + 1}`,
        price: `₹${(i + 1) * 20}`,
        img: "https://via.placeholder.com/150",
      })),
    },
  ];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto  p-4 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100"
    >
      {/* Personalized Banner */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="w-full bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -right-5 -top-5 w-20 h-20 bg-white bg-opacity-15 rounded-full"></div>
          <motion.h2
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            className="text-xl font-bold relative z-10"
          >
            Welcome Back!
          </motion.h2>
          <motion.p
            initial={{ x: -10 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm mt-1 relative z-10"
          >
            Here are some picks just for you 🎉
          </motion.p>
        </div>
      </motion.div>

      {/* Product Sections */}
      <HomepageFeaturedProducts/>

      {/* Smart Bundles */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Package className="text-purple-400" />
          <h2 className="text-xl font-semibold">Smart Bundles</h2>
        </div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <p className="text-center text-gray-600 dark:text-gray-300">
            Curated meal or grocery bundles will show here
          </p>
        </motion.div>
      </motion.div>

      {/* Reorder History */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-orange-400" />
          <h2 className="text-xl font-semibold">Reorder History</h2>
        </div>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900 dark:to-yellow-900 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <p className="text-center text-gray-600 dark:text-gray-300">
            Your most frequently ordered items will appear here
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForYouPage;