// CartContext.jsx - Fixed version with proper cart restoration on reload

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCartByUserId,
  fetchCartByUserAndGroup,
  addToCartByUser,
  removeFromCart as removeFromCartRedux,
  updateCartItemQuantity,
  clearCart as clearCartRedux
} from '../Store/cartSlice';
import toast from 'react-hot-toast';

const CartContext = createContext();

const CART_ACTIONS = {
  LOAD_REGULAR_CART: 'LOAD_REGULAR_CART',
  LOAD_GROUP_CART: 'LOAD_GROUP_CART',
  ADD_ITEM_REGULAR: 'ADD_ITEM_REGULAR',
  ADD_ITEM_GROUP: 'ADD_ITEM_GROUP',
  UPDATE_QUANTITY_REGULAR: 'UPDATE_QUANTITY_REGULAR',
  UPDATE_QUANTITY_GROUP: 'UPDATE_QUANTITY_GROUP',
  REMOVE_ITEM_REGULAR: 'REMOVE_ITEM_REGULAR',
  REMOVE_ITEM_GROUP: 'REMOVE_ITEM_GROUP',
  CLEAR_REGULAR_CART: 'CLEAR_REGULAR_CART',
  CLEAR_GROUP_CART: 'CLEAR_GROUP_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SYNC_SUCCESS: 'SYNC_SUCCESS',
  SYNC_FAILURE: 'SYNC_FAILURE',
  SET_CURRENT_GROUP: 'SET_CURRENT_GROUP',
  CLEAR_CURRENT_GROUP: 'CLEAR_CURRENT_GROUP'
};

// Helper function to get/set currentGroupId from memory storage
const getStoredGroupId = () => {
  try {
    return window.cartGroupId || null;
  } catch (error) {
    return null;
  }
};

const setStoredGroupId = (groupId) => {
  try {
    if (groupId) {
      window.cartGroupId = groupId;
    } else {
      delete window.cartGroupId;
    }
  } catch (error) {
    console.warn('Failed to store group ID');
  }
};

const initialState = {
  regularCartItems: [],
  groupCartItems: [],
  totalItems: 0,
  subtotal: 0,
  groupTotalItems: 0,
  groupSubtotal: 0,
  loading: false,
  error: null,
  syncStatus: 'idle',
  lastSyncTime: null,
  currentGroupId: getStoredGroupId(),
  isInitialized: false // Track if cart has been initialized
};

const normalizeCartItem = (item) => {
  const groupPrice = parseFloat(item.gprice || item.GroupPrice || 0);
  const hasGroupPrice = groupPrice > 0;
  return {
    id: item.Id || item.id,
    name: item.ProductName || item.productName || item.name,
    price: hasGroupPrice ? groupPrice : item.Price || item.netprice || item.price,
    image: item.Image || item.image,
    categoryName: item.CategoryName || item.categoryName,
    subcategoryName: item.SubcategoryName || item.subcategoryName,
    quantity: item.Qty || item.quantity || 1,
    groupId: item.groupid || item.groupId || null,
    gprice: item.gprice || item.GroupPrice || null,
    originalItem: item
  }
}

// Separate calculation functions for regular and group carts
const calculateRegularCartTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const priceToUse = parseFloat(item.price) || 0;
    return sum + (priceToUse * item.quantity);
  }, 0);
  return { totalItems, subtotal };
};

const calculateGroupCartTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    // For group cart, use gprice if available, otherwise fallback to regular price
    const priceToUse = parseFloat(item.gprice) || parseFloat(item.price) || 0;
    return sum + (priceToUse * item.quantity);
  }, 0);
  return { totalItems, subtotal };
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.LOAD_REGULAR_CART: {
      const normalizedItems = action.payload.items.map(normalizeCartItem);
      const { totalItems, subtotal } = calculateRegularCartTotals(normalizedItems);
      return {
        ...state,
        regularCartItems: normalizedItems,
        totalItems,
        subtotal,
        isInitialized: true
      };
    }
    case CART_ACTIONS.LOAD_GROUP_CART: {
      const normalizedItems = action.payload.items.map(normalizeCartItem);
      const { totalItems, subtotal } = calculateGroupCartTotals(normalizedItems);
      return {
        ...state,
        groupCartItems: normalizedItems,
        groupTotalItems: totalItems,
        groupSubtotal: subtotal
      };
    }
    case CART_ACTIONS.ADD_ITEM_REGULAR: {
      const newItem = normalizeCartItem(action.payload);
      const existingItemIndex = state.regularCartItems.findIndex(item => item.id === newItem.id);
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.regularCartItems.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        newItems = [...state.regularCartItems, newItem];
      }
      const { totalItems, subtotal } = calculateRegularCartTotals(newItems);
      return { ...state, regularCartItems: newItems, totalItems, subtotal };
    }
    case CART_ACTIONS.ADD_ITEM_GROUP: {
      const newItem = normalizeCartItem(action.payload);
      const existingItemIndex = state.groupCartItems.findIndex(item =>
        item.id === newItem.id && item.groupId === newItem.groupId
      );
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.groupCartItems.map((item, idx) =>
          idx === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        newItems = [...state.groupCartItems, newItem];
      }
      const { totalItems, subtotal } = calculateGroupCartTotals(newItems);
      return { ...state, groupCartItems: newItems, groupTotalItems: totalItems, groupSubtotal: subtotal };
    }
    case CART_ACTIONS.UPDATE_QUANTITY_REGULAR: {
      const { id, quantity } = action.payload;
      console.log("update data : ", id, quantity)
      const newItems = state.regularCartItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      console.log("new regular items : ", newItems)
      const { totalItems, subtotal } = calculateRegularCartTotals(newItems);
      return { ...state, regularCartItems: newItems, totalItems, subtotal };
    }
    case CART_ACTIONS.UPDATE_QUANTITY_GROUP: {
      const { id, quantity, groupId } = action.payload;
      console.log("Group update data : ", id, quantity, groupId)
      const newItems = state.groupCartItems.map(item =>
        item.id === id && item.groupId === groupId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
      console.log("new group items : ", newItems)
      const { totalItems, subtotal } = calculateGroupCartTotals(newItems);
      return { ...state, groupCartItems: newItems, groupTotalItems: totalItems, groupSubtotal: subtotal };
    }
    case CART_ACTIONS.REMOVE_ITEM_REGULAR: {
      const id = action.payload;
      const newItems = state.regularCartItems.filter(item => item.id !== id);
      const { totalItems, subtotal } = calculateRegularCartTotals(newItems);
      return { ...state, regularCartItems: newItems, totalItems, subtotal };
    }
    case CART_ACTIONS.REMOVE_ITEM_GROUP: {
      const { id, groupId } = action.payload;
      const newItems = state.groupCartItems.filter(item => !(item.id === id && item.groupId === groupId));
      const { totalItems, subtotal } = calculateGroupCartTotals(newItems);
      return { ...state, groupCartItems: newItems, groupTotalItems: totalItems, groupSubtotal: subtotal };
    }
    case CART_ACTIONS.CLEAR_REGULAR_CART:
      return { ...state, regularCartItems: [], totalItems: 0, subtotal: 0 };
    case CART_ACTIONS.CLEAR_GROUP_CART:
      return { ...state, groupCartItems: [], groupTotalItems: 0, groupSubtotal: 0 };
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case CART_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case CART_ACTIONS.SYNC_SUCCESS:
      return { ...state, syncStatus: 'success', lastSyncTime: new Date().toISOString(), error: null };
    case CART_ACTIONS.SYNC_FAILURE:
      return { ...state, syncStatus: 'error', error: action.payload };
    case CART_ACTIONS.SET_CURRENT_GROUP:
      // Store the group ID for persistence
      setStoredGroupId(action.payload);
      return { ...state, currentGroupId: action.payload };
    case CART_ACTIONS.CLEAR_CURRENT_GROUP:
      setStoredGroupId(null);
      return { ...state, currentGroupId: null };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const reduxDispatch = useDispatch();

  const reduxCartState = useSelector((state) => state.cart);
  const userData = useSelector((state) => state.auth.userData);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = isAuthenticated ? userData?.id : null;

  // Load regular cart from server
  const loadCartFromServer = async () => {
    if (!userId) {
      // If no user, mark as initialized with empty cart
      dispatch({ type: CART_ACTIONS.LOAD_REGULAR_CART, payload: { items: [] } });
      return;
    }

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    try {
      const cartItems = await reduxDispatch(fetchCartByUserId(userId)).unwrap();
      dispatch({ type: CART_ACTIONS.LOAD_REGULAR_CART, payload: { items: cartItems || [] } });
      dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message || 'Unknown error' });
      dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message || 'Unknown error' });
      // Still mark as initialized even on error
      dispatch({ type: CART_ACTIONS.LOAD_REGULAR_CART, payload: { items: [] } });
      toast.error('Failed to load cart from server');
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Load group cart from server for a specific groupId
  const loadGroupCart = async () => {
    if (!userId) return;

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const result = await reduxDispatch(
        fetchCartByUserAndGroup({ userId })
      ).unwrap();

      dispatch({
        type: CART_ACTIONS.LOAD_GROUP_CART,
        payload: { items: result || [] }
      });
      dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
    } catch (error) {
      console.error('Error loading group cart:', error);
      dispatch({
        type: CART_ACTIONS.SYNC_FAILURE,
        payload: error.message
      });
      // Load empty group cart on error
      dispatch({
        type: CART_ACTIONS.LOAD_GROUP_CART,
        payload: { items: [] }
      });
      toast.error('Failed to load group cart');
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Add item to regular or group cart
  const addToCart = async (product, quantity = 1, groupId = null) => {
    if (groupId) {
      // Group cart
      const cartItem = {
        ...product,
        quantity,
        groupId
      };
      dispatch({ type: CART_ACTIONS.ADD_ITEM_GROUP, payload: cartItem });
      toast.success(`${cartItem.name} added to group cart`);
      if (userId) {
        try {
          const requestData = {
            userId,
            productId: product.pdid || product.id,
            quantity,
            name: product.productName,
            price: product.netprice || product.price,
            groupId
          };
          await reduxDispatch(addToCartByUser(requestData)).unwrap();
          dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
        } catch (error) {
          dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        }
      }
    } else {
      // Regular cart
      const cartItem = {
        ...product,
        quantity
      };
      console.log("added to cart : ", cartItem)
      dispatch({ type: CART_ACTIONS.ADD_ITEM_REGULAR, payload: cartItem });
      toast.success(`${cartItem.productName} added to cart`);
      if (userId) {
        try {
          const requestData = {
            userId,
            productId: product.pdid || product.id,
            name: product.productName,
            quantity,
            price: product.netprice || product.price
          };
          await reduxDispatch(addToCartByUser(requestData)).unwrap();
          dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
        } catch (error) {
          dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        }
      }
    }
  };

  // Update quantity
  const updateQuantity = async (id, quantity, groupId = null) => {
    // If no groupId is passed, check if the item exists in group cart
    if (!groupId) {
      const groupItem = state.groupCartItems.find(item => item.id === id);
      if (groupItem) {
        groupId = groupItem.groupId;
      }
    }

    if (groupId) {
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY_GROUP, payload: { id, quantity, groupId } });
    } else {
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY_REGULAR, payload: { id, quantity } });
    }

    if (userId) {
      try {
        const requestData = {
          userId,
          cartItemId: id,
          quantity
        };
        await reduxDispatch(updateCartItemQuantity(requestData)).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
      }
    }
  };

  // Remove item
  const removeFromCart = async (id, groupId = null) => {
    // If no groupId is passed, check if the item exists in group cart
    if (!groupId) {
      const groupItem = state.groupCartItems.find(item => item.id === id);
      if (groupItem) {
        groupId = groupItem.groupId;
      }
    }

    if (groupId) {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM_GROUP, payload: { id, groupId } });
    } else {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM_REGULAR, payload: id });
    }

    toast.success('Item removed from cart');

    if (userId) {
      try {
        const requestData = {
          userId,
          cartItemId: id
        };
        await reduxDispatch(removeFromCartRedux(requestData)).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
      }
    }
  };

  // Clear carts
// Replace the clearCart function in your CartContext with this:

const clearCart = async (options = {}) => {
  const { groupId, clearBoth = false, clearAllGroups = false } = options;
  
  if (clearBoth) {
    // Clear both regular and group carts
    dispatch({ type: CART_ACTIONS.CLEAR_REGULAR_CART });
    dispatch({ type: CART_ACTIONS.CLEAR_GROUP_CART });
    
    if (userId) {
      try {
        // Clear regular cart
        await reduxDispatch(clearCartRedux({ userId })).unwrap();
        
        // Clear all group carts
        await reduxDispatch(clearAllGroupCarts({ userId })).unwrap();
        
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
        toast.success('Both carts cleared successfully');
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to clear carts on server');
      }
    }
  } else if (clearAllGroups) {
    // Clear all group carts (all groupIds)
    dispatch({ type: CART_ACTIONS.CLEAR_GROUP_CART });
    
    if (userId) {
      try {
        await reduxDispatch(clearAllGroupCarts({ userId })).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
        toast.success('All group carts cleared successfully');
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to clear group carts on server');
      }
    }
  } else if (groupId) {
    // Clear specific group cart
    dispatch({ type: CART_ACTIONS.CLEAR_GROUP_CART });
    
    if (userId) {
      try {
        await reduxDispatch(clearGroupCart({ userId, groupId })).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
        toast.success('Group cart cleared successfully');
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to clear group cart on server');
      }
    }
  } else {
    // Clear regular cart only
    dispatch({ type: CART_ACTIONS.CLEAR_REGULAR_CART });
    
    if (userId) {
      try {
        await reduxDispatch(clearCartRedux({ userId })).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
        toast.success('Cart cleared successfully');
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to clear cart on server');
      }
    }
  }
};

  const setCurrentGroup = (groupId) => {
    dispatch({ type: CART_ACTIONS.SET_CURRENT_GROUP, payload: groupId });
  };

  const clearCurrentGroup = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CURRENT_GROUP });
  };

  // Initialize cart when user authentication changes
  useEffect(() => {
    if (isAuthenticated && userId && !state.isInitialized) {
      console.log('Loading cart from server...');
      loadCartFromServer();
    } else if (!isAuthenticated && !state.isInitialized) {
      console.log('No user, initializing empty cart...');
      // Initialize empty cart for non-authenticated users
      dispatch({ type: CART_ACTIONS.LOAD_REGULAR_CART, payload: { items: [] } });
    }
  }, [isAuthenticated, userId, state.isInitialized]);

  // Load group cart when currentGroupId changes
  useEffect(() => {
    if (userId && state.currentGroupId) {
      console.log('Loading group cart for group:', state.currentGroupId);
      loadGroupCart();
    }
  }, [state.currentGroupId, userId]);

  // On logout, clear all
  useEffect(() => {
    if (!userId && isAuthenticated === false) {
      console.log('User logged out, clearing cart...');
      dispatch({ type: CART_ACTIONS.CLEAR_REGULAR_CART });
      dispatch({ type: CART_ACTIONS.CLEAR_GROUP_CART });
      dispatch({ type: CART_ACTIONS.CLEAR_CURRENT_GROUP });
    }
  }, [userId, isAuthenticated]);

  const isItemInCart = (id, groupId = null) => {
    if (!groupId) {
      return !!state.regularCartItems.find(item => item.id === id);
    } else {
      console.log("check cart items : ",groupId,id, state.groupCartItems) 
      return !!state.groupCartItems.find(item => item.originalItem.pdid === id && item.groupId == groupId);
    }
  };

  const getItemQuantity = (id, groupId = null) => {
    if (!groupId) {
      const item = state.regularCartItems.find(item => item.id === id);
      return item ? item.quantity : 0;
    } else {
      const item = state.groupCartItems.find(item => item.id === id && item.groupId === groupId);
      return item ? item.quantity : 0;
    }
  };

  const getCartItemInfo = (productId, groupId = null) => {
    let item;
    if (!groupId) {
      // Regular cart
      item = state.regularCartItems.find(
        item =>
          item.originalItem.pid === productId ||
          item.originalItem.pdid === productId
      );
    } else {
      // Group cart
      item = state.groupCartItems.find(
        item =>
          (item.originalItem.pid === productId ||
            item.originalItem.pdid === productId) &&
          item.groupId === groupId
      );
      console.log("Group cart info", item)
    }
    return item
      ? { cartItemId: item.id, quantity: item.quantity, item }
      : null;
  };

  // Context value
  const value = {
    // Regular cart
    regularCartItems: state.regularCartItems,
    totalItems: state.totalItems,
    subtotal: state.subtotal,
    // Group cart
    groupCartItems: state.groupCartItems,
    groupTotalItems: state.groupTotalItems,
    groupSubtotal: state.groupSubtotal,
    // Status
    loading: state.loading,
    error: state.error,
    syncStatus: state.syncStatus,
    lastSyncTime: state.lastSyncTime,
    currentGroupId: state.currentGroupId,
    isInitialized: state.isInitialized,
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isItemInCart,
    getCartItemInfo,
    getItemQuantity,
    loadCartFromServer,
    loadGroupCart,
    setCurrentGroup,
    clearCurrentGroup
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}