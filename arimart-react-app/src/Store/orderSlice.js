import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// 📌 Thunks for each action
export const checkoutCart = createAsyncThunk('order/checkoutCart', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/order/checkout', payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Checkout failed' });
  }
});

export const placeNormalOrder = createAsyncThunk('order/placeNormalOrder', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/order/place', payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Order placement failed' });
  }
});

export const placeGroupOrder = createAsyncThunk('order/placeGroupOrder', async (payload, thunkAPI) => {
  try {
    const res = await API.post('/order/place/group', payload);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Group order failed' });
  }
});

export const trackOrder = createAsyncThunk('order/trackOrder', async (orderId, thunkAPI) => {
  try {
    const res = await API.get(`/order/track/${orderId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Track failed' });
  }
});

export const getOrderHistory = createAsyncThunk('order/history', async (userId, thunkAPI) => {
  try {
    const res = await API.get(`/order/history/${userId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'History fetch failed' });
  }
});

export const getGroupOrderHistory = createAsyncThunk('order/history/group', async ({ userId, groupId }, thunkAPI) => {
  try {
    const res = await API.get(`/order/history/${userId}/${groupId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Group history fetch failed' });
  }
});

export const cancelOrder = createAsyncThunk('order/cancelOrder', async (orderId, thunkAPI) => {
  try {
    const res = await API.delete(`/order/${orderId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: 'Cancel failed' });
  }
});

// 🧾 Slice
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.track = action.payload;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
