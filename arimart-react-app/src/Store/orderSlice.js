import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// ==========================
// 📦 Async Thunks
// ==========================

export const checkoutCart = createAsyncThunk('order/checkoutCart', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/order/checkout', payload);
    return res.data;
  } catch (err) {
    console.error('Checkout error:', err);
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Checkout failed' });
  }
});

export const placeNormalOrder = createAsyncThunk('order/placeNormalOrder', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/order/place', payload);
    return res.data;
  } catch (err) {
    console.error('Place order error:', err);
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Order placement failed' });
  }
});

export const placeGroupOrder = createAsyncThunk('order/placeGroupOrder', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/order/place/group', payload);
    return res.data;
  } catch (err) {
    console.error('Group order error:', err);
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Group order failed' });
  }
});

export const trackOrder = createAsyncThunk('order/trackOrder', async (trackId, thunkAPI) => {
  try {
    const res = await API.get(`/order/track/${trackId}`);
    return res.data;
  } catch (err) {
    console.error('Track order error:', err);
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Track failed' });
  }
});

export const getOrderHistory = createAsyncThunk('order/history', async (userId, thunkAPI) => {
  try {
    console.log("Fetching order history for userId:", userId);
    const res = await API.get(`/order/history/${userId}`);
    console.log("Order history response:", res.data);
    
    // Handle different response structures
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && res.data.orders && Array.isArray(res.data.orders)) {
      return res.data.orders;
    } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else {
      console.warn("Unexpected response structure:", res.data);
      return [];
    }
  } catch (err) {
    console.error('Order history error:', err);
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'History fetch failed' });
  }
});

export const getGroupOrderHistory = createAsyncThunk('order/history/group', async ({ userId, groupId }, thunkAPI) => {
  try {
    const res = await API.get(`/order/history/${userId}/${groupId}`);
    console.log("Group order history response:", res.data);
    
    // Handle different response structures
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    } else if (res.data && res.data.orders && Array.isArray(res.data.orders)) {
      return res.data.orders;
    } else {
      return [];
    }
  } catch (err) {
    console.error('Group history error:', err);
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Group history fetch failed' });
  }
});

export const cancelOrder = createAsyncThunk('order/cancelOrder', async (orderId, thunkAPI) => {
  try {
    const res = await API.delete(`/order/${orderId}`);
    return res.data;
  } catch (err) {
    console.error('Cancel order error:', err);
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Cancel failed' });
  }
});

// ==========================
// 🧾 Slice
// ==========================

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    error: null,
    orders: [],
    track: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ Checkout
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Checkout failed';
      })

      // ✅ Place Normal Order
      .addCase(placeNormalOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeNormalOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(placeNormalOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Order placement failed';
      })

      // ✅ Place Group Order
      .addCase(placeGroupOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeGroupOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(placeGroupOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Group order failed';
      })

      // ✅ Track Order
      .addCase(trackOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.track = action.payload;
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Track failed';
      })

      // ✅ Order History
      .addCase(getOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
        console.log("Orders updated in state:", state.orders);
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'History fetch failed';
        state.orders = [];
      })

      // ✅ Group Order History
      .addCase(getGroupOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroupOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })
      .addCase(getGroupOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Group history fetch failed';
        state.orders = [];
      })

      // ✅ Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Remove cancelled order from orders array
        state.orders = state.orders.filter(order => order.id !== action.meta.arg);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Cancel failed';
      });
  }
});

export const { clearOrderError, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;