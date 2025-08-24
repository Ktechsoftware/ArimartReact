import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Flame, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Search,
  ArrowLeft,
  Loader2,
  Heart,
  Plus,
  Minus,
  Star,
  ShoppingCart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { addToWishlist } from '../../Store/wishlistSlice';
import { fetchHomepageSections } from '../../Store/PopularSlice/popularProductsSlice';

// Mock data - replace with your actual Redux actions
const mockProducts = [
  {
    id: 1,
    pdid: 1,
    productName: "Premium Organic Honey",
    categoryName: "Food & Beverages",
    subcategoryName: "Honey",
    image: "honey1.jpg",
    netprice: 299,
    totalprice: 399,
    gprice: 249,
    wweight: "500g",
    shortdesc: "Pure organic honey sourced from mountain regions",
    isAvl: "In Stock",
    rating: 4.5
  },
  {
    id: 2,
    pdid: 2,
    productName: "Natural Bee Pollen",
    categoryName: "Health & Wellness",
    subcategoryName: "Supplements",
    image: "pollen1.jpg",
    netprice: 199,
    totalprice: 299,
    gprice: 179,
    wweight: "250g",
    shortdesc: "Rich in vitamins and minerals",
    isAvl: "In Stock",
    rating: 4.2
  },
  {
    id: 3,
    pdid: 3,
    productName: "Royal Jelly Capsules",
    categoryName: "Health & Wellness",
    subcategoryName: "Supplements",
    image: "royal-jelly.jpg",
    netprice: 599,
    totalprice: 799,
    gprice: 549,
    wweight: "60 capsules",
    shortdesc: "Premium royal jelly for health benefits",
    isAvl: "Limited Stock",
    rating: 4.8
  },
  {
    id: 4,
    pdid: 4,
    productName: "Manuka Honey",
    categoryName: "Food & Beverages",
    subcategoryName: "Honey",
    image: "manuka.jpg",
    netprice: 899,
    totalprice: 1199,
    gprice: 799,
    wweight: "250g",
    shortdesc: "Premium Manuka honey from New Zealand",
    isAvl: "In Stock",
    rating: 4.9
  },
  {
    id: 5,
    pdid: 5,
    productName: "Beeswax Candles Set",
    categoryName: "Home & Garden",
    subcategoryName: "Candles",
    image: "candles.jpg",
    netprice: 149,
    totalprice: 249,
    gprice: 129,
    wweight: "4 pieces",
    shortdesc: "Natural beeswax candles for ambiance",
    isAvl: "In Stock",
    rating: 4.3
  },
  {
    id: 6,
    pdid: 6,
    productName: "Propolis Tincture",
    categoryName: "Health & Wellness",
    subcategoryName: "Natural Remedies",
    image: "propolis.jpg",
    netprice: 349,
    totalprice: 449,
    gprice: 299,
    wweight: "30ml",
    shortdesc: "Natural propolis for immune support",
    isAvl: "In Stock",
    rating: 4.6
  }
];

const HotDeals = () => {
  const dispatch = useDispatch();
    const { homepageSections } = useSelector(state => state.popularProducts);
    const userData = useSelector((state) => state.auth.userData);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const { addToCart, isItemInCart, getItemQuantity, updateQuantity } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
      dispatch(fetchHomepageSections());
    }, [dispatch]);
  
   const getSpecialDealsProducts = () => {
  if (!homepageSections.sections) return mockProducts; // fallback to mockProducts

  const dealsSection = homepageSections.sections.find(
    section => section.key === 'deals' || section.key === 'special-deals' || section.key === 'hot-deals'
  );

  // return ALL products, not just 5
  return dealsSection?.products || mockProducts;
};
  
    const products = getSpecialDealsProducts();
  // UI State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'price' | 'discount'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Cart states
  const [cartItems, setCartItems] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

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
console.log(products)
  if (products.length === 0) {
    return (
      <div className="w-full h-[400px] flex flex-col items-center justify-center text-gray-500">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Today's Hot Deals 🔥</h2>
        <p>No special deals available</p>
      </div>
    );
  }
  const categories = [...new Set(products.map(p => p.categoryName))];
  const filteredAndSortedProducts = products
  .filter(p => 
    (filterCategory === 'all' || p.categoryName === filterCategory) &&
    p.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.productName.localeCompare(b.productName) 
        : b.productName.localeCompare(a.productName);
    }
    if (sortBy === 'price') {
      return sortOrder === 'asc' 
        ? a.netprice - b.netprice 
        : b.netprice - a.netprice;
    }
    if (sortBy === 'discount') {
      const aDisc = ((a.totalprice - a.netprice) / a.totalprice) * 100;
      const bDisc = ((b.totalprice - b.netprice) / b.totalprice) * 100;
      return sortOrder === 'asc' ? aDisc - bDisc : bDisc - aDisc;
    }
    return 0;
  });

//   const discountPercentage = getDiscountPercentage(currentProduct.price, currentProduct.discountprice);
//   const displayPrice = parsePrice(currentProduct.price) > 0 ? parsePrice(currentProduct.netprice) : parsePrice(currentProduct.price);
//   const originalPrice = parsePrice(currentProduct.price);
//   const imageUrl = currentProduct.image
//     ? `https://apiari.kuldeepchaurasia.in/Uploads/${currentProduct.image}`
//     : '/placeholder-image.jpg';
//   const inCart = isItemInCart(currentProduct.id);
//   const quantity = getItemQuantity(currentProduct.id);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading deals: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Hot Deals 🔥
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredAndSortedProducts.length} amazing deals available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No deals found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
            : 'space-y-4'
          }>
            <AnimatePresence>
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  isItemInCart={isItemInCart}
                  getItemQuantity={getItemQuantity}
                  addToCart={addToCart}
                  updateQuantity={updateQuantity}
                  handleWishlist={handleWishlist}
                  wishlistItems={wishlistItems}
                  loadingStates={loadingStates}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ 
  product, 
  viewMode, 
  isItemInCart, 
  getItemQuantity, 
  addToCart, 
  updateQuantity,
  handleWishlist,
  wishlistItems,
  loadingStates,
  index 
}) => {
  const itemInCart = isItemInCart(product.id);
  const itemQuantity = getItemQuantity(product.id);
  const isWishlisted = wishlistItems.includes(product.id);
  const isLoading = loadingStates[product.id];
  
  const discountPercentage = Math.round(((product.totalprice - product.netprice) / product.totalprice) * 100);
  
  const imageUrl = `https://apiari.kuldeepchaurasia.in/Uploads/${product.image}`;

  const generateProductLink = () => {
    const marketParam = product.categoryName || "";
    const subcategoryParam = product.subcategoryName || product.productName || "";
    return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/product/${product.id}`;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-6">
          {/* Product Image */}
          <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={product.productName}
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = '/placeholder-image.jpg'}
            />
            {discountPercentage > 0 && (
              <span className="absolute top-1 left-1 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <Link to={generateProductLink()} className="hover:text-orange-500 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {product.productName}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {product.shortdesc}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{product.netprice}
                </span>
                <span className="text-sm line-through text-gray-400 ml-2">
                  ₹{product.totalprice}
                </span>
              </div>
              <span className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 px-2 py-1 rounded">
                Group: ₹{product.gprice}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleWishlist(product)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'}`} />
            </button>
            
            {itemInCart ? (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => updateQuantity(product.id, itemQuantity - 1)}
                  className="p-2 hover:text-red-500 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 text-sm font-medium">{itemQuantity}</span>
                <button
                  onClick={() => updateQuantity(product.id, itemQuantity + 1)}
                  className="p-2 hover:text-green-500 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative hover:shadow-lg transition-all"
    >
      {/* Wishlist Button */}
      <button
        onClick={() => handleWishlist(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-md hover:scale-105 transition-transform"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'}`} />
      </button>

      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Product Image */}
      <Link to={generateProductLink()} className="block">
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
          <img
            src={imageUrl}
            alt={product.productName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => e.target.src = '/placeholder-image.jpg'}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <Link to={generateProductLink()} className="hover:text-orange-500 transition-colors">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm">
            {product.productName}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">{product.categoryName}</p>
        
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.rating})</span>
        </div>

        <p className="text-xs text-blue-600 dark:text-blue-400">{product.wweight}</p>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 dark:text-white">₹{product.netprice}</span>
          <span className="text-xs line-through text-gray-400">₹{product.totalprice}</span>
        </div>

        <div className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 px-2 py-1 rounded inline-block">
          Group: ₹{product.gprice}
        </div>
      </div>

      {/* Add to Cart */}
      <div className="mt-4">
        {itemInCart ? (
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
            <button
              onClick={() => updateQuantity(product.id, itemQuantity - 1)}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 p-1"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-sm">{itemQuantity}</span>
            <button
              onClick={() => updateQuantity(product.id, itemQuantity + 1)}
              className="text-gray-600 dark:text-gray-300 hover:text-green-500 p-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            disabled={isLoading}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default HotDeals;