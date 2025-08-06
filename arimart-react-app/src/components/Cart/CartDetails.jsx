// CartDetails.jsx - Uses separated regularCartItems and groupCartItems from CartContext

import { Trash2, Plus, Minus, RefreshCw, Group, ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PromoCodeInput from './PromoCodeInput';
import EmptyCart from './EmptyCart';
import { useCart } from '../../context/CartContext';
import CheckoutConfirmModal from './CheckoutConfirmModal';

export default function CartDetails() {
  const location = useLocation();
  
  // Check URL params for tab, default to "cart"
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    return tab === 'group' ? 'group' : 'cart';
  };
  
  const [selectedTab, setSelectedTab] = useState(getInitialTab());
  const {
    regularCartItems,
    groupCartItems,
    totalItems,
    subtotal,
    groupTotalItems,
    groupSubtotal,
    updateQuantity,
    removeFromCart,
    loading,
    syncStatus,
    loadCartFromServer,
    loadGroupCart,
    setCurrentGroup,
    clearCurrentGroup
  } = useCart();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [localLoading, setLocalLoading] = useState({});
  const userId = useSelector((state) => state.auth.userData?.id);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch both carts on mount (for authenticated users)
  useEffect(() => {
    if (isAuthenticated && userId) {
      // Load regular cart
      loadCartFromServer();
      // Load group cart
      loadGroupCart();
    }
  }, [isAuthenticated, userId]);

  // Handle tab-specific loading
  useEffect(() => {
    if (selectedTab === "group" && isAuthenticated && userId) {
      if (groupCartItems.length === 0) {
        loadGroupCart();
      }
    }
  }, [selectedTab, isAuthenticated, userId]);

  const handleTabSwitch = async (tab) => {
    setSelectedTab(tab);

    if (tab === "group") {
      if (userId) {
        try {
          await loadGroupCart();
        } catch (error) {
          console.error('Failed to load group cart:', error);
        }
      }
    } else {
      clearCurrentGroup();
    }
  };

  // Calculate order totals for selected tab
  const displayItems = selectedTab === "cart" ? regularCartItems : groupCartItems;
  const displayTotalItems = selectedTab === "cart" ? totalItems : groupTotalItems;
  const displaySubtotal = selectedTab === "cart" ? subtotal : groupSubtotal;

  const shipping = displaySubtotal > 500 ? 0 : 30;
  const discount = Math.min(displaySubtotal * 0.05, 50);
  const total = displaySubtotal + shipping - discount;

  const handleUpdateQuantity = async (item, delta) => {
    const newQuantity = Math.max(1, (item.quantity || 1) + delta);
    const itemId = item.id;
    const groupId = selectedTab === "group" ? item.groupId : null;

    console.log("Updating quantity:", itemId, "item:", item, "groupId:", groupId);

    setLocalLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      await updateQuantity(itemId, newQuantity, groupId);
    } catch (error) {
      console.error('Update quantity failed:', error);
    } finally {
      setLocalLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (item) => {
    const itemId = item.id;
    const groupId = selectedTab === "group" ? item.groupId : null;

    console.log("Removing item:", itemId, "groupId:", groupId);

    setLocalLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      await removeFromCart(itemId, groupId);
    } catch (error) {
      console.error('Remove item failed:', error);
    } finally {
      setLocalLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleSyncCart = async () => {
    if (isAuthenticated) {
      await loadCartFromServer();
      if (selectedTab === "group") {
        await loadGroupCart();
      }
    }
  };

  const handleModalCheckout = (type) => {
    setCheckoutModalOpen(false);
    if (type === "both") {
      navigate("/checkout?cart=both");
    } else if (type === "current") {
      navigate(`/checkout?cart=${selectedTab}`); // "cart" or "group"
    }
  };

  if (loading && displayItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your cart...</p>
      </div>
    );
  }

  const generateProductLink = (categoryName, subcategoryName, productId) => {
    const marketParam = categoryName || "";
    const subcategoryParam = subcategoryName || "";
    return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/product/${productId}`;
  };

  const renderCartItems = (cartItems, cartType) => {
    if (cartItems.length === 0) {
      return cartType === "group" ? (
        <motion.div
          key="group-cart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-center py-10 text-gray-600 dark:text-gray-400"
        >
          <ShoppingBasket
            className="mx-auto mb-4 w-40 h-40 opacity-80"
          />
          <p className="text-lg font-semibold">Your group cart is empty</p>
          <p className="text-sm mt-1">Start shopping with friends or join a group deal.</p>
        </motion.div>
      ) : (
        <EmptyCart />
      );
    }

    return (
      <div className="space-y-4">
        {/* Header with sync status */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg text-gray-800 dark:text-gray-100 font-bold">
            {cartType === "group" ? "Group Cart" : "Your Cart"} ({displayTotalItems} {displayTotalItems === 1 ? 'item' : 'items'})
          </h2>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                {syncStatus === 'syncing' && (
                  <div className="flex items-center text-blue-500 text-sm">
                    <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                    Syncing...
                  </div>
                )}
                {syncStatus === 'success' && (
                  <div className="text-green-500 text-sm">✓ Synced</div>
                )}
                {syncStatus === 'error' && (
                  <button
                    onClick={handleSyncCart}
                    className="text-red-500 hover:text-red-600 text-sm flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Retry Sync
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="space-y-3">
          {cartItems.map(item => {
            const productLink = generateProductLink(item.categoryName, item.subcategoryName, item.originalItem.pid);
            console.log(item)
            const isItemLoading = localLoading[item.id];
            const itemPrice = item.price;
            const itemName = item.name;
            const itemQuantity = item.quantity || 1;
            return (
              <motion.div
                key={`${item.id}-${item.groupId || 'individual'}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl relative border ${isItemLoading ? 'opacity-50' : ''
                  } ${isItemLoading ? 'border-orange-200' : 'border-gray-200 dark:border-gray-700'}`}
              >
                {isItemLoading && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 rounded-xl flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Product Image */}
                <Link to={productLink} className="relative">
                  <img
                    src={"https://apiari.kuldeepchaurasia.in/Uploads/" + item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/80/80';
                    }}
                  />
                </Link>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                    {itemName}
                  </h3>

                  {item.categoryName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {item.categoryName}
                      {item.subcategoryName && ` • ${item.subcategoryName}`}
                    </p>
                  )}

                  {cartType === "group" && item.groupId && (
                    <p className="text-xs text-orange-500 dark:text-orange-400 mb-1">
                      Group Code:{' '}
                      <span className="inline-block bg-green-100 dark:bg-blue-700 text-green-800 dark:text-green-100 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        {item.originalItem.groupcode}
                      </span>
                      {item.gprice && <span></span>}
                    </p>
                  )}


                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-green-600 dark:text-green-400">
                      ₹{cartType === "group" && item.gprice ? item.gprice : item.price}
                      {cartType === "group" && item.gprice && (
                        <>
                          &nbsp;
                        </>
                      )}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-600">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateQuantity(item, -1)}
                          disabled={isItemLoading || item.quantity <= 1}
                          className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>

                        <motion.span
                          key={`quantity-${item.id}-${item.quantity}`}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-sm font-semibold min-w-[2rem] text-center text-gray-900 dark:text-white"
                        >
                          {isItemLoading ? '...' : item.quantity + " " + item.originalItem.unittype}
                        </motion.span>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdateQuantity(item, 1)}
                          disabled={isItemLoading}
                          className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveItem(item)}
                        disabled={isItemLoading}
                        className="text-red-400 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Item subtotal */}
                  {item.quantity > 1 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ₹{cartType === "group" && item.gprice ? item.gprice : item.price} × {item.quantity} = ₹{((cartType === "group" && item.gprice ? item.gprice : item.price) * item.quantity).toFixed(2)}
                    </p>
                  )}


                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 space-y-4"
        >
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Order Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Subtotal ({displayTotalItems} {displayTotalItems === 1 ? 'item' : 'items'})
              </span>
              <span className="font-medium">₹{displaySubtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Shipping {displaySubtotal > 500 && '(Free over ₹500)'}
              </span>
              <span className={`font-medium ${shipping === 0 ? 'text-green-500' : ''}`}>
                {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Discount (5%)</span>
                <span className="font-medium text-green-500">-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-green-500">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          {/* <Link to="/checkout" className="block mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Proceed to Checkout • ₹{total.toFixed(2)}</span>
              )}
            </motion.button>
          </Link> */}
          <button
            type="button"
            onClick={() => setCheckoutModalOpen(true)}
            className="w-full sticky bottom-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            Proceed to Checkout • ₹{total.toFixed(2)}
          </button>
          <CheckoutConfirmModal
            isOpen={checkoutModalOpen}
            onClose={() => setCheckoutModalOpen(false)}
            onCheckoutBoth={() => handleModalCheckout("both")}
            onCheckoutCurrent={() => handleModalCheckout("current")}
            cartType={selectedTab}
          />

          {/* Continue Shopping Link */}
          <Link
            to="/"
            className="block text-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition mt-3"
          >
            ← Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 text-gray-800 dark:text-gray-100 rounded-2xl"
    >
      {/* Tab Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 shadow-inner">
          <button
            onClick={() => handleTabSwitch("cart")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${selectedTab === "cart"
              ? "bg-white dark:bg-gray-900 text-green-600"
              : "text-gray-500 dark:text-gray-300"
              }`}
          >
            My Cart
          </button>
          <button
            onClick={() => handleTabSwitch("group")}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${selectedTab === "group"
              ? "bg-white dark:bg-gray-900 text-green-600"
              : "text-gray-500 dark:text-gray-300"
              }`}
          >
            Group Cart
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderCartItems(displayItems, selectedTab)}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}