// components/product/ProductCard.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Heart, Plus, Minus, Check, Star } from 'lucide-react';
import DiscountBadge from '../ui/DiscountBadge';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToWishlist } from '../../Store/wishlistSlice';
import { useCart } from '../../context/CartContext';
import { fetchProductImageUrl } from '../../Store/productsSlice';

const ProductCard = ({ key, product }) => {
  const { market } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { imageUrls, imageLoading } = useSelector((state) => state.products);

  const { addToCart, isItemInCart, getItemQuantity, updateQuantity, removeFromCart, getCartItemInfo } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantityLoading, setQuantityLoading] = useState(false);

  const productId = product?.id;
  const cartItem = product ? getCartItemInfo(product.id) : null;
  const itemInCart = !!cartItem;
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  const imageUrl = imageUrls?.[productId] || product?.image || '/placeholder-image.jpg';
  const isLoading = !!(productId && imageLoading?.[productId]);

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((item) => item.pdid === productId));
  }, [wishlistItems, productId]);

  const handleWishlist = () => {
    if (!userData?.id) return toast.error("Please login to use wishlist.");
    dispatch(addToWishlist({ userid: userData.id, pdid: productId }));
    setIsWishlisted(true);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      console.log(product)
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleUpdateQuantity = async (delta) => {
    if (!itemInCart || !productId) return;
    const newQuantity = Math.max(1, itemQuantity + delta);
    setQuantityLoading(true);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setQuantityLoading(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!itemInCart || !productId) return;
    setQuantityLoading(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      toast.error("Failed to remove from cart");
    } finally {
      setQuantityLoading(false);
    }
  };

  const generateProductLink = () => {
    const marketParam = market || product.categoryName || "";
    const subcategoryParam = product.subcategoryName || product.name || "";
    return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/product/${productId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 p-3 text-sm relative"
    >
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-[5] w-7 h-7 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:scale-105 transition"
      >
        <Heart
          className={`w-4 h-4 ${isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-500"}`}
        />
      </button>

      <DiscountBadge
        price={product.totalprice || 200}
        originalPrice={product.netprice || 400}
      />

      <Link
        to={generateProductLink()}
        className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-2 relative block"
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <img
            src={`https://apiari.kuldeepchaurasia.in/${imageUrl}`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        )}
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
              key={`star-${product.id}-${i}`}
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

      {/* Cart Action Area */}
      {/* Replace the existing Cart Action Area with this */}
      <div className="mt-3">
        {itemInCart ? (
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={itemQuantity > 1 ? () => handleUpdateQuantity(-1) : handleRemoveFromCart}
              disabled={quantityLoading}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed p-1"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {quantityLoading ? '...' : `${itemQuantity}`}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleUpdateQuantity(1)}
              disabled={quantityLoading}
              className="text-gray-600 dark:text-gray-300 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed p-1"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`w-full py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="text-white w-4 h-4" />
                Add to Cart
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;