
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// ✅ Get Wallet Balance
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchWalletBalance',
  async (userid, thunkAPI) => {
    try {
      const response = await API.get(`/wallet/balance/${userid}`);
    //   console.log("Wallet Balance Response:", response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch wallet balance");
    }
  }
);

// ✅ Add to Wallet
export const addToWallet = createAsyncThunk(
  'wallet/addToWallet',
  async ({ userid, amount }, thunkAPI) => {
    try {
      const response = await API.post('/wallet/add', { userid, amount });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add to wallet");
    }
  }
);

// ✅ Deduct from Wallet
export const deductFromWallet = createAsyncThunk(
  'wallet/deductFromWallet',
  async ({ userid, amount }, thunkAPI) => {
    try {
      const response = await API.post('/wallet/deduct', { userid, amount });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to deduct from wallet");
    }
  }
);

// Initial State
const initialState = {
  balance: 0,
  loading: false,
  error: null,
  successMessage: null,
};

// Slice
const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // fetch balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // add
      .addCase(addToWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(addToWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deduct
      .addCase(deductFromWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(deductFromWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deductFromWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearWalletState } = walletSlice.actions;
export default walletSlice.reducer;
