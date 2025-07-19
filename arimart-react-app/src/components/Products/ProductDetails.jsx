import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { createGroup } from "../../Store/groupBuySlice";

export default function ProductDetails({ cartIconRef }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    isItemInCart,
    getItemQuantity,
    getCartItemInfo
  } = useCart();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [optimisticInCart, setOptimisticInCart] = useState(false);

  const [activeTab, setActiveTab] = useState("description");
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);

  const productDetailState = useSelector((state) => state.productDetail) || {};
  const { product = null, loading = false, error = null } = productDetailState;
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItem = product ? getCartItemInfo(product.id) : null;
  const itemInCart = !!cartItem;
  const itemQuantity = cartItem ? cartItem.quantity : 0;
  // console.log(cartItem, product, itemInCart)
  // Demo images for left side
  const demoImages = [
    "https://apiari.kuldeepchaurasia.in/" + product?.image || '/placeholder-image.jpg',
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/f4258821-4583-407e-9882-650d32b364af.__CR0,0,300,300_PT0_SX300_V1___.jpg",
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/94c5ccbd-5093-4b45-a9dd-55fb709761fd.__CR0,0,300,300_PT0_SX300_V1___.jpg"
  ];
  const productId = String(id);
  const emptyGroupBuys = useMemo(() => [], []);
  const groupBuys = useSelector((state) => {

    const result = state.products.groupBuys?.[productId] || emptyGroupBuys;
    return result;
  });
  useEffect(() => {
    if (productId) {
      dispatch(fetchGroupBuysByProductId(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {

    if (groupBuys?.length > 0) {
    }
  }, [groupBuys]);

  const allGroupBuys = useSelector((state) => state.products.groupBuys);
  useEffect(() => {
  }, [allGroupBuys, productId]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);



  useEffect(() => {
    if (wishlistItems && product?.id) {
      const isInWishlist = wishlistItems.some((item) =>
        item.pdid === product.id || item.productId === product.id || item.id === product.id
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistItems, product?.id]);

  const shouldShowGroupBuySection = useMemo(() => {
    if (!groupBuys || !Array.isArray(groupBuys) || groupBuys.length === 0) {
      return false;
    }

    const hasValidGid = groupBuys.some(groupBuy => {
      return groupBuy?.gid;
    });

    console.log("🔍 shouldShowGroupBuySection result:", hasValidGid);
    return hasValidGid;
  }, [groupBuys]);

  const validGroupBuys = useMemo(() => {
    if (!Array.isArray(groupBuys)) return [];
    return groupBuys.filter((groupBuy) => groupBuy?.gid);
  }, [groupBuys]);

  useEffect(() => {
  }, [shouldShowGroupBuySection, validGroupBuys]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Product not found.</div>;
  }

  const handleAddToCart = async () => {
    if (!product || !product.id) {
      toast.error('Product not found');
      return;
    }
setIsCelebrating(true);
    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      setOptimisticInCart(true);
      toast.success(`${product.productName || product.name} added to cart`);
    } catch (error) {
      setOptimisticInCart(false);
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const showQuantityControls = (itemInCart && itemQuantity > 0) || optimisticInCart;

  // Fixed quantity handler functions for ProductDetails component

const handleIncrease = async () => {
  const cartItemInfo = getCartItemInfo(product.id);
  if (!cartItemInfo) return toast.error("Cart item not found");
  
  try {
    // Pass the cart item ID (not the whole object) and new quantity
    await updateQuantity(cartItemInfo.cartItemId, cartItemInfo.quantity + 1);
    toast.success("Quantity updated");
  } catch (error) {
    console.error("Error updating quantity:", error);
    toast.error("Failed to update quantity");
  }
};

const handleDecrease = async () => {
  const cartItemInfo = getCartItemInfo(product.id);
  if (!cartItemInfo) return toast.error("Cart item not found");
  
  if (cartItemInfo.quantity > 1) {
    try {
      // Pass the cart item ID (not the whole object) and new quantity
      await updateQuantity(cartItemInfo.cartItemId, cartItemInfo.quantity - 1);
      toast.success("Quantity updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  }
};

const handleRemove = async () => {
  const cartItemInfo = getCartItemInfo(product.id);
  if (!cartItemInfo) return toast.error("Cart item not found");
  
  try {
    // Pass only the cart item ID (not the whole object)
    await removeFromCart(cartItemInfo.cartItemId);
    toast.success("Item removed from cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    toast.error("Failed to remove item from cart");
  }
};

  const handleCreateGroup = async () => {
    const userId = userData?.userId || userData?.id;
    if (!userId || !product?.id || !product?.pdid) {
      toast.error("Missing user or product information");
      return;
    }

    const payload = {
      pid: product.id,          // product id
      pdid: product.pdid || product.id, // product detail id fallback
      userid: userId,           // user id
      qty: 1,                   // default group qty
      acctt: true,              // assuming true for active
      sipid: product.sipid || 0 // optional; adjust if needed
    };

    try {
      const resultAction = await dispatch(createGroup(payload)).unwrap();
      toast.success("Group created successfully!");
      console.log("Created group:", resultAction);
      dispatch(fetchGroupBuysByProductId(product.id));
    } catch (error) {
      console.error("Group creation failed:", error);
      toast.error(error?.message || "Failed to create group");
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (!product.id) {
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
        pdid: product.id
      })).unwrap();

      setIsWishlisted(true);
      toast.success(`${product.productName || product.name} added to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleSubmitReview = () => {
    if (!userRating || !reviewText.trim()) {
      toast.error('Please provide both rating and review');
      return;
    }
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

  if (!product) {
    return (
      <div className="md:hidden block bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">Product not found.</div>
      </div>
    );
  }
  const calculateDiscountPercentage = () => {
    if (product.totalprice && product.netprice && product.totalprice > 0) {
      return Math.round((1 - product.netprice / product.totalprice) * 100);
    }
    return 0;
  };
  console.log("product details : ", product)
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
                onClick={handleWishlist}
                disabled={isAddingToWishlist}
                className="absolute top-3 right-3 z-[5] w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isAddingToWishlist ? (
                  <motion.div
                    className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                ) : (
                  <Heart
                    className={`w-5 h-5 ${isWishlisted
                      ? "fill-red-500 stroke-red-500"
                      : "stroke-gray-500 hover:stroke-red-400"
                      }`}
                  />
                )}
              </motion.button>

              <div className="absolute top-4 left-4 z-10 flex items-center gap-1 text-sm bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full shadow-lg">
                <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
                <span>{product.rating}</span>
              </div>

              <AnimatePresence>
                <motion.img
                  key={product.image}
                  src={"https://apiari.kuldeepchaurasia.in/" + product.image}
                  alt={product.name}
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
                {product.images?.map((_, i) => (
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
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.weight} (Pack of {product.wweight})</p>

                <div className="flex items-center justify-between my-3">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                    {product.originalPrice > 0 && product.originalPrice !== product.price && (
                      <span className="text-sm text-gray-500 ml-1 line-through">₹{product.originalPrice}</span>
                    )}
                    {calculateDiscountPercentage() > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                        {calculateDiscountPercentage()}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{product.delivery}</p>
                </div>

                {/* Category breadcrumb */}
                {product.categoryName && (
                  <div class="flex items-center gap-1 text-sm text-gray-500 mb-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
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
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{product.description}</p>

                      {/* Health Benefits */}
                      {product.pPros && (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Health Benefits</h3>
                          <div
                            className="text-sm text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: product.pPros }}
                          />
                        </div>
                      )}

                      {/* Ingredients */}
                      {product.ingredients && (
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Ingredients</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{product.ingredients}</p>
                        </div>
                      )}

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          100% satisfaction guarantee. If you experience any issues: missing item, poor quality,
                          late delivery, or unprofessional service, contact us for immediate resolution or full refund.
                        </p>
                      </div>

                      {/* Long description */}
                      {product.longdesc && (
                        <div
                          className="mt-4 text-xs text-gray-500 dark:text-gray-400"
                          dangerouslySetInnerHTML={{ __html: product.longdesc }}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <ProductReview/>
                    </motion.div>
                  )}

                  {activeTab === "more you like" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      {/* <ProductCard customGridClass={"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 p-1"} /> */}
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
              {showQuantityControls ? (
                <motion.div
                  key="quantity-controls"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-2 py-2 gap-4 shadow-lg"
                >
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                     onClick={itemQuantity > 1 ? handleDecrease : handleRemove}
                    className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition disabled:opacity-50"
                    disabled={isAddingToCart}
                    title={itemQuantity > 1 ? "Decrease quantity" : "Remove from cart"}
                  >
                    {itemQuantity > 1 ? <Minus size={18} /> : <Trash2 size={18} />}
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
              onClick={handleCreateGroup}
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
          {/* {itemInCart && (
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
                Quantity: {itemQuantity} • Total: ₹{(product.price * itemQuantity).toFixed(2)}
              </p>
            </motion.div>
          )} */}

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