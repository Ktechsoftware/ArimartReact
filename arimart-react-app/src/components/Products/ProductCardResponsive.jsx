// components/product/ProductCardGiftStyle.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Heart, Plus, Minus, ShoppingCart, Star, Clock, Scissors } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToWishlist } from '../../Store/wishlistSlice';
import { useCart } from '../../context/CartContext';

const ProductCardResponsive = ({ product }) => {
  const { market } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const { addToCart, updateQuantity, removeFromCart, getCartItemInfo } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantityLoading, setQuantityLoading] = useState(false);

  const productId = product?.id;
  const cartItem = product ? getCartItemInfo(product.id) : null;
  const itemInCart = !!cartItem;
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  // Color based on product category (you can customize this)
  const cardColor = product.categoryName === 'Electronics' 
    ? 'bg-blue-100 dark:bg-blue-900/50' 
    : product.categoryName === 'Fashion' 
      ? 'bg-pink-100 dark:bg-pink-900/50' 
      : 'bg-green-100 dark:bg-green-900/50';

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((item) => item.pdid === productId));
  }, [wishlistItems, productId]);

  const handleWishlist = () => {
    if (!userData?.id) return toast.error("Please login to use wishlist.");
    dispatch(addToWishlist({ userid: userData.id, pdid: productId }));
    setIsWishlisted(true);
    toast.success("Added to wishlist!");
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
      className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 ${cardColor} p-5 shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Product Type Badge */}
      <div className="absolute top-0 right-0 px-3 py-1 bg-black text-white text-xs font-bold rounded-bl-lg">
        {product.categoryName?.toUpperCase() || 'PRODUCT'}
      </div>

      {/* Product Info */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image */}
        <Link 
          to={generateProductLink()}
          className="w-full md:w-1/3 h-40 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
        >
          <img
            src={`https://apiari.kuldeepchaurasia.in/Uploads/${product.image || '/placeholder-image.jpg'}`}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </Link>

        {/* Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link to={generateProductLink()}>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1 hover:underline">
                  {product.productName}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{product.subcategoryName}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`star-${product.id}-${i}`}
                      className={`w-4 h-4 fill-orange-400 stroke-orange-400 ${i >= Math.round(product.rating) ? "opacity-30" : ""}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({product.rating || 0})
                </span>
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-gray-500 hover:stroke-red-500"}`}
              />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₹{product.netprice}
            </span>
            {product.totalprice && product.totalprice > product.netprice && (
              <span className="line-through text-sm text-gray-400 dark:text-gray-500">
                ₹{product.totalprice}
              </span>
            )}
          </div>

          {/* Cart Actions */}
          <div className="mt-auto">
            {itemInCart ? (
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2">
                <button
                  onClick={itemQuantity > 1 ? () => handleUpdateQuantity(-1) : () => removeFromCart(productId)}
                  disabled={quantityLoading}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500 p-1"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {quantityLoading ? '...' : itemQuantity}
                </span>
                <button
                  onClick={() => handleUpdateQuantity(1)}
                  disabled={quantityLoading}
                  className="text-gray-600 dark:text-gray-300 hover:text-green-500 p-1"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 ${isAddingToCart 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Add to Cart</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-300">
          <Clock className="w-3 h-3" />
          <span>Stock: {product.isAvl}</span>
        </div>
        <span className="text-xs text-blue-600 dark:text-blue-400">
          {product.wweight}
        </span>
      </div>
    </motion.div>
  );
};

export default ProductCardResponsive;