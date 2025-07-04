// contexts/CartContext.jsx - Updated to work with Redux
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCartByUserId,
  addToCartByUser,
  removeFromCart as removeFromCartRedux,
  updateCartItemQuantity,
  clearCart as clearCartRedux
} from '../Store/cartSlice';
import toast from 'react-hot-toast';

// Cart Context
const CartContext = createContext();

// Action types for local state management
const CART_ACTIONS = {
  LOAD_CART: 'LOAD_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SYNC_SUCCESS: 'SYNC_SUCCESS',
  SYNC_FAILURE: 'SYNC_FAILURE'
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  loading: false,
  error: null,
  syncStatus: 'idle',
  lastSyncTime: null
};

// Helper function to normalize cart items from different sources
const normalizeCartItem = (item) => ({
  id: item.Id || item.id,
  name: item.ProductName || item.productName || item.name,
  price: item.Price || item.netprice || item.price,
  image: item.Image || item.image,
  categoryName: item.CategoryName || item.categoryName,
  subcategoryName: item.SubcategoryName || item.subcategoryName,
  quantity: item.Qty || item.quantity || 1,
  // Keep original item for API calls
  originalItem: item
});

// Helper function to calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, subtotal };
};

// Cart reducer for local state
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART: {
      const normalizedItems = action.payload.items.map(normalizeCartItem);
      const { totalItems, subtotal } = calculateTotals(normalizedItems);

      return {
        ...state,
        items: normalizedItems,
        totalItems,
        subtotal
      };
    }

    case CART_ACTIONS.ADD_ITEM: {
      const newItem = normalizeCartItem(action.payload);
      const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        newItems = [...state.items, newItem];
      }

      const { totalItems, subtotal } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        subtotal
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );

      const { totalItems, subtotal } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        subtotal
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const { totalItems, subtotal } = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        totalItems,
        subtotal
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        subtotal: 0
      };

    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case CART_ACTIONS.SYNC_SUCCESS:
      return {
        ...state,
        syncStatus: 'success',
        lastSyncTime: new Date().toISOString(),
        error: null
      };

    case CART_ACTIONS.SYNC_FAILURE:
      return {
        ...state,
        syncStatus: 'error',
        error: action.payload
      };

    default:
      return state;
  }
}

// LocalStorage utilities
const LOCAL_STORAGE_KEY = 'user_cart';

const localStorageUtils = {
  getCart: () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialState;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialState;
    }
  },

  setCart: (cartState) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        items: cartState.items,
        totalItems: cartState.totalItems,
        subtotal: cartState.subtotal,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  clearCart: () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Cart Provider Component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const reduxDispatch = useDispatch();

  // Get Redux cart state
  const reduxCartState = useSelector((state) => state.cart);
  const userData = useSelector((state) => state.auth.userData);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = isAuthenticated ? userData?.id : null;

  // Sync Redux cart data with local state when it changes
  useEffect(() => {
    if (reduxCartState.items && reduxCartState.items.length > 0) {
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: { items: reduxCartState.items }
      });
    }
  }, [reduxCartState.items]);

  // Load cart from localStorage on mount (for offline capability)
  useEffect(() => {
    const storedCart = localStorageUtils.getCart();
    if (storedCart.items && storedCart.items.length > 0 && !userId) {
      // Only load from localStorage if user is not logged in
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: storedCart
      });
    }
  }, [userId]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorageUtils.setCart(state);
  }, [state.items, state.totalItems, state.subtotal]);

  // Clear cart on logout
  useEffect(() => {
    if (!userId && isAuthenticated === false) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      localStorageUtils.clearCart();
    }
  }, [userId, isAuthenticated]);

  // Fetch cart from server when user logs in
  // ✅ Load cart from server when userId becomes available
  useEffect(() => {
    if (userId) {
      loadCartFromServer();
    }
  }, [userId]);

  // ✅ Load cart from DB via Redux and sync to local state + localStorage
  const loadCartFromServer = async () => {
    if (!userId) return;

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      // Fetch cart via Redux thunk
      const cartItems = await reduxDispatch(fetchCartByUserId(userId)).unwrap();

      // Load into local state
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: { items: cartItems }
      });

      dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message || 'Unknown error' });
      dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message || 'Unknown error' });
      toast.error('Failed to load cart from server');
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };


  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    const cartItem = {
      id: product.id,
      name: product.productName || product.name,
      price: product.netprice || product.price,
      image: product.image,
      categoryName: product.categoryName,
      subcategoryName: product.subcategoryName,
      quantity: quantity
    };

    // Add to local state immediately for better UX
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: cartItem
    });

    toast.success(`${cartItem.name} added to cart`);

    // Sync with server if user is logged in
    if (userId) {
      try {
        await reduxDispatch(addToCartByUser({
          userId,
          productId: product.id,
          quantity: quantity,
          price: product.netprice || product.price
        })).unwrap();

        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        console.error('Failed to sync with server:', error);
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    const item = state.items.find(item => item.id === itemId);
    const oldQuantity = item?.quantity;

    // Update local state immediately
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: itemId, quantity: newQuantity }
    });

    // Sync with server if user is logged in
    if (userId && item?.originalItem) {
      try {
        const cartItemId = item.originalItem.Id || item.originalItem.id;
        await reduxDispatch(updateCartItemQuantity({
          cartItemId,
          quantity: newQuantity
        })).unwrap();

        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        // Revert on failure
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY,
          payload: { id: itemId, quantity: oldQuantity }
        });
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to update quantity');
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    const item = state.items.find(item => item.id === itemId);
    const itemToRemove = { ...item };

    // Remove from local state immediately
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id: itemId }
    });

    toast.success(`${itemToRemove?.name || 'Item'} removed from cart`);

    // Sync with server if user is logged in
    if (userId && item?.originalItem) {
      try {
        const cartItemId = item.originalItem.Id || item.originalItem.id;
        await reduxDispatch(removeFromCartRedux(cartItemId)).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        // Restore on failure
        dispatch({
          type: CART_ACTIONS.ADD_ITEM,
          payload: itemToRemove
        });
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to remove item');
      }
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    const oldItems = [...state.items];

    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    localStorageUtils.clearCart();

    toast.success('Cart cleared');

    // Sync with server if user is logged in
    if (userId) {
      try {
        await reduxDispatch(clearCartRedux()).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        // Restore on failure
        oldItems.forEach(item => {
          dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
        });
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to clear cart');
      }
    }
  };

  // Get item quantity
  const getItemQuantity = (itemId) => {
    const item = state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (itemId) => {
    return state.items.some(item => item.id === itemId);
  };

  // Sync cart with server manually
  const syncCartWithServer = async () => {
    if (userId) {
      await loadCartFromServer();
    }
  };

  const contextValue = {
    // State (prioritize local state for real-time updates)
    items: state.items,
    totalItems: state.totalItems,
    subtotal: state.subtotal,
    loading: state.loading || reduxCartState.loading,
    error: state.error || reduxCartState.error,
    syncStatus: state.syncStatus,
    lastSyncTime: state.lastSyncTime,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCartWithServer,
    loadCartFromServer,

    // Utilities
    getItemQuantity,
    isInCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}