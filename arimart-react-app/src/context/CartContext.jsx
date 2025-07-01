// contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

// Cart Context
const CartContext = createContext();

// Action types
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
  syncStatus: 'idle', // 'idle', 'syncing', 'success', 'error'
  lastSyncTime: null
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload.items || [],
        totalItems: action.payload.totalItems || 0,
        subtotal: action.payload.subtotal || 0
      };

    case CART_ACTIONS.ADD_ITEM: {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newSubtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        subtotal: newSubtotal
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );

      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newSubtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        subtotal: newSubtotal
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newSubtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems: newTotalItems,
        subtotal: newSubtotal
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

// Cart API functions
const cartAPI = {
  // Fetch cart from server
  async fetchCart(userId) {
    try {
      const response = await fetch(`/api/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart on server
  async addToCart(userId, item) {
    console.log('Adding item to cart on server:', { userId, item });
    try {
     const response = await fetch('/api/cart/add/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update item quantity on server
  async updateQuantity(userId, itemId, quantity) {
    console.log('Updating quantity on server:', { userId, itemId, quantity });
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          itemId,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  // Remove item from cart on server
  async removeFromCart(userId, itemId) {
    try {
      const response = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          itemId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Sync entire cart to server
  async syncCart(userId, cartItems) {
    try {
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          items: cartItems
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
};

// LocalStorage utilities
const LOCAL_STORAGE_KEY = 'shopping_cart';

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
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.userId;

  // ✅ Reset Cart State on Logout
useEffect(() => {
  if (!userId) {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    localStorageUtils.clearCart(); // also remove from storage
  }
}, [userId]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorageUtils.getCart();
    if (storedCart.items && storedCart.items.length > 0) {
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: storedCart
      });
    }
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (state.items.length > 0 || state.totalItems > 0) {
      localStorageUtils.setCart(state);
    }
  }, [state.items, state.totalItems, state.subtotal]);

  // Sync with server when user logs in
  useEffect(() => {
    if (userId && state.items.length > 0) {
      syncCartWithServer();
    } else if (userId) {
      loadCartFromServer();
    }
  }, [userId]);

  // Load cart from server
  const loadCartFromServer = async () => {
    if (!userId) return;

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const serverCart = await cartAPI.fetchCart(userId);
      
      dispatch({
        type: CART_ACTIONS.LOAD_CART,
        payload: {
          items: serverCart.items || [],
          totalItems: serverCart.totalItems || 0,
          subtotal: serverCart.subtotal || 0
        }
      });
      
      dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      toast.error('Failed to load cart from server');
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Sync local cart with server
  const syncCartWithServer = async () => {
    if (!userId || state.items.length === 0) return;

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      await cartAPI.syncCart(userId, state.items);
      dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      toast.success('Cart synced successfully');
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
      toast.error('Failed to sync cart');
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

    // Add to local state immediately
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: cartItem
    });

    toast.success(`${cartItem.name} added to cart`);

    // Sync with server if user is logged in
    if (userId) {
      try {
        await cartAPI.addToCart(userId, cartItem);
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SYNC_FAILURE, payload: error.message });
        // Don't remove from local cart on API failure
        console.error('Failed to sync with server:', error);
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    const oldQuantity = state.items.find(item => item.id === itemId)?.quantity;
    
    // Update local state immediately
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: itemId, quantity: newQuantity }
    });

    // Sync with server if user is logged in
    if (userId) {
      try {
        await cartAPI.updateQuantity(userId, itemId, newQuantity);
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
    const itemToRemove = state.items.find(item => item.id === itemId);
    
    // Remove from local state immediately
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id: itemId }
    });

    toast.success(`${itemToRemove?.name || 'Item'} removed from cart`);

    // Sync with server if user is logged in
    if (userId) {
      try {
        await cartAPI.removeFromCart(userId, itemId);
        dispatch({ type: CART_ACTIONS.SYNC_SUCCESS });
      } catch (error) {
        // Re-add on failure
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
        await cartAPI.syncCart(userId, []);
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

  const contextValue = {
    // State
    ...state,
    
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