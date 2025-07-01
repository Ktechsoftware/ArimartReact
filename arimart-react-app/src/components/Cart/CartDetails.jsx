// CartDetails.jsx
import { Trash2, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PromoCodeInput from './PromoCodeInput';
import {
  fetchCartByUserId,
  fetchCartByUserAndGroup,
  updateItemQuantityLocal,
  removeItemLocal,
  updateCartItemQuantity,
  removeFromCart,
  clearErrors,
  setUserId,
  setGroupId
} from '../../Store/cartSlice'; // Adjust path as needed
import EmptyCart from './EmptyCart'; // Adjust path as needed

export default function CartDetails() {
  const dispatch = useDispatch();
  const {
    items,
    loading,
    error,
    totalItems,
    subtotal,
    userId,
    groupId,
    addToCartLoading,
    addToCartError
  } = useSelector((state) => state.cart);

  // You can get userId from auth state or props
  const { user } = useSelector((state) => state.auth); // Assuming you have auth slice
  
  const [localLoading, setLocalLoading] = useState({});
  
  // Static values for demo - you can make these dynamic
  const shipping = 30;
  const discount = 10;
  const total = subtotal + shipping - discount;

  // Set user ID when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(setUserId(user.id));
    }
  }, [dispatch, user]);

  // Fetch cart when userId changes
  useEffect(() => {
    if (userId) {
      if (groupId) {
        dispatch(fetchCartByUserAndGroup({ userId, groupId }));
      } else {
        dispatch(fetchCartByUserId(userId));
      }
    }
  }, [dispatch, userId, groupId]);

  // Handle quantity update with optimistic UI updates
  const updateQuantity = async (item, delta) => {
    const newQuantity = Math.max(1, (item.Qty || item.quantity || 1) + delta);
    const itemId = item.Id || item.id;
    
    // Optimistic update
    dispatch(updateItemQuantityLocal({ itemId, quantity: newQuantity }));
    
    setLocalLoading(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Update on server
      await dispatch(updateCartItemQuantity({ 
        cartItemId: itemId, 
        quantity: newQuantity 
      })).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateItemQuantityLocal({ 
        itemId, 
        quantity: (item.Qty || item.quantity || 1) 
      }));
      console.error('Failed to update quantity:', error);
    } finally {
      setLocalLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Handle item removal with optimistic UI updates
  const removeItem = async (item) => {
    const itemId = item.Id || item.id;
    
    // Optimistic update
    dispatch(removeItemLocal(itemId));
    
    setLocalLoading(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Remove from server
      await dispatch(removeFromCart(itemId)).unwrap();
    } catch (error) {
      // You might want to re-fetch cart on error or show error message
      console.error('Failed to remove item:', error);
      // Optionally refetch cart
      if (userId) {
        dispatch(fetchCartByUserId(userId));
      }
    } finally {
      setLocalLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  if (loading && items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !items.length) {
    return (
      <div className="max-w-6xl mx-auto p-4 text-center">
        <div className="text-red-500 dark:text-red-400">
          <p>Error loading cart: {error.message || error}</p>
          <button 
            onClick={() => userId && dispatch(fetchCartByUserId(userId))}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 text-gray-800 dark:text-gray-100 rounded-2xl"
    >
      <AnimatePresence>
        {items.length === 0 ? (
          <EmptyCart/>
        ) : (
          
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-gray-800 dark:text-gray-100 font-bold">
          Your Items {totalItems > 0 && `(${totalItems})`}
        </h2>
        {(error || addToCartError) && (
          <div className="text-red-500 text-sm">
            {error?.message || addToCartError?.message || 'An error occurred'}
          </div>
        )}
      </div>
            {items.map(item => {
              const itemId = item.Id || item.id;
              const itemName = item.ProductName || item.name || 'Unknown Product';
              const itemDescription = item.Description || item.description || '';
              const itemPrice = item.Price || item.price || 0;
              const itemQuantity = item.Qty || item.quantity || 1;
              const itemImage = item.Image || item.image || '/placeholder-image.png';
              const isItemLoading = localLoading[itemId];

              return (
                <motion.div
                  key={itemId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl relative ${
                    isItemLoading ? 'opacity-50' : ''
                  }`}
                >
                  <img 
                    src={itemImage} 
                    alt={itemName} 
                    className="w-16 h-16 rounded-lg object-cover" 
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{itemName}</h3>
                    {itemDescription && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{itemDescription}</p>
                    )}
                    <p className="font-bold mt-1">₹{itemPrice.toFixed(2)}</p>
                  </div>
                  
                  {/* Quantity controls and trash button at the bottom */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-2 py-1 shadow-sm">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item, -1)}
                        disabled={isItemLoading || itemQuantity <= 1}
                        className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition disabled:opacity-50"
                      >
                        <Minus className="w-3 h-3" />
                      </motion.button>
                      
                      <motion.span 
                        key={`quantity-${itemId}-${itemQuantity}`}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-sm font-medium w-5 text-center"
                      >
                        {isItemLoading ? '...' : itemQuantity}
                      </motion.span>
                      
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item, 1)}
                        disabled={isItemLoading}
                        className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition disabled:opacity-50"
                      >
                        <Plus className="w-3 h-3" />
                      </motion.button>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item)}
                      disabled={isItemLoading}
                      className="text-red-400 hover:text-red-600 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {items.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-6 space-y-3"
        >
          <PromoCodeInput/>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Discount</span>
              <span>₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span className="text-green-500">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout" className="sticky bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 z-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || addToCartLoading}
              className="w-full max-w-md bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl shadow-lg transition"
            >
              {loading || addToCartLoading ? 'Processing...' : 'Proceed To Payment'}
            </motion.button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}