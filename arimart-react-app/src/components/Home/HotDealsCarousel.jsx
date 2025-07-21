import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useAnimation } from 'framer-motion';
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
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
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
    dispatch(addToWishlist({ userid: userData.id, pdid: product.id }));
  };

  const handleAddToCart = async (product) => {
    setLoadingStates(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product, 1);
      // toast.success("Added to cart!");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (homepageSections.loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (homepageSections.error) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500">
        <p>Error loading deals: {homepageSections.error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Today's Hot Deals 🔥</h2>
        <p>No special deals available</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today's Hot Deals 🔥</h2>
          <Link
            to="/category/deals"
            className="flex items-center text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 text-sm transition-colors"
          >
            View All <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="relative w-full max-w-6xl mx-auto px-4">
        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <div
            className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 h-80"
            onMouseEnter={() => setAutoSlide(false)}
            onMouseLeave={() => setAutoSlide(true)}
          >
            {products.map((product, index) => {
              const discountPercentage = getDiscountPercentage(product.price, product.discountprice);
              const displayPrice = parsePrice(product.discountprice) > 0 ? parsePrice(product.discountprice) : parsePrice(product.price);
              const originalPrice = parsePrice(product.price);
              const imageUrl = product.image
                ? `https://apiari.kuldeepchaurasia.in/Uploads/${product.image}`
                : '/placeholder-image.jpg';
              const inCart = isItemInCart(product.id);
              const quantity = getItemQuantity(product.id);

              return (
                <motion.div
                  key={product.id}
                  className="absolute inset-0 flex"
                  initial={{ x: `${(index - currentIndex) * 100}%` }}
                  animate={{
                    x: `${(index - currentIndex) * 100}%`,
                    opacity: index === currentIndex ? 1 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {/* Product Image */}
                  <div className="w-2/5 h-full p-3 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 relative">
                    <img
                      src={imageUrl}
                      alt={product.productName}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      {discountPercentage > 0 && (
                        <span className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded-full">
                          {discountPercentage}% OFF
                        </span>
                      )}
                      {index === currentIndex && (
                        <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                          HOT
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleWishlist(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${isWishlisted(product.id)
                        ? 'text-red-500 bg-white/90 dark:bg-gray-700/90'
                        : 'text-gray-400 bg-white/80 dark:bg-gray-700/80 hover:text-red-500'
                        }`}
                    >
                      <Heart className="w-4 h-4" fill={isWishlisted(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="w-3/5 h-full p-4 flex flex-col justify-between">
                    <div>
                      <Link to={generateProductLink(product)} className="group">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors line-clamp-2">
                          {product.productName}
                        </h3>
                      </Link>

                      <div className="flex items-center mt-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= 4 ? 'fill-current text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(42)</span>
                      </div>

                      {product.wweight && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {product.wweight}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        {product.shortdesc}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          ₹{displayPrice}
                        </span>
                        {parsePrice(product.discountprice) > 0 && (
                          <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {inCart ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              disabled={quantity <= 1}
                              className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 text-sm bg-white dark:bg-gray-800 rounded-md">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={loadingStates[product.id]}
                            className="md:px-3 px-1 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-1 disabled:opacity-70"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {loadingStates[product.id] ? 'Adding...' : 'Add to Cart'}
                          </button>
                        )}

                        <Link
                          to={generateProductLink(product)}
                          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center items-center gap-2 mt-10">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                ? 'bg-orange-500 w-4'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}