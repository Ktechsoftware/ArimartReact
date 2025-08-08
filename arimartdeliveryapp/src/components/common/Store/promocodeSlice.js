import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api'

// ===================== THUNKS =====================

// Fetch my rewards (available promos for logged-in user)
export const fetchMyRewards = createAsyncThunk(
  'promocode/fetchMyRewards',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/promocode/my-rewards/${userId}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch rewards');
    }
  }
);

// Apply promo code to order
export const applyPromoCode = createAsyncThunk(
  'promocode/applyPromoCode',
  async (data, { rejectWithValue }) => {
    try {
      console.log("promcode data : ",data)
      const response = await API.post(`/promocode/apply`, data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Promo application failed');
    }
  }
);

// Validate if promo is applicable to a product
export const validatePromoForProduct = createAsyncThunk(
  'promocode/validatePromoForProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post(`/promocode/validate-product`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Promo not valid for this product');
    }
  }
);

// ===================== SLICE =====================

const promocodeSlice = createSlice({
  name: 'promocode',
  initialState: {
    myRewards: [],
    applyResult: null,
    validationResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPromoState: (state) => {
      state.applyResult = null;
      state.validationResult = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.myRewards = action.payload;
      })
      .addCase(fetchMyRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(applyPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.applyResult = action.payload;
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(validatePromoForProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validatePromoForProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.validationResult = action.payload;
      })
      .addCase(validatePromoForProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPromoState } = promocodeSlice.actions;
export default promocodeSlice.reducer;
