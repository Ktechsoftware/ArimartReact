// components/product/ProductCardGiftStyle.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, HeartIcon, ShoppingCart, Star, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { removeFromWishlist } from '../../Store/wishlistSlice';
import { useCart } from '../../context/CartContext';

const WishlistProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const { addToCart, getCartItemInfo } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = product?.pdid;
  const linkproductid = product?.pid;
  const cartItem = product ? getCartItemInfo(linkproductid) : null;
  const itemInCart = !!cartItem;

   const generateProductLink = () => {
    const marketParam = product.categoryNAme || "";
    const subcategoryParam = product.subcategoryName || product.name || "";
    return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/product/${linkproductid}`;
  };
  const handleRemove = async () => {
    if (!userData?.id) return toast.error("Please login to manage wishlist.");
    
    setIsRemoving(true);
    try {
      await dispatch(removeFromWishlist({ userid: userData.id, pdid: productId })).unwrap();
      toast.success("Removed from wishlist!");
    } catch (err) {
      toast.error(err || "Failed to remove");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      toast.success("Added to cart!");
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-md hover:shadow-md transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Product Image */}
        <Link to={generateProductLink()} className="w-full sm:w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded flex-shrink-0">
          <img
            src={`https://apiari.kuldeepchaurasia.in/Uploads/${product.image || '/placeholder-image.jpg'}`}
            alt={product.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <Link to={generateProductLink()} className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2">
                {product.productName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.subcategoryName}</p>
            </Link>
            
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove from wishlist"
            >
              {isRemoving ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <HeartIcon className="w-4 text-red-500 h-4" fill="currentColor" />
              )}
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-orange-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${productId}-${i}`}
                  className={`w-3 h-3 fill-orange-400 stroke-orange-400 ${i >= Math.round(product.rating) ? "opacity-30" : ""}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.rating || 0})
            </span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900 dark:text-white">
              ₹{product.netprice}
            </span>
            {product.totalprice > product.netprice && (
              <span className="line-through text-xs text-gray-400 dark:text-gray-500">
                ₹{product.totalprice}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || itemInCart}
              className={`w-full py-1.5 rounded flex items-center justify-center gap-1 text-sm font-medium transition-colors
                ${itemInCart 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {isAddingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{itemInCart ? 'In Cart' : 'Add to Cart'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WishlistProductCard;