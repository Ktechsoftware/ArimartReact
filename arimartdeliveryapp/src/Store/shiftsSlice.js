import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../api';

// Async Thunks
export const startShift = createAsyncThunk(
  "shifts/startShift",
  async ({ partnerId, startLatitude, startLongitude }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/delivery/shift/start", {
        PartnerId: partnerId,
        StartLatitude: startLatitude,
        StartLongitude: startLongitude
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const endShift = createAsyncThunk(
  "shifts/endShift",
  async ({ partnerId, endLatitude, endLongitude }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/delivery/shift/end", {
        PartnerId: partnerId,
        EndLatitude: endLatitude,
        EndLongitude: endLongitude
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchShiftStats = createAsyncThunk(
  "shifts/fetchShiftStats",
  async (partnerId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/delivery/shift/stats/${partnerId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchShiftHistory = createAsyncThunk(
  "shifts/fetchShiftHistory",
  async ({ partnerId, days = 30, page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/delivery/shift/history/${partnerId}?days=${days}&page=${page}&pageSize=${pageSize}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOnlineStatus = createAsyncThunk(
  "shifts/fetchOnlineStatus",
  async (partnerId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/delivery/shift/online-status/${partnerId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchEarningsReport = createAsyncThunk(
  "shifts/fetchEarningsReport",
  async ({ partnerId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const { data } = await API.get(
        `/delivery/shift/earnings-report/${partnerId}?${params}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial State
const initialState = {
  // Current Shift Status
  isOnline: false,
  currentShiftId: null,
  currentShiftStart: null,
  currentShiftDuration: "00:00:00",
  currentShiftEarnings: 0,
  currentShiftDeliveries: 0,
  
  // Today's Stats
  todayLoginHours: "00:00:00",
  todayEarnings: 0,
  todayDeliveries: 0,
  
  // Weekly Stats
  weeklyLoginHours: "00:00:00",
  weeklyEarnings: 0,
  weeklyDeliveries: 0,
  
  // Monthly Stats
  monthlyLoginHours: "00:00:00",
  monthlyEarnings: 0,
  monthlyDeliveries: 0,
  
  // Shift History
  shiftHistory: [],
  currentHistoryPage: 1,
  hasMoreHistory: true,
  
  // Available Incentives
  availableIncentives: [],
  
  // Earnings Report
  earningsReport: null,
  
  // Online Status
  onlineStatus: null,
  lastStatusUpdate: null,
  onlineDuration: "00:00:00",
  
  // UI States
  isLoading: false,
  isStartingShift: false,
  isEndingShift: false,
  error: null,
  successMessage: null,
  
  // Real-time Updates
  shiftTimer: null,
  lastLocationUpdate: null,
  
  // Performance Goals
  dailyHoursGoal: 8, // 8 hours per day
  weeklyHoursGoal: 40, // 40 hours per week
  monthlyHoursGoal: 160 // 160 hours per month
};

// Helper function to calculate duration
const calculateDuration = (startTime) => {
  if (!startTime) return "00:00:00";
  const now = new Date();
  const start = new Date(startTime);
  const diff = now - start;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Shifts Slice
const shiftsSlice = createSlice({
  name: 'shifts',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Update current shift duration in real-time
    updateCurrentShiftDuration: (state) => {
      if (state.currentShiftStart && state.isOnline) {
        state.currentShiftDuration = calculateDuration(state.currentShiftStart);
        state.onlineDuration = state.currentShiftDuration;
      }
    },
    
    // Set online status locally (for immediate UI feedback)
    setOnlineStatusLocal: (state, action) => {
      state.isOnline = action.payload;
      state.lastStatusUpdate = new Date().toISOString();
    },
    
    // Update location
    updateLastLocationUpdate: (state) => {
      state.lastLocationUpdate = new Date().toISOString();
    },
    
    // Reset shift history
    resetShiftHistory: (state) => {
      state.shiftHistory = [];
      state.currentHistoryPage = 1;
      state.hasMoreHistory = true;
    },
    
    // Increment history page
    incrementHistoryPage: (state) => {
      state.currentHistoryPage += 1;
    },
    
    // Set performance goals
    setDailyHoursGoal: (state, action) => {
      state.dailyHoursGoal = action.payload;
    },
    
    setWeeklyHoursGoal: (state, action) => {
      state.weeklyHoursGoal = action.payload;
    },
    
    setMonthlyHoursGoal: (state, action) => {
      state.monthlyHoursGoal = action.payload;
    },
    
    // Update incentives locally
    updateIncentiveProgress: (state, action) => {
      const { ruleId, currentOrders } = action.payload;
      const incentive = state.availableIncentives.find(i => i.ruleId === ruleId);
      if (incentive) {
        incentive.currentOrders = currentOrders;
        incentive.ordersNeeded = Math.max(0, incentive.minOrders - currentOrders);
        incentive.progressPercentage = currentOrders >= incentive.minOrders ? 100 : 
          (currentOrders / incentive.minOrders) * 100;
        incentive.isEligible = currentOrders >= incentive.minOrders;
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Start Shift
      .addCase(startShift.pending, (state) => {
        state.isStartingShift = true;
        state.error = null;
      })
      .addCase(startShift.fulfilled, (state, action) => {
        state.isStartingShift = false;
        state.successMessage = action.payload.message;
        
        const shift = action.payload.shift;
        state.isOnline = true;
        state.currentShiftId = shift.shiftId;
        state.currentShiftStart = shift.startTime;
        state.currentShiftDuration = shift.duration || "00:00:00";
        state.currentShiftEarnings = shift.totalEarnings || 0;
        state.currentShiftDeliveries = shift.deliveriesCompleted || 0;
        state.lastStatusUpdate = new Date().toISOString();
      })
      .addCase(startShift.rejected, (state, action) => {
        state.isStartingShift = false;
        state.error = action.payload;
      })
      
      // End Shift
      .addCase(endShift.pending, (state) => {
        state.isEndingShift = true;
        state.error = null;
      })
      .addCase(endShift.fulfilled, (state, action) => {
        state.isEndingShift = false;
        state.successMessage = action.payload.message;
        
        const shift = action.payload.shift;
        state.isOnline = false;
        state.currentShiftId = null;
        state.currentShiftStart = null;
        state.currentShiftDuration = "00:00:00";
        state.currentShiftEarnings = 0;
        state.currentShiftDeliveries = 0;
        state.onlineDuration = "00:00:00";
        state.lastStatusUpdate = new Date().toISOString();
        
        // Add to history
        if (shift) {
          state.shiftHistory.unshift({
            shiftId: shift.shiftId,
            startTime: shift.startTime,
            endTime: shift.endTime,
            duration: shift.duration,
            earnings: shift.totalEarnings || 0,
            deliveriesCompleted: shift.deliveriesCompleted || 0,
            startLocation: "Location tracked",
            endLocation: "Location tracked"
          });
        }
      })
      .addCase(endShift.rejected, (state, action) => {
        state.isEndingShift = false;
        state.error = action.payload;
      })
      
      // Fetch Shift Stats
      .addCase(fetchShiftStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShiftStats.fulfilled, (state, action) => {
        state.isLoading = false;
        const stats = action.payload;
        
        // Current Status
        state.isOnline = stats.isCurrentlyOnline || false;
        state.currentShiftId = stats.currentShiftId;
        state.currentShiftStart = stats.currentShiftStart;
        state.currentShiftDuration = stats.currentShiftDuration || "00:00:00";
        state.currentShiftEarnings = stats.currentShiftEarnings || 0;
        state.currentShiftDeliveries = stats.currentShiftDeliveries || 0;
        
        // Today's Stats
        state.todayLoginHours = stats.todayLoginHours || "00:00:00";
        state.todayEarnings = stats.todayEarnings || 0;
        state.todayDeliveries = stats.todayDeliveries || 0;
        
        // Weekly Stats
        state.weeklyLoginHours = stats.weeklyLoginHours || "00:00:00";
        state.weeklyEarnings = stats.weeklyEarnings || 0;
        state.weeklyDeliveries = stats.weeklyDeliveries || 0;
        
        // Monthly Stats
        state.monthlyLoginHours = stats.monthlyLoginHours || "00:00:00";
        state.monthlyEarnings = stats.monthlyEarnings || 0;
        state.monthlyDeliveries = stats.monthlyDeliveries || 0;
        
        // Available Incentives
        state.availableIncentives = stats.availableIncentives || [];
      })
      .addCase(fetchShiftStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Shift History
      .addCase(fetchShiftHistory.pending, (state) => {
        if (state.currentHistoryPage === 1) {
          state.isLoading = true;
        }
      })
      .addCase(fetchShiftHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (state.currentHistoryPage === 1) {
          state.shiftHistory = action.payload;
        } else {
          state.shiftHistory = [...state.shiftHistory, ...action.payload];
        }
        
        state.hasMoreHistory = action.payload.length === 20; // Assuming pageSize is 20
      })
      .addCase(fetchShiftHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Online Status
      .addCase(fetchOnlineStatus.fulfilled, (state, action) => {
        const status = action.payload;
        state.onlineStatus = status;
        state.isOnline = status.isOnline || false;
        state.currentShiftId = status.currentShiftId;
        state.currentShiftStart = status.currentShiftStart;
        state.onlineDuration = status.onlineDuration || "00:00:00";
        state.lastStatusUpdate = new Date().toISOString();
      })
      
      // Fetch Earnings Report
      .addCase(fetchEarningsReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEarningsReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.earningsReport = action.payload;
      })
      .addCase(fetchEarningsReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearMessages,
  updateCurrentShiftDuration,
  setOnlineStatusLocal,
  updateLastLocationUpdate,
  resetShiftHistory,
  incrementHistoryPage,
  setDailyHoursGoal,
  setWeeklyHoursGoal,
  setMonthlyHoursGoal,
  updateIncentiveProgress
} = shiftsSlice.actions;

// Selectors
export const selectIsOnline = (state) => state.shifts?.isOnline || false;
export const selectCurrentShiftId = (state) => state.shifts?.currentShiftId;
export const selectCurrentShiftStart = (state) => state.shifts?.currentShiftStart;
export const selectCurrentShiftDuration = (state) => state.shifts?.currentShiftDuration || "00:00:00";
export const selectCurrentShiftEarnings = (state) => state.shifts?.currentShiftEarnings || 0;
export const selectCurrentShiftDeliveries = (state) => state.shifts?.currentShiftDeliveries || 0;
export const selectTodayLoginHours = (state) => state.shifts?.todayLoginHours || "00:00:00";
export const selectTodayShiftEarnings = (state) => state.shifts?.todayEarnings || 0;
export const selectTodayShiftDeliveries = (state) => state.shifts?.todayDeliveries || 0;
export const selectWeeklyLoginHours = (state) => state.shifts?.weeklyLoginHours || "00:00:00";
export const selectWeeklyShiftEarnings = (state) => state.shifts?.weeklyEarnings || 0;
export const selectWeeklyShiftDeliveries = (state) => state.shifts?.weeklyDeliveries || 0;
export const selectMonthlyLoginHours = (state) => state.shifts?.monthlyLoginHours || "00:00:00";
export const selectMonthlyShiftEarnings = (state) => state.shifts?.monthlyEarnings || 0;
export const selectMonthlyShiftDeliveries = (state) => state.shifts?.monthlyDeliveries || 0;
export const selectShiftHistory = (state) => state.shifts?.shiftHistory || [];
export const selectAvailableIncentives = (state) => state.shifts?.availableIncentives || [];
export const selectEarningsReport = (state) => state.shifts?.earningsReport;
export const selectOnlineStatus = (state) => state.shifts?.onlineStatus;
export const selectOnlineDuration = (state) => state.shifts?.onlineDuration || "00:00:00";
export const selectIsShiftsLoading = (state) => state.shifts?.isLoading || false;
export const selectIsStartingShift = (state) => state.shifts?.isStartingShift || false;
export const selectIsEndingShift = (state) => state.shifts?.isEndingShift || false;
export const selectShiftsError = (state) => state.shifts?.error;
export const selectShiftsSuccess = (state) => state.shifts?.successMessage;
export const selectDailyHoursGoal = (state) => state.shifts?.dailyHoursGoal || 8;
export const selectWeeklyHoursGoal = (state) => state.shifts?.weeklyHoursGoal || 40;
export const selectMonthlyHoursGoal = (state) => state.shifts?.monthlyHoursGoal || 160;

export default shiftsSlice.reducer;