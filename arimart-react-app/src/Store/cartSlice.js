import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Async thunk to add item to cart for user
export const addToCartByUser = createAsyncThunk(
  'cart/addToCartByUser',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await API.post('/cart/add/user', cartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to add item to cart for group (guest users)
export const addToCartByGroup = createAsyncThunk(
  'cart/addToCartByGroup',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await API.post('/cart/add/group', cartData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch cart by user ID
export const fetchCartByUserId = createAsyncThunk(
  'cart/fetchCartByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/cart/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch cart by user ID and group ID
export const fetchCartByUserAndGroup = createAsyncThunk(
  'cart/fetchCartByUserAndGroup',
  async ({ userId, groupId }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/cart/usergroup?userid=${userId}&groupid=${groupId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to remove item from cart (you'll need to add this endpoint to your backend)
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/cart/${cartItemId}`);
      return { cartItemId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update cart item quantity (you'll need to add this endpoint to your backend)
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/cart/${cartItemId}`, { quantity });
      return { cartItemId, quantity, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    addToCartLoading: false,
    addToCartError: null,
    totalItems: 0,
    subtotal: 0,
    userId: null,
    groupId: null,
  },
  reducers: {
    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.error = null;
    },
    
    // Set user ID
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    
    // Set group ID
    setGroupId: (state, action) => {
      state.groupId = action.payload;
    },
    
    // Calculate totals
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + (item.Qty || item.quantity || 1), 0);
      state.subtotal = state.items.reduce((total, item) => {
        const price = item.Price || item.price || 0;
        const quantity = item.Qty || item.quantity || 1;
        return total + (price * quantity);
      }, 0);
    },
    
    // Update item quantity locally (optimistic update)
    updateItemQuantityLocal: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.Id === itemId || item.id === itemId);
      if (item) {
        item.Qty = quantity;
        item.quantity = quantity;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    // Remove item locally (optimistic update)
    removeItemLocal: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => (item.Id !== itemId && item.id !== itemId));
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.addToCartError = null;
    }
  },
  extraReducers: (builder) => {
    // Add to cart by user
    builder
      .addCase(addToCartByUser.pending, (state) => {
        state.addToCartLoading = true;
        state.addToCartError = null;
      })
      .addCase(addToCartByUser.fulfilled, (state, action) => {
        state.addToCartLoading = false;
        // Optionally refresh cart after adding
      })
      .addCase(addToCartByUser.rejected, (state, action) => {
        state.addToCartLoading = false;
        state.addToCartError = action.payload;
      })
      
    // Add to cart by group
      .addCase(addToCartByGroup.pending, (state) => {
        state.addToCartLoading = true;
        state.addToCartError = null;
      })
      .addCase(addToCartByGroup.fulfilled, (state, action) => {
        state.addToCartLoading = false;
      })
      .addCase(addToCartByGroup.rejected, (state, action) => {
        state.addToCartLoading = false;
        state.addToCartError = action.payload;
      })
      
    // Fetch cart by user ID
      .addCase(fetchCartByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(fetchCartByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      
    // Fetch cart by user and group
      .addCase(fetchCartByUserAndGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartByUserAndGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(fetchCartByUserAndGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      
    // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const { cartItemId } = action.payload;
        state.items = state.items.filter(item => item.Id !== cartItemId && item.id !== cartItemId);
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const { cartItemId, quantity } = action.payload;
        const item = state.items.find(item => item.Id === cartItemId || item.id === cartItemId);
        if (item) {
          item.Qty = quantity;
          item.quantity = quantity;
        }
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCart,
  setUserId,
  setGroupId,
  calculateTotals,
  updateItemQuantityLocal,
  removeItemLocal,
  clearErrors
} = cartSlice.actions;

export default cartSlice.reducer;