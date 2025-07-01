// src/Store/wishlistSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// 🚀 Add to Wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ userid, pdid }, thunkAPI) => {
    try {
      const response = await API.post('/wishlist', { userid, pdid });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// 🚀 Get Wishlist
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userid, thunkAPI) => {
    try {
      const response = await API.get(`/wishlist/${userid}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearWishlistMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ➕ Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📦 Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistMessage } = wishlistSlice.actions;
export default wishlistSlice.reducer;
