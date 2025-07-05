import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, Check, Trash2, Plus, Minus, Heart } from "lucide-react";
import DProductCard from "./DProductcards";
import { fetchProductById } from "../../Store/productDetailSlice";
import { addToWishlist } from "../../Store/wishlistSlice";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ProductContentDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    isInCart,
    getItemQuantity
  } = useCart();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const productDetailState = useSelector((state) => state.productDetail) || {};
  const { product = null, loading = false, error = null } = productDetailState;
  const userData = useSelector((state) => state.auth.userData);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Safe usage — don't access product.id until after product is confirmed
  const itemInCart = product ? isInCart(product.id) : false;
  const itemQuantity = product ? getItemQuantity(product.id) : 0;

  // Comprehensive Debug logging
  console.log('=== CART DEBUG ===');
  console.log('Product:', product);
  console.log('Product ID:', product?.id);
  console.log('Product Name:', product?.productName || product?.name);
  console.log('Item in cart:', itemInCart);
  console.log('Item quantity:', itemQuantity);
  console.log('Is adding to cart:', isAddingToCart);
  console.log('Cart functions available:', {
    addToCart: typeof addToCart,
    isInCart: typeof isInCart,
    getItemQuantity: typeof getItemQuantity,
    updateQuantity: typeof updateQuantity,
    removeFromCart: typeof removeFromCart
  });
  console.log('=================');

  // Demo images for left side
  const demoImages = [
    product?.image || '/placeholder-image.jpg',
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/f4258821-4583-407e-9882-650d32b364af.__CR0,0,300,300_PT0_SX300_V1___.jpg",
    "https://m.media-amazon.com/images/S/aplus-media-library-service-media/94c5ccbd-5093-4b45-a9dd-55fb709761fd.__CR0,0,300,300_PT0_SX300_V1___.jpg"
  ];

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistItems && product?.id) {
      const isInWishlist = wishlistItems.some((item) => 
        item.pdid === product.id || item.productId === product.id || item.id === product.id
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistItems, product?.id]);

  // Debug cart state changes
  useEffect(() => {
    if (product?.id) {
      console.log('=== CART STATE CHANGED ===');
      console.log('Product ID:', product.id);
      console.log('isInCart:', isInCart(product.id));
      console.log('getItemQuantity:', getItemQuantity(product.id));
      console.log('itemInCart variable:', itemInCart);
      console.log('itemQuantity variable:', itemQuantity);
      console.log('========================');
    }
  }, [product?.id, itemInCart, itemQuantity, isInCart, getItemQuantity]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading product details...</div>;
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

    console.log('=== ADDING TO CART ===');
    console.log('Product before add:', product);
    console.log('Product ID:', product.id);
    console.log('Before add - isInCart:', isInCart(product.id));
    console.log('Before add - quantity:', getItemQuantity(product.id));

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product, 1);
      console.log('Add to cart result:', result);
      
      // Check immediately after
      console.log('After add - isInCart:', isInCart(product.id));
      console.log('After add - quantity:', getItemQuantity(product.id));
      
      // Force a small delay to see if state updates
      setTimeout(() => {
        console.log('After timeout - isInCart:', isInCart(product.id));
        console.log('After timeout - quantity:', getItemQuantity(product.id));
      }, 100);
      
      toast.success(`${product.productName || product.name} added to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleIncrease = async () => {
    try {
      await updateQuantity(product.id, itemQuantity + 1);
    } catch (error) {
      console.error("Error increasing quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleDecrease = async () => {
    if (itemQuantity > 1) {
      try {
        await updateQuantity(product.id, itemQuantity - 1);
      } catch (error) {
        console.error("Error decreasing quantity:", error);
        toast.error("Failed to update quantity");
      }
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

  return (
    <div className="hidden md:block bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative">
            <img
              src={demoImages[selectedImage]}
              alt={product.productName || product.name || 'Product'}
              className="rounded-lg w-full h-80 object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
            {/* Wishlist Heart Icon */}
            <button
              onClick={handleWishlist}
              disabled={isAddingToWishlist}
              className="absolute top-3 right-3 z-[5] w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToWishlist ? (
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart
                  className={`w-5 h-5 ${
                    isWishlisted 
                      ? "fill-red-500 stroke-red-500" 
                      : "stroke-gray-500 hover:stroke-red-400"
                  }`}
                />
              )}
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {demoImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 transition ${
                  selectedImage === index 
                    ? 'border-blue-500' 
                    : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <img
                  src={img}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="md:col-span-2 space-y-3">
          <h1 className="text-xl font-semibold">
            {product.productName || product.name || 'Unknown Product'}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 font-medium">
                {product.categoryName || 'Category'}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              ({product.reviews || 0} ratings) • {product.sold || 0} bought this month
            </span>
          </div>

          <div className="space-y-1">
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
          </div>

          <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/10 border border-orange-300 dark:border-orange-500 px-3 py-2 rounded-md">
            Cashback: Get 5% back with Amazon Pay ICICI Bank credit card for Prime members.
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mt-2 text-gray-700 dark:text-gray-300">
            <span>✔ Free Delivery</span>
            <span>✔ Secure Transaction</span>
            <span>✔ Returnable</span>
            <span>✔ Vegetarian</span>
          </div>
        </div>
      </div>

      <div className="border p-4 rounded-md mt-6 bg-gray-50 dark:bg-gray-800">
        {/* Debug Section - Remove this in production */}
        {/* <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Debug Info:</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Product ID: {product?.id} | 
            In Cart: {itemInCart ? 'Yes' : 'No'} | 
            Quantity: {itemQuantity} | 
            Adding: {isAddingToCart ? 'Yes' : 'No'}
          </p>
          <button 
            onClick={() => {
              console.log('Manual cart check:', {
                productId: product?.id,
                isInCart: isInCart(product?.id),
                quantity: getItemQuantity(product?.id),
                itemInCart,
                itemQuantity
              });
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Check Cart State
          </button>
        </div> */}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-green-600 font-medium">In Stock</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              FREE delivery today from 2 PM - 4 PM on orders over ₹249.
            </p>
          </div>

          {itemInCart && itemQuantity > 0 ? (
            <div className="mt-4 sm:mt-0 flex items-center gap-3 bg-white dark:bg-gray-700 rounded-full px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-600">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrease}
                disabled={isAddingToCart || itemQuantity <= 1}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </motion.button>

              <motion.span
                key={`quantity-${product.id}-${itemQuantity}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white"
              >
                {isAddingToCart ? '...' : itemQuantity}
              </motion.span>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrease}
                disabled={isAddingToCart}
                className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                disabled={isAddingToCart}
                className="ml-2 text-red-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="mt-4 sm:mt-0 w-36 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-md shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                "Add to Cart"
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Product Description</h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {product.shortdescription || product.description || "No description available."}
        </p>
      </div>

      {/* Image Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 bg-white dark:bg-gray-800 border rounded-md p-6 justify-center items-center">
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
      </div>

      {/* Ingredients */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
          {product.ingredients || "banana"}
        </p>
      </div>

      {/* Legal */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        {product.longdesc || product.longDescription || "No additional information available."}
      </div>

      {/* Related Products */}
      <h4 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300">
        Products related to this item
      </h4>
      <DProductCard product={product} />
    </div>
  );
}