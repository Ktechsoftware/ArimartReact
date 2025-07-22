// src/Store/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// ➕ Add to Wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ userid, pdid }, thunkAPI) => {
    try {
      const response = await API.post('/wishlist', { userid, pdid });
      return { userid, pdid, message: response.data.message }; // return needed info
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// ❌ Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ userid, pdid }, thunkAPI) => {
    try {
      const response = await API.delete('/wishlist', {
        data: { userid, pdid }
      });
      return { userid, pdid, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

// 📦 Get Wishlist
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
      // ➕ Add
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        const alreadyExists = state.items.find(item => item.pdid === action.payload.pdid);
        if (!alreadyExists) {
          state.items.push({ pdid: action.payload.pdid }); // only pdid is added, can refetch if full product info needed
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📦 Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // assume server filters out IsDeleted items
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ Remove
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.items = state.items.filter(item => item.pdid !== action.payload.pdid);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistMessage } = wishlistSlice.actions;
export default wishlistSlice.reducer;
