// components/ProductCard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Heart, Plus, Star } from 'lucide-react';
import DiscountBadge from '../ui/DiscountBadge';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToWishlist } from '../../Store/wishlistSlice';

const DProductCard = ({ product }) => {
  const { market, subcategory, id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  console.log("User Data in DProductCard:", userData);
  const wishlistItems = useSelector((state) => state.wishlist.items); // existing wishlist items

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (wishlistItems.some((item) => item.pdid === product.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  }, [wishlistItems, product.id]);

  const handleWishlist = () => {
    if (!userData?.userId) return toast.error("Please login to use wishlist.");

    dispatch(addToWishlist({ userid: userData.userId, pdid: product.id }));
    setIsWishlisted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="w-48 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-3 text-sm flex-shrink-0 relative"
    >
      {/* Wishlist Heart Icon */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-[5] w-7 h-7 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:scale-105 transition"
      >
        <Heart
          className={`w-4 h-4 ${isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-500"
            }`}
        />
      </button>

      <DiscountBadge price={product.totalprice || 200} originalPrice={product.netprice || 400} />

      <Link
        to={`/category/${market || product.categoryName}/${product.subcategoryName || product.productName}/${product.id}`}
        className="h-32 w-full bg-gray-100 rounded-md overflow-hidden mb-2 relative block"
      >
        <img
          src={product.image}
          alt={product.productName}
          className="w-full h-full object-cover"
        />
      </Link>

      <p className="font-medium text-gray-800 dark:text-white line-clamp-2 leading-snug mb-1">
        {product.productName}
      </p>

      <p className="text-xs text-gray-500 mb-1">{product.categoryName}</p>

      <div className="flex items-center space-x-1 text-xs mb-1">
        <span className="text-gray-800 dark:text-gray-200">{product.isAvl}</span>
        <div className="flex items-center text-orange-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 fill-orange-400 stroke-orange-400 ${i >= Math.round(product.rating) ? "opacity-30" : ""}`}
            />
          ))}
        </div>
        <span className="text-blue-600 ml-1">{product.wweight}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-bold text-gray-900 dark:text-white text-base">
          ₹{product.netprice}
        </span>
        <span className="line-through text-xs text-gray-400">
          ₹{product.totalprice}
        </span>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400">{""}</p>

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
