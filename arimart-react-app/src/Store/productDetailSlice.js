import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Thunk to fetch product by ID
export const fetchProductById = createAsyncThunk(
  'productDetail/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const productDetailSlice = createSlice({
  name: 'productDetail',
  initialState: {
    product: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productDetailSlice.reducer;
