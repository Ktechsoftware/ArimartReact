// cartSlice.js - Updated to remove CartStorage dependency
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Helper: calculate totals
const calculateTotalsFromItems = (items) => {
  const totalItems = items.reduce((total, item) => total + (item.Qty || item.quantity || 1), 0);
  const subtotal = items.reduce((total, item) => {
    const price = item.Price || item.price || 0;
    const quantity = item.Qty || item.quantity || 1;
    return total + price * quantity;
  }, 0);
  return { totalItems, subtotal };
};

export const addToCartByUser = createAsyncThunk(
  'cart/addToCartByUser',
  async (cartData, { rejectWithValue, getState }) => {
    try {
      console.log('Adding to cart for user:', cartData);
      await API.post('/cart/add/user', cartData);
      const userId = getState().auth.userData?.id;
      if (!userId) throw new Error('User ID not found');
      const updatedCart = await API.get(`/cart/${userId}`);
      console.log('Updated stored cart:', updatedCart.data);
      return updatedCart.data.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

export const fetchCartByUserId = createAsyncThunk(
  'cart/fetchCartByUserId',
  async (userId, { rejectWithValue }) => {
    try {
      const updatedCart = await API.get(`/cart/${userId}`);
      console.log('Updated cart:', updatedCart.data);
      return updatedCart.data.items || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCartByUserAndGroup = createAsyncThunk(
  'cart/fetchCartByUserAndGroup',
  async ({ userId, groupId }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/cart/usergroup?userid=${userId}&groupid=${groupId}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ userId, cartItemId }, { rejectWithValue }) => {
    try {
      await API.delete('/cart/remove', { data: { userId, itemId: cartItemId } });
      return cartItemId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ userId, cartItemId, quantity }, { rejectWithValue }) => {
    try {
      await API.put('/cart/update', {
        userId,
        itemId: cartItemId,
        quantity,
      });
      return { cartItemId, quantity };
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
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.error = null;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setGroupId: (state, action) => {
      state.groupId = action.payload;
    },
    calculateTotals: (state) => {
      const { totalItems, subtotal } = calculateTotalsFromItems(state.items);
      state.totalItems = totalItems;
      state.subtotal = subtotal;
    },
    updateItemQuantityLocal: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.Id === itemId || item.id === itemId);
      if (item) {
        item.Qty = quantity;
        item.quantity = quantity;
      }
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeItemLocal: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.Id !== itemId && item.id !== itemId);
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearErrors: (state) => {
      state.error = null;
      state.addToCartError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartByUser.pending, (state) => {
        state.addToCartLoading = true;
        state.addToCartError = null;
      })
      .addCase(addToCartByUser.fulfilled, (state, action) => {
        state.addToCartLoading = false;
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(addToCartByUser.rejected, (state, action) => {
        state.addToCartLoading = false;
        state.addToCartError = action.payload;
      })
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
      })
      .addCase(fetchCartByUserAndGroup.fulfilled, (state, action) => {
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.Id !== action.payload && item.id !== action.payload);
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { cartItemId, quantity } = action.payload;
        const item = state.items.find(item => item.Id === cartItemId || item.id === cartItemId);
        if (item) {
          item.Qty = quantity;
          item.quantity = quantity;
        }
        cartSlice.caseReducers.calculateTotals(state);
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
  clearErrors,
} = cartSlice.actions;

export default cartSlice.reducer;