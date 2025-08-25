import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../api';

// Async Thunks
export const createIncentiveRule = createAsyncThunk(
  "incentives/createIncentiveRule",
  async ({ effectiveDate, city, minOrders, incentiveAmount }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/delivery/incentive/rules", {
        EffectiveDate: effectiveDate,
        City: city,
        MinOrders: minOrders,
        IncentiveAmount: incentiveAmount
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchIncentiveRules = createAsyncThunk(
  "incentives/fetchIncentiveRules",
  async ({ activeOnly = true, city = null }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('activeOnly', activeOnly.toString());
      if (city) params.append('city', city);
      
      const { data } = await API.get(`/delivery/incentive/rules?${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAvailableIncentives = createAsyncThunk(
  "incentives/fetchAvailableIncentives",
  async (partnerId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/delivery/incentive/available/${partnerId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const calculateDailyIncentives = createAsyncThunk(
  "incentives/calculateDailyIncentives",
  async ({ partnerId, date }, { rejectWithValue }) => {
    try {
      const params = date ? `?date=${date}` : '';
      const { data } = await API.post(`/delivery/incentive/calculate/${partnerId}${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const processDailyIncentives = createAsyncThunk(
  "incentives/processDailyIncentives",
  async ({ date }, { rejectWithValue }) => {
    try {
      const params = date ? `?date=${date}` : '';
      const { data } = await API.post(`/delivery/incentive/process-daily${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchIncentiveLeaderboard = createAsyncThunk(
  "incentives/fetchIncentiveLeaderboard",
  async ({ startDate, endDate, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('limit', limit.toString());
      
      const { data } = await API.get(`/delivery/incentive/leaderboard?${params}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateIncentiveRule = createAsyncThunk(
  "incentives/updateIncentiveRule",
  async ({ id, effectiveDate, city, minOrders, incentiveAmount }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/delivery/incentive/rules/${id}`, {
        EffectiveDate: effectiveDate,
        City: city,
        MinOrders: minOrders,
        IncentiveAmount: incentiveAmount
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteIncentiveRule = createAsyncThunk(
  "incentives/deleteIncentiveRule",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.delete(`/delivery/incentive/rules/${id}`);
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Initial State
const initialState = {
  // Incentive Rules
  incentiveRules: [],
  
  // Available Incentives for Partner
  availableIncentives: [],
  
  // Current Incentive Progress
  todayDeliveries: 0,
  currentIncentiveTarget: null,
  nextIncentiveTarget: null,
  incentiveProgress: 0,
  
  // Earned Incentives
  earnedIncentives: [],
  totalIncentivesEarned: 0,
  todayIncentiveEarned: 0,
  weeklyIncentiveEarned: 0,
  monthlyIncentiveEarned: 0,
  
  // Daily Incentive Calculation
  dailyIncentiveCalculation: null,
  
  // Leaderboard
  incentiveLeaderboard: null,
  
  // Processing Results
  dailyProcessingResult: null,
  
  // UI States
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isCalculating: false,
  isProcessing: false,
  error: null,
  successMessage: null,
  
  // Notifications
  incentiveNotifications: [],
  hasNewIncentive: false,
  
  // Filter States
  selectedCity: null,
  showActiveOnly: true,
  
  // Gamification
  currentStreak: 0,
  bestStreak: 0,
  totalIncentivesDays: 0,
  incentiveBadges: []
};

// Incentives Slice
const incentivesSlice = createSlice({
  name: 'incentives',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Update today's deliveries locally
    updateTodayDeliveries: (state, action) => {
      state.todayDeliveries = action.payload;
      
      // Update progress for available incentives
      state.availableIncentives = state.availableIncentives.map(incentive => {
        const ordersNeeded = Math.max(0, incentive.minOrders - action.payload);
        const progressPercentage = action.payload >= incentive.minOrders ? 100 :
          (action.payload / incentive.minOrders) * 100;
        
        return {
          ...incentive,
          currentOrders: action.payload,
          ordersNeeded,
          isEligible: action.payload >= incentive.minOrders,
          progressPercentage: Math.min(100, progressPercentage)
        };
      });
      
      // Update current and next targets
      const sortedIncentives = [...state.availableIncentives].sort((a, b) => a.minOrders - b.minOrders);
      
      // Find current target (next achievable incentive)
      state.currentIncentiveTarget = sortedIncentives.find(
        incentive => !incentive.isEligible
      ) || null;
      
      // Find next target after current
      if (state.currentIncentiveTarget) {
        const currentIndex = sortedIncentives.findIndex(
          incentive => incentive.ruleId === state.currentIncentiveTarget.ruleId
        );
        state.nextIncentiveTarget = sortedIncentives[currentIndex + 1] || null;
      }
      
      // Calculate overall progress (based on highest available incentive)
      const highestIncentive = sortedIncentives[sortedIncentives.length - 1];
      if (highestIncentive) {
        state.incentiveProgress = Math.min(100, (action.payload / highestIncentive.minOrders) * 100);
      }
    },
    
    // Add earned incentive locally
    addEarnedIncentive: (state, action) => {
      const incentive = action.payload;
      state.earnedIncentives.unshift(incentive);
      state.totalIncentivesEarned += incentive.amount;
      state.todayIncentiveEarned += incentive.amount;
      
      // Update streak
      state.currentStreak += 1;
      if (state.currentStreak > state.bestStreak) {
        state.bestStreak = state.currentStreak;
      }
      
      // Add notification
      state.incentiveNotifications.unshift({
        id: Date.now(),
        message: `🎉 You've earned ₹${incentive.amount} incentive!`,
        amount: incentive.amount,
        timestamp: new Date().toISOString(),
        isRead: false
      });
      
      state.hasNewIncentive = true;
    },
    
    // Mark notifications as read
    markNotificationsRead: (state) => {
      state.incentiveNotifications = state.incentiveNotifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      state.hasNewIncentive = false;
    },
    
    // Clear notifications
    clearNotifications: (state) => {
      state.incentiveNotifications = [];
      state.hasNewIncentive = false;
    },
    
    // Set filter states
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    
    setShowActiveOnly: (state, action) => {
      state.showActiveOnly = action.payload;
    },
    
    // Reset streak (called daily if no incentive earned)
    resetStreak: (state) => {
      state.currentStreak = 0;
    },
    
    // Update badges
    updateIncentiveBadges: (state, action) => {
      state.incentiveBadges = action.payload;
    },
    
    // Daily reset (called at start of new day)
    dailyReset: (state) => {
      state.todayIncentiveEarned = 0;
      state.todayDeliveries = 0;
      state.incentiveProgress = 0;
      state.currentIncentiveTarget = null;
      state.nextIncentiveTarget = null;
      
      // Reset available incentives progress
      state.availableIncentives = state.availableIncentives.map(incentive => ({
        ...incentive,
        currentOrders: 0,
        ordersNeeded: incentive.minOrders,
        isEligible: false,
        progressPercentage: 0
      }));
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Create Incentive Rule
      .addCase(createIncentiveRule.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createIncentiveRule.fulfilled, (state, action) => {
        state.isCreating = false;
        state.successMessage = "Incentive rule created successfully!";
        state.incentiveRules.unshift(action.payload);
      })
      .addCase(createIncentiveRule.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      
      // Fetch Incentive Rules
      .addCase(fetchIncentiveRules.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIncentiveRules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incentiveRules = action.payload;
      })
      .addCase(fetchIncentiveRules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Available Incentives
      .addCase(fetchAvailableIncentives.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableIncentives.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableIncentives = action.payload;
        
        // Set current and next targets
        const sortedIncentives = [...action.payload].sort((a, b) => a.minOrders - b.minOrders);
        state.currentIncentiveTarget = sortedIncentives.find(
          incentive => !incentive.isEligible
        ) || null;
        
        if (state.currentIncentiveTarget) {
          const currentIndex = sortedIncentives.findIndex(
            incentive => incentive.ruleId === state.currentIncentiveTarget.ruleId
          );
          state.nextIncentiveTarget = sortedIncentives[currentIndex + 1] || null;
        }
        
        // Set today's deliveries from the first incentive (they all have the same currentOrders)
        if (action.payload.length > 0) {
          state.todayDeliveries = action.payload[0].currentOrders || 0;
          
          // Calculate progress
          const highestIncentive = sortedIncentives[sortedIncentives.length - 1];
          if (highestIncentive) {
            state.incentiveProgress = Math.min(100, (state.todayDeliveries / highestIncentive.minOrders) * 100);
          }
        }
      })
      .addCase(fetchAvailableIncentives.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Calculate Daily Incentives
      .addCase(calculateDailyIncentives.pending, (state) => {
        state.isCalculating = true;
      })
      .addCase(calculateDailyIncentives.fulfilled, (state, action) => {
        state.isCalculating = false;
        state.dailyIncentiveCalculation = action.payload;
      })
      .addCase(calculateDailyIncentives.rejected, (state, action) => {
        state.isCalculating = false;
        state.error = action.payload;
      })
      
      // Process Daily Incentives
      .addCase(processDailyIncentives.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(processDailyIncentives.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.dailyProcessingResult = action.payload;
        state.successMessage = action.payload.message;
      })
      .addCase(processDailyIncentives.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
      })
      
      // Fetch Incentive Leaderboard
      .addCase(fetchIncentiveLeaderboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIncentiveLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incentiveLeaderboard = action.payload;
      })
      .addCase(fetchIncentiveLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Incentive Rule
      .addCase(updateIncentiveRule.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateIncentiveRule.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.successMessage = action.payload.message;
        
        // Update rule in state
        const index = state.incentiveRules.findIndex(rule => rule.ruleId === action.payload.rule.ruleId);
        if (index !== -1) {
          state.incentiveRules[index] = action.payload.rule;
        }
      })
      .addCase(updateIncentiveRule.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      
      // Delete Incentive Rule
      .addCase(deleteIncentiveRule.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteIncentiveRule.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.successMessage = action.payload.message;
        
        // Mark rule as inactive
        const index = state.incentiveRules.findIndex(rule => rule.ruleId === action.payload.id);
        if (index !== -1) {
          state.incentiveRules[index].isActive = false;
        }
      })
      .addCase(deleteIncentiveRule.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearMessages,
  updateTodayDeliveries,
  addEarnedIncentive,
  markNotificationsRead,
  clearNotifications,
  setSelectedCity,
  setShowActiveOnly,
  resetStreak,
  updateIncentiveBadges,
  dailyReset
} = incentivesSlice.actions;

// Selectors
export const selectIncentiveRules = (state) => state.incentives?.incentiveRules || [];
export const selectAvailableIncentivesData = (state) => state.incentives?.availableIncentives || [];
export const selectTodayIncentiveDeliveries = (state) => state.incentives?.todayDeliveries || 0;
export const selectCurrentIncentiveTarget = (state) => state.incentives?.currentIncentiveTarget;
export const selectNextIncentiveTarget = (state) => state.incentives?.nextIncentiveTarget;
export const selectIncentiveProgress = (state) => state.incentives?.incentiveProgress || 0;
export const selectEarnedIncentives = (state) => state.incentives?.earnedIncentives || [];
export const selectTotalIncentivesEarned = (state) => state.incentives?.totalIncentivesEarned || 0;
export const selectTodayIncentiveEarned = (state) => state.incentives?.todayIncentiveEarned || 0;
export const selectWeeklyIncentiveEarned = (state) => state.incentives?.weeklyIncentiveEarned || 0;
export const selectMonthlyIncentiveEarned = (state) => state.incentives?.monthlyIncentiveEarned || 0;
export const selectDailyIncentiveCalculation = (state) => state.incentives?.dailyIncentiveCalculation;
export const selectIncentiveLeaderboardData = (state) => state.incentives?.incentiveLeaderboard;
export const selectDailyProcessingResult = (state) => state.incentives?.dailyProcessingResult;
export const selectIncentiveNotifications = (state) => state.incentives?.incentiveNotifications || [];
export const selectHasNewIncentive = (state) => state.incentives?.hasNewIncentive || false;
export const selectCurrentStreak = (state) => state.incentives?.currentStreak || 0;
export const selectBestStreak = (state) => state.incentives?.bestStreak || 0;
export const selectIncentiveBadges = (state) => state.incentives?.incentiveBadges || [];
export const selectIsIncentivesLoading = (state) => state.incentives?.isLoading || false;
export const selectIsCreatingIncentive = (state) => state.incentives?.isCreating || false;
export const selectIsUpdatingIncentive = (state) => state.incentives?.isUpdating || false;
export const selectIsDeletingIncentive = (state) => state.incentives?.isDeleting || false;
export const selectIsCalculatingIncentive = (state) => state.incentives?.isCalculating || false;
export const selectIsProcessingIncentive = (state) => state.incentives?.isProcessing || false;
export const selectIncentivesError = (state) => state.incentives?.error;
export const selectIncentivesSuccess = (state) => state.incentives?.successMessage;

export default incentivesSlice.reducer;