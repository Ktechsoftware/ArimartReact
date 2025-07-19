import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, Check, Trash2, Plus, Minus, Heart, Users, ChevronsUp, LoaderCircle, ShoppingCart } from "lucide-react";
import DProductCard from "./DProductcards";
import { fetchProductById } from "../../Store/productDetailSlice";
import { addToWishlist } from "../../Store/wishlistSlice";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";
import toast, { LoaderIcon } from "react-hot-toast";
import { GroupBuySection } from "../../pages/GroupBuy/GroupBuySection";
import { createGroup, fetchAllGroups } from "../../Store/groupBuySlice";
import ProductReview from "../Reviews/ProductReview";
import { fetchGroupBuysByProductId } from "../../Store/productsSlice";
import { AnimatePresence } from "framer-motion";
import RecommendedProducts from "./RecommendedProducts";

export default function ProductContentDetail() {
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
  const [creatingGroup, setCreatingGroup] = useState(false);

  const productDetailState = useSelector((state) => state.productDetail) || {};
  const { product = null, loading = false, error = null } = productDetailState;
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const cartItem = product ? getCartItemInfo(product.id) : null;
  const itemInCart = !!cartItem;
  const itemQuantity = cartItem ? cartItem.quantity : 1;
  // console.log("cart quantity : ", itemQuantity)
  // Demo images for left side
  const demoImages = [
    "https://apiari.kuldeepchaurasia.in/" + product?.image || '/placeholder-image.jpg',
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/f4258821-4583-407e-9882-650d32b364af.__CR0,0,300,300_PT0_SX300_V1___.jpg",
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/94c5ccbd-5093-4b45-a9dd-55fb709761fd.__CR0,0,300,300_PT0_SX300_V1___.jpg"
  ];
  const productId = String(id); // 👈 ensure string type

  // 🧠 useMemo to avoid unnecessary rerenders
  const emptyGroupBuys = useMemo(() => [], []);

  // ✅ Selector (safe) - Get group buys from Redux store
  const groupBuys = useSelector((state) => {

    const result = state.products.groupBuys?.[productId] || emptyGroupBuys;
    return result;
  });

  // 🔄 Fetch group buys when product ID changes
  useEffect(() => {
    if (productId) {
      dispatch(fetchGroupBuysByProductId(productId));
    }
  }, [dispatch, productId]);

  // 🧪 Debug groupBuys data
  useEffect(() => {

    if (groupBuys?.length > 0) {
    }
  }, [groupBuys]);

  // 🧪 Debug full redux state (optional)
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

  // Helper function to check if we should show GroupBuySection
  const shouldShowGroupBuySection = useMemo(() => {
    if (!groupBuys || !Array.isArray(groupBuys) || groupBuys.length === 0) {
      return false;
    }

    // Check if any group buy has a valid gid
    const hasValidGid = groupBuys.some(groupBuy => {
      return groupBuy?.gid;
    });

    console.log("🔍 shouldShowGroupBuySection result:", hasValidGid);
    return hasValidGid;
  }, [groupBuys]);

  // Get the first valid group buy with gid
  const validGroupBuys = useMemo(() => {
    if (!Array.isArray(groupBuys)) return [];
    return groupBuys.filter((groupBuy) => groupBuy?.gid);
  }, [groupBuys]);


  // 🔍 Additional debugging for the async thunk response
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

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      setOptimisticInCart(true);
      // toast.success(`${product.productName || product.name} added to cart`);
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
      pid: product.id,
      pdid: product.pdid || product.id,
      userid: userId,
      qty: 1,
      acctt: true,
      sipid: product.sipid || 0
    };

    setCreatingGroup(true);
    try {
      const resultAction = await dispatch(createGroup(payload)).unwrap();
      toast.success("Group created successfully!");
      console.log("Created group:", resultAction);
      dispatch(fetchGroupBuysByProductId(product.id));
    } catch (error) {
      console.error("Group creation failed:", error);
      toast.error(error?.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
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

  // Calculate discount percentage safely
  const calculateDiscountPercentage = () => {
    if (product.totalprice && product.netprice && product.totalprice > 0) {
      return Math.round((1 - product.netprice / product.totalprice) * 100);
    }
    return 0;
  };

  // Get display price safely
  const getDisplayPrice = () => {
    return product.netprice || product.price || 0;
  };

  // Get original price safely
  const getOriginalPrice = () => {
    return product.totalprice || product.originalPrice || 0;
  };

  const regularPrice = product.netprice || product.price || 0;
  const groupPrice = product.gprice || 0;
  const discountPercentage =
    regularPrice > 0 ? Math.round((1 - groupPrice / regularPrice) * 100) : 0;

  return (
    <div className="hidden md:block bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative">
            <motion.img
              src={demoImages[selectedImage]}
              alt={product.productName}
              className="rounded-lg w-full h-80 object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            {/* Wishlist Heart Icon */}
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
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {demoImages.map((img, index) => (
              <motion.button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 transition ${selectedImage === index
                  ? 'border-blue-500'
                  : 'border-gray-200 dark:border-gray-600'
                  }`}
                whileHover={{ y: -5 }}
              >
                <img
                  src={img}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="md:col-span-2 space-y-3">
          <motion.h1
            className="text-xl font-semibold"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.productName}
          </motion.h1>

          <motion.div
            className="flex items-center gap-2 text-sm"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 font-medium">
                {product.categoryName} &gt; {product.subcategoryName} &gt; {product.childCategoryName}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="space-y-1"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-lime-600">
              ₹{getDisplayPrice()}
              {getOriginalPrice() > 0 && getOriginalPrice() !== getDisplayPrice() && (
                <span className="text-sm font-normal text-gray-400 line-through ml-2">
                  ₹{getOriginalPrice()}
                </span>
              )}
              {calculateDiscountPercentage() > 0 && (
                <span className="ml-2 text-red-500 font-semibold">
                  -{calculateDiscountPercentage()}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </motion.div>

          <motion.div
            className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/10 border border-orange-300 dark:border-orange-500 px-3 py-2 rounded-md"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Cashback: Get 5% back with Amazon Pay ICICI Bank credit card for Prime members.
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3 text-sm mt-2 text-gray-700 dark:text-gray-300"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span>✔ Free Delivery</span>
            <span>✔ Secure Transaction</span>
            <span>✔ Returnable</span>
            <span>✔ Vegetarian</span>
          </motion.div>
        </div>
      </div>

      <div className="py-3">
        <h3 className="text-2xl font-semibold">Currently running group</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">If you dont't have own group, you can any running group</p>
      </div>

      {/* Group Buy Discount Section - Only show if valid group buys exist */}
      {shouldShowGroupBuySection && validGroupBuys.map((groupBuy, index) => {
        const groupSpecificProduct = {
          pid: groupBuy.pid,
          pdid: groupBuy.pdid,
          gid: groupBuy.gid,
          ...product, // original product info
        };

        return (
          <motion.div
            key={groupBuy.gid || index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
            className="mt-6"
          >
            <GroupBuySection
              userId={userData?.userId || userData?.id}
              product={groupSpecificProduct}
            />
          </motion.div>
        );
      })}



      {/* Stock & Add to Cart Section */}
      <motion.div
        className="border border-gray-200 dark:border-gray-700 p-6 rounded-2xl mt-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-green-600 dark:text-green-400 font-semibold">In Stock</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              FREE delivery today from 2 PM - 4 PM on orders over ₹249.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-3">
            <AnimatePresence mode="wait">
              {showQuantityControls ? (
                <motion.div
                  key="quantity-controls"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full px-6 py-3 shadow-lg"
                >
                  <button
                    onClick={itemQuantity > 1 ? handleDecrease : handleRemove}
                    className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition disabled:opacity-50"
                    disabled={isAddingToCart}
                    title={itemQuantity > 1 ? "Decrease quantity" : "Remove from cart"}
                  >
                    {itemQuantity > 1 ? <Minus size={18} /> : <Trash2 size={18} />}
                  </button>
                  <span className="text-white font-semibold text-lg px-2 min-w-[2rem] text-center">
                    {itemQuantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition disabled:opacity-50"
                    disabled={isAddingToCart}
                    title="Increase quantity"
                  >
                    <Plus size={18} />
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.button
                    key="add-to-cart"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full sm:w-36 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-semibold px-3 py-3 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Add to Cart
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={handleCreateGroup}
                    disabled={creatingGroup}
                    className={`w-full sm:w-auto font-semibold px-6 py-2 rounded-full shadow-lg flex flex-col items-center justify-center gap-0 transition-all duration-200
    ${creatingGroup
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'}
  `}
                  >
                    <div className="flex items-center gap-2">
                      {creatingGroup ? (
                        <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                          <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
                          />
                        </svg>
                      ) : (
                        <Users size={20} />
                      )}
                      <span>{creatingGroup ? 'Creating...' : `Save ${discountPercentage}%`}</span>
                    </div>
                    {!creatingGroup && <span className="text-[10px] leading-none">on group buy</span>}
                  </motion.button>

                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Description Section */}
      <motion.div
        className="mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <h2 className="text-lg font-semibold mb-2">Product Description</h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {product.shortdesc || "No description available."}
        </p>
      </motion.div>

      {/* Health Benefits */}
      {product.pPros && (
        <motion.div
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-2">Health Benefits</h2>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.pPros }}
          />
        </motion.div>
      )}

      {/* Image Badges */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 bg-white dark:bg-gray-800 border rounded-md p-6 justify-center items-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55 }}
      >
        <img
          src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/f4258821-4583-407e-9882-650d32b364af.__CR0,0,300,300_PT0_SX300_V1___.jpg"
          alt="Verified"
          className="mx-auto"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <img
          src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/94c5ccbd-5093-4b45-a9dd-55fb709761fd.__CR0,0,300,300_PT0_SX300_V1___.jpg"
          alt="Verified"
          className="mx-auto"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <img
          src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/b5c01efa-26a5-4350-bfa5-bd697b45c5f3.__CR0,0,300,300_PT0_SX300_V1___.jpg"
          alt="Verified"
          className="mx-auto"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </motion.div>

      {/* Ingredients */}
      <motion.div
        className="mt-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
          {product.ingredients || "No ingredients listed."}
        </p>
      </motion.div>

      {/* Legal */}
      <motion.div
        className="mt-6 text-xs text-gray-500 dark:text-gray-400"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65 }}
        dangerouslySetInnerHTML={{ __html: product.longdesc || "No additional information available." }}
      />

      <ProductReview />
      {/* Related Products */}
      <RecommendedProducts productId={product.id} className="max-w-6xl mx-auto px-4"/>
    </div>
  );
}