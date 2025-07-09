import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Heart, Plus, Check, Star } from 'lucide-react';
import DiscountBadge from '../ui/DiscountBadge';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToWishlist } from '../../Store/wishlistSlice';
import { useCart } from '../../context/CartContext';
import { fetchProductImageUrl } from '../../Store/productsSlice';

const DProductCard = ({ product }) => {
  const { market, subcategory, id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { imageUrls, imageLoading } = useSelector((state) => state.products);
  // console.log("product", product);

  // Cart context
  const { addToCart, isItemInCart, getItemQuantity,getCartItemInfo } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Safe product property access
  const productId = product?.id;
  const productName = product?.productName || product?.name || 'Unknown Product';
  const categoryName = product?.categoryName || 'Category';
  const subcategoryName = product?.subcategoryName || product?.subCategory || '';
  const netPrice = product?.netprice || product?.price || 0;
  const totalPrice = product?.totalprice || product?.originalPrice || 0;
  const rating = product?.rating || 0;
  const weight = product?.wweight || product?.weight || '';
  const availability = product?.isAvl || product?.availability || 'In Stock';

 const cartItem = product ? getCartItemInfo(product.id) : null;
  const itemInCart = !!cartItem;
  const itemQuantity = cartItem ? cartItem.quantity : 0;
const imageUrl = imageUrls?.[productId] || product?.image || '/placeholder-image.jpg';
const isLoading = !!(productId && imageLoading?.[productId]);

useEffect(() => {
  if (productId && !imageUrls?.[productId] && !imageLoading?.[productId]) {
    dispatch(fetchProductImageUrl(productId));
  }
}, [dispatch, productId, imageUrls, imageLoading]);

const generateimageurl = () => imageUrl;

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistItems && productId) {
      const isInWishlist = wishlistItems.some((item) =>
        item.pdid === productId || item.productId === productId || item.id === productId
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistItems, productId]);

  // console.log("userData", userData);

  const handleWishlist = async () => {
    if (!userData?.id) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (!productId) {
      toast.error('Product ID not found');
      return;
    }

    if (isWishlisted) {
      toast.info('Already in wishlist');
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const userId = userData?.userId || userData?.id;
      if (!userId) {
        toast.error('User not found');
        return;
      }

      await dispatch(addToWishlist({
        userid: userId,
        pdid: productId
      })).unwrap();

      setIsWishlisted(true);
      toast.success(`${productName} added to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !productId) {
      toast.error('Product not found');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      toast.success(`${productName} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Calculate discount percentage safely
  const calculateDiscountPercentage = () => {
    if (totalPrice && netPrice && totalPrice > netPrice) {
      return Math.round((1 - netPrice / totalPrice) * 100);
    }
    return 0;
  };

  // Generate product link safely
  const generateProductLink = () => {
    const marketParam = market || categoryName;
    const subcategoryParam = subcategory || subcategoryName || productName;
    return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/${productId}`;
  };

  // Don't render if product is invalid
  if (!product || !productId) {
    return null;
  }

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
        disabled={isAddingToWishlist}
        className="absolute top-2 right-2 z-[5] w-7 h-7 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAddingToWishlist ? (
          <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Heart
            className={`w-4 h-4 ${isWishlisted
                ? "fill-red-500 stroke-red-500"
                : "stroke-gray-500 hover:stroke-red-400"
              }`}
          />
        )}
      </button>

      {/* Discount Badge */}
      {calculateDiscountPercentage() > 0 && (
        <DiscountBadge
          price={totalPrice}
          originalPrice={netPrice}
        />
      )}

      {/* Product Image Link */}
      <Link
        to={generateProductLink()}
        className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-2 relative block"
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        )}
      </Link>


      {/* Product Name */}
      <p className="font-medium text-gray-800 dark:text-white line-clamp-2 leading-snug mb-1">
        {productName}
      </p>

      {/* Category */}
      <p className="text-xs text-gray-500 mb-1">{categoryName}</p>

      {/* Rating and Weight */}
      <div className="flex items-center space-x-1 text-xs mb-1">
        <span className="text-gray-800 dark:text-gray-200">{availability}</span>
        <div className="flex items-center text-orange-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 fill-orange-400 stroke-orange-400 ${i >= Math.round(rating) ? "opacity-30" : ""
                }`}
            />
          ))}
        </div>
        {weight && (
          <span className="text-blue-600 ml-1">{weight}</span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-bold text-gray-900 dark:text-white text-base">
          ₹{netPrice}
        </span>
        {totalPrice > netPrice && (
          <span className="line-through text-xs text-gray-400">
            ₹{totalPrice}
          </span>
        )}
      </div>

      {/* Discount percentage */}
      {calculateDiscountPercentage() > 0 && (
        <p className="text-xs text-green-600 dark:text-green-400 mb-1">
          {calculateDiscountPercentage()}% OFF
        </p>
      )}

      {/* Add to Cart Button */}
      <motion.button
        whileHover={{ scale: itemInCart ? 1 : 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${itemInCart
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-orange-500 hover:bg-orange-600'
          } ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isAddingToCart ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : itemInCart ? (
          <div className="flex flex-col items-center relative">
            <Check className="text-white w-4 h-4" />
            {itemQuantity > 1 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center min-w-[1rem] min-h-[1rem]">
                {itemQuantity > 99 ? '99+' : itemQuantity}
              </span>
            )}
          </div>
        ) : (
          <Plus className="text-white w-4 h-4" />
        )}
      </motion.button>
    </motion.div>
  );
};

export default DProductCard;