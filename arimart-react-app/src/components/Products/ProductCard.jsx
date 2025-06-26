import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DiscountBadge from "../ui/DiscountBadge";
import { Plus, Star } from "lucide-react";

const groceryProducts = [
  {
    id: 1,
    name: "Organic Bananas",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuYW5hc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-gradient-to-br from-yellow-50 to-yellow-200",
    quantity: "500 g",
    ratingCount: "2,143",
    price: 60,
    originalPrice: 80,
    delivery: "Today 2 PM - 4 PM"
  },
  {
    id: 2,
    name: "Fresh Strawberries",
    quantity: "500 g",
    price: 349,
    originalPrice: 399,
    rating: 4.6,
    ratingCount: "1,234",
    img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyYXdiZXJyaWVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    bg: "bg-gradient-to-br from-red-50 to-red-200",
    delivery: "Today 4 PM - 6 PM"
  },
  {
    id: 3,
    name: "Avocados",
    quantity: "3 pieces",
    price: 299,
    originalPrice: 350,
    rating: 4.7,
    ratingCount: "895",
    img: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZvY2Fkb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-gradient-to-br from-green-50 to-green-200",
    delivery: "Tomorrow 10 AM - 12 PM"
  },
  {
    id: 4,
    name: "Whole Milk",
    quantity: "1 L",
    price: 229,
    originalPrice: 260,
    rating: 4.5,
    ratingCount: "1,120",
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsa3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-gradient-to-br from-blue-50 to-blue-200",
    delivery: "Today 6 PM - 8 PM"
  },
  {
    id: 5,
    name: "Brown Eggs",
    quantity: "12 pieces",
    price: 379,
    originalPrice: 420,
    rating: 4.9,
    ratingCount: "2,501",
    img: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWdnc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-gradient-to-br from-amber-50 to-amber-200",
    delivery: "Tomorrow 8 AM - 10 AM"
  },
  {
    id: 6,
    name: "Whole Wheat Bread",
    quantity: "500 g",
    price: 249,
    originalPrice: 280,
    rating: 4.4,
    ratingCount: "789",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-gradient-to-br from-orange-50 to-orange-200",
    delivery: "Today 10 AM - 12 PM"
  }
];

const ProductCard = ({ customGridClass }) => {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const defaultGridClass = "md:hidden grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-1";

  return (
    <>
      {loading ? (
        <div className={customGridClass || defaultGridClass}>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse flex flex-col justify-between h-full"
            >
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
              <div className="relative h-32 w-full mb-3 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-2/3 mb-2"></div>
              <div className="flex justify-between items-center mt-auto">
                <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
       <div className={customGridClass || defaultGridClass}>
  {groceryProducts.map((product) => (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-3 text-sm flex-shrink-0 relative w-full max-w-[190px] sm:max-w-[200px]"
    >
      <DiscountBadge price={product.price} originalPrice={product.originalPrice} />

      {/* Image */}
      <Link
        to={`/product/category/${product.id}`}
        className="h-32 w-full bg-gray-100 rounded-md overflow-hidden mb-2 relative block"
      >
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Name */}
      <p className="font-medium text-gray-800 dark:text-white line-clamp-2 leading-snug mb-1">
        {product.name}
      </p>

      {/* Quantity */}
      <p className="text-xs text-gray-500 mb-1">{product.quantity}</p>

      {/* Rating & Count */}
      <div className="flex items-center space-x-1 text-xs mb-1">
        <span className="text-gray-800 dark:text-gray-200">{product.rating}</span>
        <div className="flex items-center text-orange-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < Math.round(product.rating)
                ? "fill-orange-400 stroke-orange-400"
                : "opacity-30 stroke-orange-400"
                }`}
            />
          ))}
        </div>
        {product.ratingCount && (
          <span className="text-blue-600 ml-1">{product.ratingCount}</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-bold text-gray-900 dark:text-white text-base">
          ₹{product.price}
        </span>
        <span className="line-through text-xs text-gray-400">
          ₹{product.originalPrice}
        </span>
      </div>

      {/* Delivery Info */}
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {product.delivery}
      </p>

      {/* Add to Cart Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-3 right-3 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-md transition-all duration-200"
      >
        <Plus className="text-white w-4 h-4" />
      </motion.button>
    </motion.div>
  ))}
</div>

      )}
    </>
  );
};

export default ProductCard;