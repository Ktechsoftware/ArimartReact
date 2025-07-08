import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Star, Plus, Minus, ShoppingCart, LoaderCircle, Trash2, Users, ChevronsUp } from "lucide-react";
import ProductCard from "./ProductCard";
import { fetchProductById } from "../../Store/productDetailSlice";
import { addToWishlist } from "../../Store/wishlistSlice";
import { fetchGroupBuysByProductId } from "../../Store/productsSlice";
import { useCart } from "../../context/CartContext";
import { GroupBuySection } from "../../pages/GroupBuy/GroupBuySection";
import ProductReview from "../Reviews/ProductReview";
import toast from 'react-hot-toast';

export default function ProductDetails({ cartIconRef }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    isInCart,
    getItemQuantity
  } = useCart();

  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [userRating, setUserRating] = useState(0);
  const [dotVisible, setDotVisible] = useState(false);
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [dotTarget, setDotTarget] = useState({ x: 0, y: 0 });
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [reviewText, setReviewText] = useState("");

  // Redux state
  const productDetailState = useSelector((state) => state.productDetail) || {};
  const { product = null, loading = false, error = null } = productDetailState;
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Safe usage — don't access product.id until after product is confirmed
  const itemInCart = product ? isInCart(product.id) : false;
  const itemQuantity = product ? getItemQuantity(product.id) : 0;

  const productId = String(id || '');
  const emptyGroupBuys = useMemo(() => [], []);

  // Get group buys from Redux store
  const groupBuys = useSelector((state) => {
    const result = state.products.groupBuys?.[productId] || emptyGroupBuys;
    return result;
  });

  // Fetch product and group buys
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchGroupBuysByProductId(String(id)));
    }
  }, [dispatch, id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistItems && product?.id) {
      const isInWishlist = wishlistItems.some((item) =>
        item.pdid === product.id || item.productId === product.id || item.id === product.id
      );
      setIsFavorite(isInWishlist);
    }
  }, [wishlistItems, product?.id]);

  // Helper function to check if we should show GroupBuySection
  const shouldShowGroupBuySection = useMemo(() => {
    if (!groupBuys || !Array.isArray(groupBuys) || groupBuys.length === 0) {
      return false;
    }
    return groupBuys.some(groupBuy => groupBuy?.gid);
  }, [groupBuys]);

  // Get valid group buys
  const validGroupBuys = useMemo(() => {
    if (!Array.isArray(groupBuys)) return [];
    return groupBuys.filter((groupBuy) => groupBuy?.gid);
  }, [groupBuys]);

  // Use product data or fallback to demo data
  const productData = product ? {
    name: product.productName || product.name || "Beef Mixed Cut Bone",
    description: product.shortdesc || "Premium quality beef mixed cuts with bone for rich flavor. Perfect for stews, curries, and grilling. Sourced from grass-fed cattle raised in organic farms.",
    price: product.netprice || product.price || 23.46,
    originalPrice: product.totalprice || product.originalPrice || 0,
    weight: product.weight || "50 gm",
    packageWeight: product.packageWeight || "1000 gm",
    rating: product.rating || 4.5,
    ratingCount: product.ratingCount || 128,
    delivery: product.delivery || "Available on fast delivery",
    images: product.image ? [
      `http://localhost:5015/Uploads/${product.image}`,
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    ] : [
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    ],
    reviews: product.reviews || [
      {
        id: 1,
        name: "Rahul Sharma",
        rating: 5,
        date: "2 days ago",
        comment: "Excellent quality meat! Very fresh and tender. Will definitely order again."
      },
      {
        id: 2,
        name: "Priya Patel",
        rating: 4,
        date: "1 week ago",
        comment: "Good quality but delivery was delayed by a day. Taste was great though."
      },
      {
        id: 3,
        name: "Amit Singh",
        rating: 5,
        date: "2 weeks ago",
        comment: "Perfect for my biryani recipe. The cuts were exactly as described."
      }
    ],
    longdesc: product.longdesc,
    pPros: product.pPros,
    ingredients: product.ingredients
  } : null;

  // Calculate discount percentage
  const calculateDiscountPercentage = () => {
    if (productData?.originalPrice && productData?.price && productData.originalPrice > 0) {
      return Math.round((1 - productData.price / productData.originalPrice) * 100);
    }
    return 0;
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (!product?.id) {
      toast.error('Product ID not found');
      return;
    }

    if (isFavorite) {
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
        pdid: product.id
      })).unwrap();

      setIsFavorite(true);
      toast.success(`${productData.name} added to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    if (!product || !product.id) {
      toast.error('Product not found');
      return;
    }

    // Get start position (button center)
    const startRect = e.currentTarget.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;

    // Set dot animation
    setDotPos({ x: startX, y: startY });

    if (cartIconRef?.current) {
      // Get end position (cart icon center)
      const endRect = cartIconRef.current.getBoundingClientRect();
      const endX = endRect.left + endRect.width / 2;
      const endY = endRect.top + endRect.height / 2;
      setDotTarget({ x: endX, y: endY });
      setDotVisible(true);
      setTimeout(() => setDotVisible(false), 1000);
    }

    // Trigger celebration animation
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 1500);

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product, qty);
      console.log(result)
      toast.success(`${productData.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleIncrease = async () => {
    if (itemInCart && itemQuantity > 0) {
      try {
        await updateQuantity(product.id, itemQuantity + 1);
      } catch (error) {
        console.error("Error increasing quantity:", error);
        toast.error("Failed to update quantity");
      }
    } else {
      setQty(qty + 1);
    }
  };

  const handleDecrease = async () => {
    if (itemInCart && itemQuantity > 1) {
      try {
        await updateQuantity(product.id, itemQuantity - 1);
      } catch (error) {
        console.error("Error decreasing quantity:", error);
        toast.error("Failed to update quantity");
      }
    } else {
      setQty(Math.max(1, qty - 1));
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(product.id);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleSubmitReview = () => {
    if (!userRating || !reviewText.trim()) {
      toast.error('Please provide both rating and review');
      return;
    }

    // Here you would typically dispatch an action to submit the review
    toast.success('Review submitted successfully!');
    setUserRating(0);
    setReviewText('');
  };

  const SprinkleHurray = () => (
    <>
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 1,
            scale: 0,
            x: 0,
            y: 0,
            rotate: 0
          }}
          animate={{
            opacity: 0,
            scale: [0, 1.5, 0],
            x: Math.sin((i * 30) * (Math.PI / 180)) * 40,
            y: Math.cos((i * 30) * (Math.PI / 180)) * 40,
            rotate: 360
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            delay: i * 0.05
          }}
          className="absolute pointer-events-none text-yellow-400 text-xl"
          style={{
            left: '50%',
            top: '50%',
          }}
        >
          {['✨', '★', '✧', '❁'][i % 4]}
        </motion.span>
      ))}
    </>
  );

  if (loading) {
    return (
      <div className="md:hidden block bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:hidden block bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!product || !productData) {
    return (
      <div className="md:hidden block bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">Product not found.</div>
      </div>
    );
  }
  const regularPrice = product.netprice || product.price || 0;
  const groupPrice = product.gprice || 0;
  const discountPercentage =
    regularPrice > 0 ? Math.round((1 - groupPrice / regularPrice) * 100) : 0;
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="md:hidden block bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen pb-24"
      >
        <div className="max-w-6xl mx-auto md:mt-10 lg:flex lg:items-start lg:gap-8 px-2 lg:px-6">
          {/* Sticky Wrapper for Image on Large Screens */}
          <div className="lg:sticky lg:top-20 lg:flex-1">
            <div className="relative h-64 w-full overflow-hidden rounded-xl lg:h-[450px] lg:flex-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                disabled={isAddingToWishlist}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full ${isFavorite
                  ? "bg-red-100 text-red-500 shadow-lg"
                  : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 shadow-lg"
                  }`}
              >
                {isAddingToWishlist ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                ) : (
                  <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} />
                )}
              </motion.button>

              <div className="absolute top-4 left-4 z-10 flex items-center gap-1 text-sm bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full shadow-lg">
                <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                <span>{productData.rating}</span>
              </div>

              <AnimatePresence>
                <motion.img
                  key={productData.images[selectedImage]}
                  src={productData.images[selectedImage]}
                  alt={productData.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </AnimatePresence>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {productData.images.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full cursor-pointer ${i === selectedImage ? "bg-white" : "bg-white/50"}`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedImage(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:flex-1 mt-4 lg:mt-0">
            <div className="p-2 lg:p-0">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-bold">{productData.name}</h2>
                <p className="text-sm text-gray-500">{productData.weight} (Pack of {productData.packageWeight})</p>

                <div className="flex items-center justify-between my-3">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-green-600">₹{productData.price}</span>
                    {productData.originalPrice > 0 && productData.originalPrice !== productData.price && (
                      <span className="text-sm text-gray-500 ml-1 line-through">₹{productData.originalPrice}</span>
                    )}
                    {calculateDiscountPercentage() > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                        {calculateDiscountPercentage()}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{productData.delivery}</p>
                </div>

                {/* Category breadcrumb */}
                {product.categoryName && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <span>{product.categoryName}</span>
                    {product.subcategoryName && (
                      <>
                        <span>&gt;</span>
                        <span>{product.subcategoryName}</span>
                      </>
                    )}
                    {product.childCategoryName && (
                      <>
                        <span>&gt;</span>
                        <span>{product.childCategoryName}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Cashback section */}
                <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/10 border border-orange-300 dark:border-orange-500 px-3 py-2 rounded-md mb-3">
                  Cashback: Get 5% back with Amazon Pay ICICI Bank credit card for Prime members.
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300 mb-4">
                  <span>✔ Free Delivery</span>
                  <span>✔ Secure Transaction</span>
                  <span>✔ Returnable</span>
                  <span>✔ In Stock</span>
                </div>
              </motion.div>

              {/* Group Buy Section */}
              {shouldShowGroupBuySection && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <h3 className="text-lg font-semibold mb-2">Currently running group</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    If you don't have your own group, you can join any running group
                  </p>
                  {validGroupBuys.map((groupBuy, index) => (
                    <div key={groupBuy.gid || index} className="mb-4">
                      <GroupBuySection
                        userId={userData?.userId || userData?.id}
                        product={{ ...product, gid: groupBuy.gid }}
                      />
                    </div>
                  ))}
                </motion.div>
              )}

              <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6">
                {["description", "reviews", "more you like"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === tab ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="my-4">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{productData.description}</p>

                      {/* Health Benefits */}
                      {productData.pPros && (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Health Benefits</h3>
                          <div
                            className="text-sm text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: productData.pPros }}
                          />
                        </div>
                      )}

                      {/* Ingredients */}
                      {productData.ingredients && (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Ingredients</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{productData.ingredients}</p>
                        </div>
                      )}

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          100% satisfaction guarantee. If you experience any issues: missing item, poor quality,
                          late delivery, or unprofessional service, contact us for immediate resolution or full refund.
                        </p>
                      </div>

                      {/* Long description */}
                      {productData.longdesc && (
                        <div
                          className="mt-4 text-xs text-gray-500 dark:text-gray-400"
                          dangerouslySetInnerHTML={{ __html: productData.longdesc }}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                      {/* Review form */}
                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Write a Review</h3>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-6 h-6 cursor-pointer ${star <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                onClick={() => setUserRating(star)}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
                          <textarea
                            id="review-text"
                            rows={4}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Share details about your experience with this product"
                          />
                        </div>
                        <button
                          onClick={handleSubmitReview}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition"
                        >
                          Submit Review
                        </button>
                      </div>

                      <h3 className="font-medium mb-2">Customer Reviews ({productData.reviews.length})</h3>
                      <div className="space-y-4">
                        {productData.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <p className="font-medium">{review.name}</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "more you like" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <ProductCard customGridClass={"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 p-1"} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-16 left-0 right-0 z-50 
     bg-white/80 dark:bg-gray-900/60 
     backdrop-blur-md backdrop-saturate-150 
     dark:backdrop-blur-md dark:backdrop-saturate-150 
     p-4 shadow-lg"
        >
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {itemInCart && itemQuantity > 0 ? (
                <motion.div
                  key="quantity-controls"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-6 py-3 gap-4 shadow-lg"
                >
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={handleDecrease}
                    className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
                  >
                    <Minus size={18} />
                  </motion.button>

                  <motion.div
                    key={itemQuantity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-white font-bold text-lg min-w-[2rem] text-center"
                  >
                    {itemQuantity}
                  </motion.div>

                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={handleIncrease}
                    className="text-white bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
                  >
                    <Plus size={18} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="buy-now"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-6 rounded-full font-semibold shadow-lg flex items-center gap-2 transition-all duration-200 disabled:opacity-70"
                >
                  {isAddingToCart ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Buy Now
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Group Buy Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                toast.success('Group Buy feature coming soon!');
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-5 rounded-full font-semibold shadow-lg flex flex-col items-center justify-center gap-0 transition-all duration-200"
            >
              <div className="flex items-center gap-1.5">
                <Users size={20} />
                <span>Save {discountPercentage}%</span>
              </div>
              <span className="text-[10px] leading-none mt-0.1">on group buy</span>
            </motion.button>
          </div>

          {/* Cart Success Indicator */}
          {itemInCart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 max-w-md mx-auto"
            >
              <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                <ShoppingCart size={16} />
                <span className="font-semibold text-sm">Added to Cart</span>
              </div>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Quantity: {itemQuantity} • Total: ₹{(productData.price * itemQuantity).toFixed(2)}
              </p>
            </motion.div>
          )}

          {/* Celebration Animation */}
          <AnimatePresence>
            {isCelebrating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
              >
                <SprinkleHurray />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );

}