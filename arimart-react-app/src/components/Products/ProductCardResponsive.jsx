// components/product/ProductCardGiftStyle.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Heart, Plus, Minus, ShoppingCart, Star, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToWishlist, removeFromWishlist } from '../../Store/wishlistSlice';
import { useCart } from '../../context/CartContext';

const ProductCardResponsive = ({ product }) => {
  const { market } = useParams();
  const dispatch = useDispatch();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const { addToCart, updateQuantity, removeFromCart, getCartItemInfo } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantityLoading, setQuantityLoading] = useState(false);

  const productId = product?.pdid;
  const cartItem = product ? getCartItemInfo(productId) : null;
  const itemInCart = !!cartItem;
  const itemQuantity = cartItem ? cartItem.quantity : 0;

  const cardColor = product.categoryName === 'Electronics'
    ? 'bg-blue-100 dark:bg-blue-900/50'
    : product.categoryName === 'Fashion'
      ? 'bg-pink-100 dark:bg-pink-900/50'
      : 'bg-green-100 dark:bg-green-900/50';

  useEffect(() => {
    setIsWishlisted(wishlistItems.some((item) => item.pdid === productId));
  }, [wishlistItems, productId]);
console.log(wishlistItems)
  const handleWishlist = async () => {
    if (!userData?.id) return toast.error("Please login to use wishlist.");

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ userid: userData.id, pdid: productId })).unwrap();
        toast.success("Removed from wishlist!");
        setIsWishlisted(false);
      } else {
        await dispatch(addToWishlist({ userid: userData.id, pdid: productId })).unwrap();
        toast.success("Added to wishlist!");
        setIsWishlisted(true);
      }
    } catch (err) {
      toast.error(err || "Action failed");
    } finally {
      setWishlistLoading(false);
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
    const marketParam = product.categoryNAme || "";
    const subcategoryParam = product.subcategoryName || product.name || "";
    return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/product/${productId}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 ${cardColor} p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="absolute top-0 right-0 px-2 py-1 bg-black text-white text-xs font-bold rounded-bl">
        {product.categoryName?.toUpperCase() || 'PRODUCT'}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Link to={generateProductLink()} className="w-full md:w-1/3 h-36 bg-white dark:bg-gray-800 rounded border">
          <img
            src={`https://apiari.kuldeepchaurasia.in/Uploads/${product.image || '/placeholder-image.jpg'}`}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </Link>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link to={generateProductLink()}>
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 hover:underline">
                  {product.productName}
                </h3>
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.subcategoryName}</p>

              <div className="flex items-center gap-2 mb-2">
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
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{product.netprice}
            </span>
            {product.totalprice > product.netprice && (
              <span className="line-through text-sm text-gray-400 dark:text-gray-500">
                ₹{product.totalprice}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {itemInCart ? (
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded border px-3 py-2">
                <button
                  onClick={itemQuantity > 1 ? () => handleUpdateQuantity(-1) : () => removeFromCart(productId)}
                  disabled={quantityLoading}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-500"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium">{quantityLoading ? '...' : itemQuantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(1)}
                  disabled={quantityLoading}
                  className="text-gray-600 dark:text-gray-300 hover:text-green-500"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full py-2 rounded flex items-center justify-center gap-2 border text-sm font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors ${isWishlisted ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {wishlistLoading ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'}`} />
                  <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-gray-500 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Stock: {product.isAvl}</span>
        </div>
        <span className="text-blue-600 dark:text-blue-400">{product.wweight}</span>
      </div>
    </motion.div>
  );
};

export default ProductCardResponsive;