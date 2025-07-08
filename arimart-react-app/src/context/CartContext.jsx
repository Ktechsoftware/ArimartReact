// contexts/CartContext.jsx - Fixed update and remove functions
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCartByUserId,
  addToCartByUser,
  removeFromCart as removeFromCartRedux,
  updateCartItemQuantity,
  clearCart as clearCartRedux,
  // Add these group cart actions - you'll need to implement them in your Redux slice
  addToCartByGroup,
  fetchCartByUserAndGroup
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
  SYNC_FAILURE: 'SYNC_FAILURE',
  SET_GROUP_CART: 'SET_GROUP_CART',
  CLEAR_GROUP_CART: 'CLEAR_GROUP_CART',
  LOAD_GROUP_CART: 'LOAD_GROUP_CART'
};

// Initial state
const initialState = {
  items: [],
  groupItems: [], // Separate array for group cart items
  totalItems: 0,
  subtotal: 0,
  groupTotalItems: 0,
  groupSubtotal: 0,
  loading: false,
  error: null,
  syncStatus: 'idle',
  lastSyncTime: null,
  isGroupCart: false,
  currentGroupId: null
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

    case CART_ACTIONS.LOAD_GROUP_CART: {
      const normalizedItems = action.payload.items.map(normalizeCartItem);
      const { totalItems, subtotal } = calculateTotals(normalizedItems);

      return {
        ...state,
        groupItems: normalizedItems,
        groupTotalItems: totalItems,
        groupSubtotal: subtotal
      };
    }

    case CART_ACTIONS.ADD_ITEM: {
      const newItem = normalizeCartItem(action.payload);
      const isGroupCart = action.payload.isGroupCart;
      
      if (isGroupCart) {
        const existingItemIndex = state.groupItems.findIndex(item => item.id === newItem.id);
        let newItems;
        
        if (existingItemIndex >= 0) {
          newItems = state.groupItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
        } else {
          newItems = [...state.groupItems, newItem];
        }

        const { totalItems, subtotal } = calculateTotals(newItems);
        return {
          ...state,
          groupItems: newItems,
          groupTotalItems: totalItems,
          groupSubtotal: subtotal
        };
      } else {
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
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity, isGroupCart } = action.payload;
      
      if (isGroupCart) {
        const newItems = state.groupItems.map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        );
        const { totalItems, subtotal } = calculateTotals(newItems);
        return {
          ...state,
          groupItems: newItems,
          groupTotalItems: totalItems,
          groupSubtotal: subtotal
        };
      } else {
        const newItems = state.items.map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(1, quantity) }
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
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { id, isGroupCart } = action.payload;
      
      if (isGroupCart) {
        const newItems = state.groupItems.filter(item => item.id !== id);
        const { totalItems, subtotal } = calculateTotals(newItems);
        return {
          ...state,
          groupItems: newItems,
          groupTotalItems: totalItems,
          groupSubtotal: subtotal
        };
      } else {
        const newItems = state.items.filter(item => item.id !== id);
        const { totalItems, subtotal } = calculateTotals(newItems);
        return {
          ...state,
          items: newItems,
          totalItems,
          subtotal
        };
      }
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

    case CART_ACTIONS.SET_GROUP_CART:
      return {
        ...state,
        isGroupCart: true,
        currentGroupId: action.payload.groupId
      };

    case CART_ACTIONS.CLEAR_GROUP_CART:
      return {
        ...state,
        isGroupCart: false,
        currentGroupId: null,
        groupItems: [],
        groupTotalItems: 0,
        groupSubtotal: 0
      };

    default:
      return state;
  }
}

// LocalStorage utilities
const LOCAL_STORAGE_KEY = 'user_cart';
const GROUP_STORAGE_KEY = 'group_cart';

const localStorageUtils = {
  getCart: () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { items: [], totalItems: 0, subtotal: 0 };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return { items: [], totalItems: 0, subtotal: 0 };
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

  getGroupCart: (groupId) => {
    try {
      const stored = localStorage.getItem(`${GROUP_STORAGE_KEY}_${groupId}`);
      return stored ? JSON.parse(stored) : { items: [], totalItems: 0, subtotal: 0 };
    } catch (error) {
      console.error('Error reading group cart from localStorage:', error);
      return { items: [], totalItems: 0, subtotal: 0 };
    }
  },

  setGroupCart: (groupId, cartState) => {
    try {
      localStorage.setItem(`${GROUP_STORAGE_KEY}_${groupId}`, JSON.stringify({
        items: cartState.groupItems,
        totalItems: cartState.groupTotalItems,
        subtotal: cartState.groupSubtotal,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error writing group cart to localStorage:', error);
    }
  },

  clearCart: () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  clearGroupCart: (groupId) => {
    try {
      localStorage.removeItem(`${GROUP_STORAGE_KEY}_${groupId}`);
    } catch (error) {
      console.error('Error clearing group cart from localStorage:', error);
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

  // Save group cart to localStorage whenever it changes
  useEffect(() => {
    if (state.currentGroupId) {
      localStorageUtils.setGroupCart(state.currentGroupId, state);
    }
  }, [state.groupItems, state.groupTotalItems, state.groupSubtotal, state.currentGroupId]);

  // Clear cart on logout
  useEffect(() => {
    if (!userId && isAuthenticated === false) {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      dispatch({ type: CART_ACTIONS.CLEAR_GROUP_CART });
      localStorageUtils.clearCart();
    }
  }, [userId, isAuthenticated]);

  // Fetch cart from server when user logs in
  useEffect(() => {
    if (userId) {
      loadCartFromServer();
    }
  }, [userId]);

  // Load cart from DB via Redux and sync to local state + localStorage
  const loadCartFromServer = async () => {
    if (!userId) return;

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      const cartItems = await reduxDispatch(fetchCartByUserId(userId)).unwrap();
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

  // Add item to regular cart
  const addToCart = async (product, quantity = 1) => {
    const cartItem = {
      id: product.pdid,
      name: product.productName || product.name,
      price: product.netprice || product.price,
      image: product.image,
      categoryName: product.categoryName,
      subcategoryName: product.subcategoryName,
      quantity: quantity,
      isGroupCart: false
    };

    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: cartItem
    });

    toast.success(`${cartItem.name} added to cart`);

    if (userId) {
      try {
        await reduxDispatch(addToCartByUser({
          userId,
          productId: product.pdid,
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

  // Add item to group cart
  const addToGroupCart = async (product, groupId, quantity = 1) => {
    const cartItem = {
      id: product.pdid,
      name: product.productName || product.name,
      price: product.netprice || product.price,
      image: product.image,
      categoryName: product.categoryName,
      subcategoryName: product.subcategoryName,
      quantity,
      isGroupCart: true
    };

    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
    dispatch({ type: CART_ACTIONS.SET_GROUP_CART, payload: { groupId } });

    toast.success(`${cartItem.name} added to group cart`);

    if (userId) {
      try {
        await reduxDispatch(addToCartByGroup({
          groupId,
          userId,
          productId: product.pdid,
          quantity,
          price: product.netprice || product.price
        })).unwrap();
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to sync group cart');
      }
    }
  };

  // Fetch group cart from server
  const fetchGroupCart = async (groupId) => {
    if (!userId || !groupId) return;

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      const cartItems = await reduxDispatch(
        fetchCartByUserAndGroup({ userId, groupId })
      ).unwrap();

      dispatch({
        type: CART_ACTIONS.LOAD_GROUP_CART,
        payload: { items: cartItems }
      });

      dispatch({ type: CART_ACTIONS.SET_GROUP_CART, payload: { groupId } });
      dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
      toast.error('Failed to load group cart');
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity, isGroupCart = false) => {
    const items = isGroupCart ? state.groupItems : state.items;
    const item = items.find(item => item.id === itemId);
    
    if (!item) {
      console.error('Item not found:', itemId);
      toast.error('Item not found');
      return;
    }

    const oldQuantity = item.quantity;

    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: itemId, quantity: newQuantity, isGroupCart }
    });

    if (userId && item.originalItem) {
      try {
        const cartItemId = item.originalItem.Id || item.originalItem.id;
        
        if (isGroupCart) {
          // Add group-specific update logic here
          // await reduxDispatch(updateGroupCartItemQuantity({
          //   userId,
          //   groupId: state.currentGroupId,
          //   cartItemId,
          //   quantity: newQuantity
          // })).unwrap();
        } else {
          await reduxDispatch(updateCartItemQuantity({
            userId,
            cartItemId,
            quantity: newQuantity
          })).unwrap();
        }

        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
        toast.success('Quantity updated');
      } catch (error) {
        dispatch({
          type: CART_ACTIONS.UPDATE_QUANTITY,
          payload: { id: itemId, quantity: oldQuantity, isGroupCart }
        });
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error(`Failed to update quantity: ${error.message}`);
        console.error('Update quantity failed:', error);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId, isGroupCart = false) => {
    const items = isGroupCart ? state.groupItems : state.items;
    const item = items.find(item => item.id === itemId);
    
    if (!item) {
      console.error('Item not found:', itemId);
      toast.error('Item not found');
      return;
    }

    const itemToRemove = { ...item };

    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id: itemId, isGroupCart }
    });

    toast.success(`${itemToRemove.name || 'Item'} removed from cart`);

    if (userId && item.originalItem) {
      try {
        const cartItemId = item.originalItem.Id || item.originalItem.id;
        
        if (isGroupCart) {
          // Add group-specific remove logic here
          // await reduxDispatch(removeFromGroupCart({
          //   userId,
          //   groupId: state.currentGroupId,
          //   cartItemId
          // })).unwrap();
        } else {
          await reduxDispatch(removeFromCartRedux({
            userId,
            cartItemId
          })).unwrap();
        }

        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        dispatch({ 
          type: CART_ACTIONS.ADD_ITEM, 
          payload: { ...itemToRemove, isGroupCart } 
        });
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error(`Failed to remove item: ${error.message}`);
        console.error('Remove item failed:', error);
      }
    }
  };

  // Clear entire cart
  const clearCart = async (isGroupCart = false) => {
    const oldItems = isGroupCart ? [...state.groupItems] : [...state.items];

    if (isGroupCart) {
      dispatch({ type: CART_ACTIONS.CLEAR_GROUP_CART });
      if (state.currentGroupId) {
        localStorageUtils.clearGroupCart(state.currentGroupId);
      }
    } else {
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      localStorageUtils.clearCart();
    }

    toast.success('Cart cleared');

    if (userId) {
      try {
        if (isGroupCart) {
          // Add group-specific clear logic here
          // await reduxDispatch(clearGroupCart({
          //   userId,
          //   groupId: state.currentGroupId
          // })).unwrap();
        } else {
          await reduxDispatch(clearCartRedux()).unwrap();
        }
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        // Restore on failure
        oldItems.forEach(item => {
          dispatch({ 
            type: CART_ACTIONS.ADD_ITEM, 
            payload: { ...item, isGroupCart } 
          });
        });
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        toast.error('Failed to clear cart');
      }
    }
  };

  // Get item quantity
  const getItemQuantity = (itemId, isGroupCart = false) => {
    const items = isGroupCart ? state.groupItems : state.items;
    const item = items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (itemId, isGroupCart = false) => {
    const items = isGroupCart ? state.groupItems : state.items;
    return items.some(item => item.id === itemId);
  };

  // Sync cart with server manually
  const syncCartWithServer = async () => {
    if (userId) {
      await loadCartFromServer();
    }
  };

  const contextValue = {
    // Regular cart state
    items: state.items,
    totalItems: state.totalItems,
    subtotal: state.subtotal,
    
    // Group cart state
    groupItems: state.groupItems,
    groupTotalItems: state.groupTotalItems,
    groupSubtotal: state.groupSubtotal,
    
    // Common state
    loading: state.loading || reduxCartState.loading,
    error: state.error || reduxCartState.error,
    syncStatus: state.syncStatus,
    lastSyncTime: state.lastSyncTime,
    isGroupCart: state.isGroupCart,
    currentGroupId: state.currentGroupId,

    // Actions
    addToCart,
    addToGroupCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCartWithServer,
    loadCartFromServer,
    fetchGroupCart,
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