// components/ProductCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import DiscountBadge from '../ui/DiscountBadge';

const DProductCard = ({ product }) => {
  const { market, subcategory, id } = useParams();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="w-48 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-3 text-sm flex-shrink-0 relative"
    >
      <DiscountBadge price={product.price || 200} originalPrice={product.originalPrice || 400} />

      <Link
        to={`/category/${market || product.category}/${subcategory || product.title}/${product.id}`}
        className="h-32 w-full bg-gray-100 rounded-md overflow-hidden mb-2 relative block"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </Link>

      <p className="font-medium text-gray-800 dark:text-white line-clamp-2 leading-snug mb-1">
        {product.title}
      </p>

      <p className="text-xs text-gray-500 mb-1">{product.category }</p>

      <div className="flex items-center space-x-1 text-xs mb-1">
        <span className="text-gray-800 dark:text-gray-200">{product.rating.rate}</span>
        <div className="flex items-center text-orange-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 fill-orange-400 stroke-orange-400 ${i >= Math.round(product.rating) ? "opacity-30" : ""}`}
            />
          ))}
        </div>
        <span className="text-blue-600 ml-1">{product.rating.count}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-bold text-gray-900 dark:text-white text-base">
          ₹{product.price}
        </span>
        <span className="line-through text-xs text-gray-400">
          ₹{product.originalPrice}
        </span>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400">{product.delivery}</p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-3 right-3 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-md transition-all duration-200"
      >
        <Plus className="text-white w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

export default DProductCard;
