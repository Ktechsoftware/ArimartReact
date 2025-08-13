import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Star, Plus, Minus, ShoppingCart, LoaderCircle, Trash2, Users, ChevronsUp, Trash2Icon, Share2, UserCheckIcon, Truck, Lock, RefreshCcw, CheckCircle, CheckCircle2 } from "lucide-react";
import ProductCard from "./ProductCard";
import { fetchProductById } from "../../Store/productDetailSlice";
import { addToWishlist } from "../../Store/wishlistSlice";
import { fetchGroupBuysByProductId } from "../../Store/productsSlice";
import { useCart } from "../../context/CartContext";
import { GroupBuySection } from "../../pages/GroupBuy/GroupBuySection";
import { createGroup, fetchMyJoinedGroups } from "../../Store/groupBuySlice";
import toast from 'react-hot-toast';
import RecommendedProducts from "./RecommendedProducts";
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import seoHelper from "../../utils/seoHelper"
import { fetchWalletBalance } from "../../Store/walletSlice";
import { ReviewsComponent} from "../Reviews/ProductReview";

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

  const {
    referCodesByGid,
    myJoinedGroups,
  } = useSelector(state => state.group);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [optimisticInCart, setOptimisticInCart] = useState(false);
  const [useWalletAmount, setUseWalletAmount] = useState(0);
  const walletBalance = useSelector((state) => state.wallet.balance);
  const [activeTab, setActiveTab] = useState("description");
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [saveloading, setsaveLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGroupOwner, setIsGroupOwner] = useState(false);
  const [currentGroupData, setCurrentGroupData] = useState(null);


  const productDetailState = useSelector((state) => state.productDetail) || {};
  const { product = null, loading = false, error = null } = productDetailState;
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.userId || userData?.id;
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItem = product ? getCartItemInfo(product.pdid) : null;
  const itemInCart = !!cartItem;
  const itemQuantity = cartItem ? cartItem.quantity : 1;

  const demoImages = [
    "https://apiari.kuldeepchaurasia.in/Uploads/" + product?.image || '/placeholder-image.jpg',
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/f4258821-4583-407e-9882-650d32b364af.__CR0,0,300,300_PT0_SX300_V1___.jpg",
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/94c5ccbd-5093-4b45-a9dd-55fb709761fd.__CR0,0,300,300_PT0_SX300_V1___.jpg"
  ];
  const productId = String(id);
  const emptyGroupBuys = useMemo(() => [], []);
  const groupBuys = useSelector((state) => {

    const result = state.products.groupBuys?.[productId] || emptyGroupBuys;
    return result;
  });
  const handleGroupReady = useCallback((groupData) => {
    setCurrentGroupData(groupData);
    console.log('Received from GroupBuySection:', groupData); // gid, refercode, isGroupOwner
  }, []);
  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchWalletBalance(userData.id));
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (productId) {
      dispatch(fetchGroupBuysByProductId(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {

    if (groupBuys?.length > 0) {
    }
  }, [groupBuys]);

  // Update the isGroupOwner logic:
  useEffect(() => {
    if (groupBuys?.length > 0 && userId) {
      const userOwnedGroup = groupBuys.find(groupBuy =>
        groupBuy.cuserid === userId || groupBuy.userid === userId
      );
      setIsGroupOwner(!!userOwnedGroup);
    } else {
      setIsGroupOwner(false);
    }
  }, [groupBuys, userId]);


  const allGroupBuys = useSelector((state) => state.products.groupBuys);
  useEffect(() => {
  }, [allGroupBuys, productId]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (product) {
      // Update SEO meta tags
      seoHelper.updateProductSEO(product, {
        includePrice: true,
        includeBrand: true,
        customDescription: `${product.description} Available at ₹${product.price}. Free delivery and secure transaction.`
      });

      // Add structured data for rich snippets
      seoHelper.setProductStructuredData(product);
    }

    // Cleanup: Reset to default when component unmounts
    return () => {
      seoHelper.resetToDefault();
    };
  }, [product]);

  const handleJoinToOrder = () => {
    if (!userId) {
      toast.error("Please login to join group buy");
      return;
    }

    if (!currentGroupData?.gid) {
      toast.error("Group ID not found");
      return;
    }

    const { gid, refercode } = currentGroupData;
    navigator(`/group/join/${gid}${refercode ? `/${refercode}` : ''}`);
  };

  const handleShare = async () => {
    if (!product) return;

    const seoData = seoHelper.updateProductSEO(product);
    const shareText = `Check out this amazing product: ${product.productName}. ${product.shortdesc || ''} Starting from ₹${product.gprice}`;
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        // Browser share first
        await navigator.share({
          title: seoData.title,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Product shared successfully!');
      } else {
        // Capacitor native share as fallback
        await Share.share({
          title: seoData.title,
          text: shareText,
          url: shareUrl,
          dialogTitle: 'Share Product',
        });
        toast.success('Product shared successfully!');
      }
    } catch (error) {
      if (
        error.name !== 'AbortError' &&
        !error.message?.toLowerCase().includes('cancel')
      ) {
        toast.error('Failed to share product');
        console.error('Share error:', error);
      }
    }
  };
  // Enhanced isGroupOwner logic that checks both groupBuys and myJoinedGroups:
  useEffect(() => {
    if (userId && product?.id) {
      let hasCreatedGroup = false;

      // Check in groupBuys (from product slice)
      if (groupBuys?.length > 0) {
        hasCreatedGroup = groupBuys.some(groupBuy =>
          groupBuy.cuserid === userId || groupBuy.userid === userId
        );
      }

      // Also check in myJoinedGroups (from group slice) for groups this user created
      if (!hasCreatedGroup && myJoinedGroups?.length > 0) {
        hasCreatedGroup = myJoinedGroups.some(group =>
          (group.cuserid === userId || group.userid === userId) &&
          (group.pid === product.id || group.productId === product.id)
        );
      }

      setIsGroupOwner(hasCreatedGroup);
    } else {
      setIsGroupOwner(false);
    }
  }, [groupBuys, myJoinedGroups, userId, product?.id]);

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
  const wallet = isNaN(useWalletAmount) ? 0 : useWalletAmount;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] h-screen flex justify-center items-center bg-white/70 dark:bg-black/70">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
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
    console.log("clicked", product.id)
    const cartItemInfo = getCartItemInfo(product.id);
    console.log(cartItemInfo)
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
    if (!userId) {
      toast.error("Please login first");
      navigator("/auth")
      return;
    }

    if (!product?.id || !product?.pdid) {
      toast.error("Missing product information");
      return;
    }

    const payload = {
      pid: product.id,
      pdid: product.pdid,
      userid: userId,
      qty: 1,
      acctt: true,
      sipid: product.sipid || 0
    };

    try {
      setsaveLoading(true);
      const resultAction = await dispatch(createGroup(payload)).unwrap();
      toast.success("Group created successfully!");

      // Refresh both group buys and joined groups data
      await dispatch(fetchGroupBuysByProductId(product.id));
      if (userId) {
        await dispatch(fetchMyJoinedGroups(userId));
      }

      // IMPORTANT: Fetch refer code for the newly created group
      if (resultAction?.gid) {
        await dispatch(fetchGroupReferCodeById(resultAction.gid));
      }

    } catch (error) {
      console.error("Group creation failed:", error);
      toast.error(error?.message || "Failed to create group");
    } finally {
      setsaveLoading(false);
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
      toast.error('Already in wishlist');
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
  const regularPrice = product.netprice || 0;
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
              <div className="absolute top-3 right-3 z-[5] flex gap-2">
                {/* Share Button */}
                <motion.button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isSharing ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  ) : (
                    <Share2 className="w-5 h-5 stroke-gray-500 hover:stroke-blue-400" />
                  )}
                </motion.button>

                {/* Wishlist Button */}
                <motion.button
                  onClick={handleWishlist}
                  disabled={isAddingToWishlist}
                  className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center"
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
              </div>

              <AnimatePresence>
                <motion.img
                  key={product.image}
                  src={"https://apiari.kuldeepchaurasia.in/Uploads/" + product.image}
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
                <h2 className="text-2xl font-bold">
                  {product.productName.charAt(0).toUpperCase() + product.productName.slice(1)}
                </h2>

                <p className="text-sm text-gray-500">{product.weight} (Pack of {product.wweight})</p>

                <div className="flex items-center justify-between my-3">
                  <div className="flex items-end flex-wrap gap-2">
                    {/* Regular price */}
                    <div className="flex flex-col">
                      <span className="text-3xl font-bold text-green-600">₹{product.gprice}</span>

                      {/* Original price and discount badge */}
                      {product.originalPrice > 0 && product.originalPrice !== product.price && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                          {calculateDiscountPercentage() > 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              {calculateDiscountPercentage()}% OFF
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Group price - more prominent */}
                    {product.gprice > 0 && (
                      <div className="flex flex-col ml-2 border-l pl-2 border-gray-200">
                        <div className="flex items-center gap-1">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            GROUP PRICE
                          </span>
                        </div>
                        <span className="text-xs text-purple-600 font-medium">
                          Save {discountPercentage}% when you buy with friends
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category breadcrumb */}
                {/* {product.categoryName && (
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
                )} */}

                {/* Cashback section */}
                {wallet > 100 ? (
                  // ✅ Good balance
                  <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/10 border border-green-300 dark:border-green-500 px-3 py-2 rounded-md mb-3">
                    💰 Wallet Balance: <span className="font-semibold">₹{wallet}</span>
                    <span className="ml-1">– Ready to use on your next purchase!</span>
                  </div>
                ) : (
                  // ⚠ Low balance
                  <div className="text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-300 dark:border-yellow-500 px-3 py-2 rounded-md mb-3">
                    ⚠ Your wallet balance is low: <span className="font-semibold">₹{wallet}</span>
                    <span className="ml-1">– Top up to enjoy smoother shopping!</span>
                  </div>
                )}


                {/* Features */}
                <div className="flex items-center justify-between text-sm bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3">
                  <div className="flex-1 flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
                    <Truck className="h-5 w-5 text-green-500" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
                    <Lock className="h-5 w-5 text-blue-500" />
                    <span>Secure</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
                    <RefreshCcw className="h-5 w-5 text-orange-500" />
                    <span>Returnable</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>In Stock</span>
                  </div>
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
                  <div className="max-h-[400px] overflow-y-auto">
                    {validGroupBuys.map((groupBuy, index) => (
                      <div key={groupBuy.gid || index} className="mb-4">
                        <GroupBuySection
                          userId={userData?.userId || userData?.id}
                          product={{ ...product, gid: groupBuy.gid }}
                          onGroupReady={handleGroupReady}
                        />
                      </div>
                    ))}
                  </div>


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

              <div className="md:my-4">
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
                      <ReviewsComponent productId={product.pdid} />
                    </motion.div>
                  )}

                  {activeTab === "more you like" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <RecommendedProducts productId={product.id} className="max-w-6xl mx-auto md:px-4" />
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
          className="fixed bottom-0 left-0 right-0 z-50 
     bg-white/80 dark:bg-gray-900/60 
     backdrop-blur-md backdrop-saturate-150 
     dark:backdrop-blur-md dark:backdrop-saturate-150 
     p-4"
        >
          <div className="flex items-center text-center justify-between gap-4 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {showQuantityControls ? (
                <motion.div
                  key="quantity-controls"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-2 py-2 gap-4 shadow-lg"
                >
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={itemQuantity > 1 ? handleDecrease : handleRemove}
                    className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition disabled:opacity-50"
                    disabled={isAddingToCart}
                    title={itemQuantity > 1 ? "Decrease quantity" : "Remove from cart"}
                  >
                    {itemQuantity > 1 ? <Minus size={18} /> : <Trash2Icon className="text-gray-800" size={18} />}
                  </motion.button>

                  <motion.div
                    key={itemQuantity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-white font-bold text-lg min-w-[2rem] text-center"
                  >
                    {itemQuantity} {product.wtype}
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
                  className={`w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-2 px-5 rounded-full font-semibold shadow-lg flex flex-col items-center justify-center gap-0 transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                >
                  {saveloading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Adding...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <ShoppingCart size={20} />
                        <span>Buy Now </span>
                      </div>
                      <span className="text-sm leading-none mt-0.5">at ₹{regularPrice}</span>
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Group Buy Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={isGroupOwner ? handleJoinToOrder : handleCreateGroup}
              disabled={saveloading}
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-5 rounded-full font-semibold shadow-lg flex flex-col items-center justify-center gap-0 transition-all duration-200 ${saveloading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {saveloading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">
                    {isGroupOwner ? "Loading..." : "Creating..."}
                  </span>
                </div>
              ) : isGroupOwner ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <UserCheckIcon size={20} />
                    <span>Group Created</span>
                  </div>
                  <span className="text-xs leading-none mt-0.5">Go to order</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <Users size={20} />
                    <span>Save {discountPercentage}%</span>
                  </div>
                  <span className="text-[10px] leading-none mt-0.5">on group buy</span>
                </>
              )}
            </motion.button>


          </div>

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