import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { fetchHomepageSections } from '../../Store/PopularSlice/popularProductsSlice';
import { useCart } from '../../context/CartContext';
import { addToWishlist } from '../../Store/wishlistSlice';

export default function CompactProductCarousel() {
  const { market } = useParams();
  const dispatch = useDispatch();
  const { homepageSections } = useSelector(state => state.popularProducts);
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { addToCart, isItemInCart, getItemQuantity, updateQuantity } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    dispatch(fetchHomepageSections());
  }, [dispatch]);

  const getSpecialDealsProducts = () => {
    if (!homepageSections.sections) return [];

    const dealsSection = homepageSections.sections.find(
      section => section.key === 'deals' || section.key === 'special-deals' || section.key === 'hot-deals'
    );

    return dealsSection?.products?.slice(0, 5) || [];
  };

  const products = getSpecialDealsProducts();

  useEffect(() => {
    if (autoSlide && products.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoSlide, currentIndex, products.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const parsed = parseFloat(priceStr);
    return isNaN(parsed) ? 0 : parsed;
  };

  const getDiscountPercentage = (price, discountPrice) => {
    const originalPrice = parsePrice(price);
    const discountedPrice = parsePrice(discountPrice);
    if (originalPrice > discountedPrice && originalPrice > 0) {
      return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const generateProductLink = (product) => {
    const marketParam = market || product.categoryName || "";
    const subcategoryParam = product.subcategoryName || product.name || "";
    return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/product/${product.id}`;
  };

  const isWishlisted = (productId) => {
    return wishlistItems.some((item) => item.pdid === productId);
  };

  const handleWishlist = (product) => {
    if (!userData?.id) return toast.error("Please login to use wishlist.");
    dispatch(addToWishlist({ userid: userData.id, pdid: product.pdid }));
  };

  const handleAddToCart = async (product) => {
    setLoadingStates(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product, 1);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (homepageSections.loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (homepageSections.error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-red-500">
        <p>Error loading deals: {homepageSections.error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Today's Hot Deals 🔥</h2>
        <p>No special deals available</p>
      </div>
    );
  }

  const currentProduct = products[currentIndex];
  const discountPercentage = getDiscountPercentage(currentProduct.price, currentProduct.discountprice);
  const displayPrice = parsePrice(currentProduct.price) > 0 ? parsePrice(currentProduct.netprice) : parsePrice(currentProduct.price);
  const originalPrice = parsePrice(currentProduct.price);
  const imageUrl = currentProduct.image
    ? `https://apiari.kuldeepchaurasia.in/Uploads/${currentProduct.image}`
    : '/placeholder-image.jpg';
  const inCart = isItemInCart(currentProduct.id);
  const quantity = getItemQuantity(currentProduct.id);

  return (
    <div className="w-full max-w-6xl mx-auto px-0 md:px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-4 md:px-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Hot Deals 🔥</h2>
        <Link
          to="/category/deals"
          className="flex items-center text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 text-sm transition-colors"
        >
          View All <ChevronRight className="ml-1 w-4 h-4" />
        </Link>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative w-full h-[500px] md:h-[450px] rounded-xl overflow-hidden"
        onMouseEnter={() => setAutoSlide(false)}
        onMouseLeave={() => setAutoSlide(true)}
      >
        {/* Background Blur Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={currentProduct.productName}
            className="w-full h-full object-cover blur-lg opacity-30 scale-110"
            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
          />
        </div>

        {/* Product Image (Top Section) */}
        <div className="relative h-1/2 md:h-3/5 w-full flex items-center justify-center p-6">
          <AnimatePresence custom={direction}>
            <motion.img
              key={currentIndex}
              src={imageUrl}
              alt={currentProduct.productName}
              className="max-h-full max-w-full object-contain z-10"
              onError={(e) => (e.target.src = '/placeholder-image.jpg')}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </AnimatePresence>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            {discountPercentage > 0 && (
              <span className="px-3 py-1 text-xs font-bold bg-green-500 text-white rounded-full shadow-md">
                {discountPercentage}% OFF
              </span>
            )}
            <span className="px-3 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow-md">
              HOT
            </span>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Product Details (Bottom Section) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 md:h-2/5 bg-gradient-to-t from-white/95 via-white/90 to-white/80 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/80 backdrop-blur-sm rounded-t-3xl p-6 pt-8 flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <Link to={generateProductLink(currentProduct)} className="group">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2 mb-2">
                  {currentProduct.productName}
                </h3>
              </Link>

              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= 4 ? 'fill-current text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  />
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(42)</span>
              </div>

              {currentProduct.wweight && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {currentProduct.wweight}
                </p>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                {currentProduct.shortdesc}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{displayPrice}
                    </span>
                    {parsePrice(currentProduct.discountprice) > 0 && (
                      <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                        ₹{originalPrice}
                      </span>
                    )}
                     <span className="text-md bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 px-2 py-1 rounded ">
                      Group price : ₹{currentProduct.gprice}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-10">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                ? 'bg-orange-500 w-4'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}