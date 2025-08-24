import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Additional action for testing delivery completion
export const testDeliveryCompletion = createAsyncThunk(
  'referEarn/testDeliveryCompletion',
  async (partnerId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/DeliveryReferral/delivery-completed/${partnerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunks
export const fetchReferralCode = createAsyncThunk(
  'referEarn/fetchReferralCode',
  async (partnerId, { rejectWithValue }) => {
    try {
      if (!partnerId) {
        throw new Error('Partner ID is required');
      }
      const response = await API.get(`/DeliveryReferral/my-deliverrefcode/${partnerId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Failed to fetch referral code';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchReferralStats = createAsyncThunk(
  'referEarn/fetchReferralStats',
  async (partnerId, { rejectWithValue }) => {
    try {
      if (!partnerId) {
        throw new Error('Partner ID is required');
      }
      const response = await API.get(`/DeliveryReferral/stats/${partnerId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.title || 
                          error.message || 
                          'Failed to fetch referral stats';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markDeliveryCompleted = createAsyncThunk(
  'referEarn/markDeliveryCompleted',
  async (partnerId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/DeliveryReferral/delivery-completed/${partnerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Referral code data
  referralCode: null,
  userInfo: null,
  
  // Stats
  stats: {
    totalReferred: 0,
    totalEarned: 0,
    pendingRewards: 0,
    referralCode: null
  },
  
  // Loading states
  loading: {
    fetchingCode: false,
    fetchingStats: false,
    completingDelivery: false
  },
  
  // Error states
  error: {
    code: null,
    stats: null,
    delivery: null
  },
  
  // UI states
  copied: false,
  faqOpen: null,
  
  // Success messages
  deliveryMessage: null
};

const referEarnSlice = createSlice({
  name: 'referEarn',
  initialState,
  reducers: {
    setCopied: (state, action) => {
      state.copied = action.payload;
    },
    setFaqOpen: (state, action) => {
      state.faqOpen = action.payload;
    },
    clearErrors: (state) => {
      state.error = {
        code: null,
        stats: null,
        delivery: null
      };
    },
    clearDeliveryMessage: (state) => {
      state.deliveryMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Referral Code
      .addCase(fetchReferralCode.pending, (state) => {
        state.loading.fetchingCode = true;
        state.error.code = null;
      })
      .addCase(fetchReferralCode.fulfilled, (state, action) => {
        state.loading.fetchingCode = false;
        state.referralCode = action.payload.referCode;
        state.userInfo = {
          userId: action.payload.userId,
          name: action.payload.name,
          phone: action.payload.phone
        };
      })
      .addCase(fetchReferralCode.rejected, (state, action) => {
        state.loading.fetchingCode = false;
        state.error.code = action.payload;
      })
      
      // Fetch Referral Stats
      .addCase(fetchReferralStats.pending, (state) => {
        state.loading.fetchingStats = true;
        state.error.stats = null;
      })
      .addCase(fetchReferralStats.fulfilled, (state, action) => {
        state.loading.fetchingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchReferralStats.rejected, (state, action) => {
        state.loading.fetchingStats = false;
        state.error.stats = action.payload;
      })
      
      // Mark Delivery Completed
      .addCase(markDeliveryCompleted.pending, (state) => {
        state.loading.completingDelivery = true;
        state.error.delivery = null;
      })
      .addCase(markDeliveryCompleted.fulfilled, (state, action) => {
        state.loading.completingDelivery = false;
        state.deliveryMessage = action.payload;
      })
      .addCase(markDeliveryCompleted.rejected, (state, action) => {
        state.loading.completingDelivery = false;
        state.error.delivery = action.payload;
      });
  }
});

export const { 
  setCopied, 
  setFaqOpen, 
  clearErrors, 
  clearDeliveryMessage 
} = referEarnSlice.actions;

export default referEarnSlice.reducer;