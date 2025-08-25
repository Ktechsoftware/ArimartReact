import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../api';

// Async Thunks
export const recordDeliveryEarning = createAsyncThunk(
  "earnings/recordDeliveryEarning",
  async ({ partnerId, orderId, earnAmount }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/delivery/earnings/record", {
        PartnerId: partnerId,
        OrderId: orderId,
        EarnAmount: earnAmount
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPartnerEarnings = createAsyncThunk(
  "earnings/fetchPartnerEarnings",
  async ({ partnerId, startDate, endDate, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await API.get(`/delivery/earnings/${partnerId}?${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchEarningSummary = createAsyncThunk(
  "earnings/fetchEarningSummary",
  async ({ partnerId, date }, { rejectWithValue }) => {
    try {
      const params = date ? `?date=${date}` : '';
      const { data } = await API.get(`/delivery/earnings/summary/${partnerId}${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchEarningsChart = createAsyncThunk(
  "earnings/fetchEarningsChart",
  async ({ partnerId, period = "week", startDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ period });
      if (startDate) params.append('startDate', startDate);
      
      const { data } = await API.get(`/delivery/earnings/chart/${partnerId}?${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchEarningsLeaderboard = createAsyncThunk(
  "earnings/fetchEarningsLeaderboard",
  async ({ period = "month", limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/delivery/earnings/leaderboard?period=${period}&limit=${limit}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const bulkRecordEarnings = createAsyncThunk(
  "earnings/bulkRecordEarnings",
  async (earningsArray, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/delivery/earnings/bulk-record", earningsArray);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial State
const initialState = {
  // Earnings Data
  earnings: [],
  summary: null,
  chartData: null,
  leaderboard: null,
  
  // Current Earnings
  todayEarnings: 0,
  weeklyEarnings: 0,
  monthlyEarnings: 0,
  totalEarnings: 0,
  
  // Statistics
  todayDeliveries: 0,
  weeklyDeliveries: 0,
  monthlyDeliveries: 0,
  totalDeliveries: 0,
  avgEarningsPerDelivery: 0,
  
  // Goals and Progress
  dailyGoal: 500,
  weeklyGoal: 3500,
  monthlyGoal: 15000,
  dailyProgress: 0,
  weeklyProgress: 0,
  monthlyProgress: 0,
  
  // Peak Performance
  peakEarningDay: null,
  peakEarningAmount: 0,
  
  // UI States
  isLoading: false,
  isRecording: false,
  error: null,
  successMessage: null,
  
  // Pagination
  currentPage: 1,
  pageSize: 20,
  hasMore: true
};

// Earnings Slice
const earningsSlice = createSlice({
  name: 'earnings',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    updateDailyGoal: (state, action) => {
      state.dailyGoal = action.payload;
      state.dailyProgress = (state.todayEarnings / action.payload) * 100;
    },
    
    updateWeeklyGoal: (state, action) => {
      state.weeklyGoal = action.payload;
      state.weeklyProgress = (state.weeklyEarnings / action.payload) * 100;
    },
    
    updateMonthlyGoal: (state, action) => {
      state.monthlyGoal = action.payload;
      state.monthlyProgress = (state.monthlyEarnings / action.payload) * 100;
    },
    
    resetEarnings: (state) => {
      state.earnings = [];
      state.summary = null;
      state.chartData = null;
      state.currentPage = 1;
      state.hasMore = true;
    },
    
    incrementPage: (state) => {
      state.currentPage += 1;
    },
    
    // Local update for real-time earnings
    addEarningLocally: (state, action) => {
      const earning = action.payload;
      state.earnings.unshift(earning);
      state.todayEarnings += earning.earnAmount;
      state.totalEarnings += earning.earnAmount;
      state.todayDeliveries += 1;
      state.totalDeliveries += 1;
      
      // Update progress
      state.dailyProgress = (state.todayEarnings / state.dailyGoal) * 100;
      state.weeklyProgress = (state.weeklyEarnings / state.weeklyGoal) * 100;
      state.monthlyProgress = (state.monthlyEarnings / state.monthlyGoal) * 100;
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Record Delivery Earning
      .addCase(recordDeliveryEarning.pending, (state) => {
        state.isRecording = true;
        state.error = null;
      })
      .addCase(recordDeliveryEarning.fulfilled, (state, action) => {
        state.isRecording = false;
        state.successMessage = action.payload.message;
        
        // Add to local earnings
        if (action.payload.earning) {
          state.earnings.unshift(action.payload.earning);
          state.todayEarnings += action.payload.earning.earnAmount;
          state.totalEarnings += action.payload.earning.earnAmount;
          state.todayDeliveries += 1;
          state.totalDeliveries += 1;
          
          // Update progress
          state.dailyProgress = (state.todayEarnings / state.dailyGoal) * 100;
        }
      })
      .addCase(recordDeliveryEarning.rejected, (state, action) => {
        state.isRecording = false;
        state.error = action.payload;
      })
      
      // Fetch Partner Earnings
      .addCase(fetchPartnerEarnings.pending, (state) => {
        if (state.currentPage === 1) {
          state.isLoading = true;
        }
      })
      .addCase(fetchPartnerEarnings.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (state.currentPage === 1) {
          state.earnings = action.payload;
        } else {
          state.earnings = [...state.earnings, ...action.payload];
        }
        
        state.hasMore = action.payload.length === state.pageSize;
      })
      .addCase(fetchPartnerEarnings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Earning Summary
      .addCase(fetchEarningSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEarningSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
        
        // Update state with summary data
        const summary = action.payload;
        state.todayEarnings = summary.todayEarnings || 0;
        state.weeklyEarnings = summary.weeklyEarnings || 0;
        state.monthlyEarnings = summary.monthlyEarnings || 0;
        state.totalEarnings = summary.totalLifetimeEarnings || 0;
        
        state.todayDeliveries = summary.todayDeliveries || 0;
        state.weeklyDeliveries = summary.weeklyDeliveries || 0;
        state.monthlyDeliveries = summary.monthlyDeliveries || 0;
        state.totalDeliveries = summary.totalLifetimeDeliveries || 0;
        
        state.avgEarningsPerDelivery = summary.averageEarningsPerDelivery || 0;
        
        // Goals and Progress
        state.dailyGoal = summary.dailyGoal || 500;
        state.weeklyGoal = summary.weeklyGoal || 3500;
        state.monthlyGoal = summary.monthlyGoal || 15000;
        state.dailyProgress = summary.dailyProgress || 0;
        state.weeklyProgress = summary.weeklyProgress || 0;
        state.monthlyProgress = summary.monthlyProgress || 0;
        
        // Peak Performance
        state.peakEarningDay = summary.peakEarningDay;
        state.peakEarningAmount = summary.peakEarningAmount || 0;
      })
      .addCase(fetchEarningSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Earnings Chart
      .addCase(fetchEarningsChart.fulfilled, (state, action) => {
        state.chartData = action.payload;
      })
      
      // Fetch Earnings Leaderboard
      .addCase(fetchEarningsLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      
      // Bulk Record Earnings
      .addCase(bulkRecordEarnings.pending, (state) => {
        state.isRecording = true;
      })
      .addCase(bulkRecordEarnings.fulfilled, (state, action) => {
        state.isRecording = false;
        state.successMessage = action.payload.message;
      })
      .addCase(bulkRecordEarnings.rejected, (state, action) => {
        state.isRecording = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearMessages,
  updateDailyGoal,
  updateWeeklyGoal,
  updateMonthlyGoal,
  resetEarnings,
  incrementPage,
  addEarningLocally
} = earningsSlice.actions;

// Selectors
export const selectEarnings = (state) => state.earnings?.earnings || [];
export const selectEarningSummary = (state) => state.earnings?.summary;
export const selectTodayEarnings = (state) => state.earnings?.todayEarnings || 0;
export const selectWeeklyEarnings = (state) => state.earnings?.weeklyEarnings || 0;
export const selectMonthlyEarnings = (state) => state.earnings?.monthlyEarnings || 0;
export const selectTotalEarnings = (state) => state.earnings?.totalEarnings || 0;
export const selectTodayDeliveries = (state) => state.earnings?.todayDeliveries || 0;
export const selectWeeklyDeliveries = (state) => state.earnings?.weeklyDeliveries || 0;
export const selectMonthlyDeliveries = (state) => state.earnings?.monthlyDeliveries || 0;
export const selectTotalDeliveries = (state) => state.earnings?.totalDeliveries || 0;
export const selectAvgEarningsPerDelivery = (state) => state.earnings?.avgEarningsPerDelivery || 0;
export const selectDailyProgress = (state) => state.earnings?.dailyProgress || 0;
export const selectWeeklyProgress = (state) => state.earnings?.weeklyProgress || 0;
export const selectMonthlyProgress = (state) => state.earnings?.monthlyProgress || 0;
export const selectDailyGoal = (state) => state.earnings?.dailyGoal || 500;
export const selectWeeklyGoal = (state) => state.earnings?.weeklyGoal || 3500;
export const selectMonthlyGoal = (state) => state.earnings?.monthlyGoal || 15000;
export const selectEarningsChart = (state) => state.earnings?.chartData;
export const selectEarningsLeaderboard = (state) => state.earnings?.leaderboard;
export const selectIsEarningsLoading = (state) => state.earnings?.isLoading || false;
export const selectIsRecordingEarning = (state) => state.earnings?.isRecording || false;
export const selectEarningsError = (state) => state.earnings?.error;
export const selectEarningsSuccess = (state) => state.earnings?.successMessage;

export default earningsSlice.reducer;