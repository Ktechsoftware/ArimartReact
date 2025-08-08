import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

// ==========================
// 📦 Async Thunk to fetch top orders
// ==========================

export const fetchTopOrdersByUser = createAsyncThunk(
  'topOrders/fetchTopOrdersByUser',
  async (userId, thunkAPI) => {
    try {
      const res = await API.get(`/Top/orders/combined/${userId}`);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch top orders:', err);
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch orders' });
    }
  }
);

// ==========================
// 🧩 Slice
// ==========================

const topOrdersSlice = createSlice({
  name: 'topOrders',
  initialState: {
    orders: [],
    message: '',
    userId: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTopOrders: (state) => {
      state.orders = [];
      state.message = '';
      state.userId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
        state.message = action.payload.message || '';
        state.userId = action.payload.userid || null;
      })
      .addCase(fetchTopOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

// ==========================
// 🔄 Export actions and reducer
// ==========================

export const { clearTopOrders } = topOrdersSlice.actions;
export default topOrdersSlice.reducer;
