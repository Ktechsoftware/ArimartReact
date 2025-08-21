import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../api'

// Scan Order
export const scanOrderForDelivery = createAsyncThunk(
  "delivery/scanOrder",
  async ({ trackId, deliveryPartnerId }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/order/delivery/scan", {
        TrackId: trackId,
        DeliveryPartnerId: deliveryPartnerId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch Active Deliveries
export const fetchActiveDeliveries = createAsyncThunk(
  "delivery/fetchActive",
  async (deliveryPartnerId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/order/delivery/active/${deliveryPartnerId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Delivery Status
export const updateDeliveryStatus = createAsyncThunk(
  "delivery/updateStatus",
  async (statusData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/order/delivery/update-status", statusData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get Route
export const getDeliveryRoute = createAsyncThunk(
  "delivery/getRoute",
  async ({ trackId, deliveryPartnerId }, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/order/delivery/route/${trackId}?deliveryPartnerId=${deliveryPartnerId}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Location
export const updateLocation = createAsyncThunk(
  "delivery/updateLocation",
  async ({ deliveryPartnerId, latitude, longitude }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/order/delivery/location", {
        DeliveryPartnerId: deliveryPartnerId,
        Latitude: latitude,
        Longitude: longitude,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Initial State
const initialState = {
  // Current user/delivery partner info
  deliveryPartnerId: null,
  partnerInfo: null,
  
  // Orders
  assignedOrders: [],
  activeDeliveries: [],
  completedDeliveries: [],
  
  // Current scanning/delivery
  currentOrder: null,
  scanResult: null,
  deliveryRoute: null,
  
  // UI States
  isScanning: false,
  isLoading: false,
  error: null,
  successMessage: null,
  
  // Location tracking
  currentLocation: null,
  isLocationTracking: false,
  
  // Statistics
  stats: {
    totalDelivered: 0,
    totalPending: 0,
    todayDeliveries: 0,
    earnings: 0
  }
};

// Delivery Slice
const deliverySlice = createSlice({
  name: 'deliveryorder',
  initialState,
  reducers: {
    // Set delivery partner info
    setDeliveryPartner: (state, action) => {
      state.deliveryPartnerId = action.payload.id;
      state.partnerInfo = action.payload;
    },
    
    // Clear messages
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    
    // Set current location
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    
    // Toggle location tracking
    toggleLocationTracking: (state) => {
      state.isLocationTracking = !state.isLocationTracking;
    },
    
    // Manual order entry
    addManualOrder: (state, action) => {
      const { trackId, orderDetails } = action.payload;
      const newOrder = {
        trackId,
        ...orderDetails,
        status: 'Picked Up',
        scannedAt: new Date().toLocaleString(),
        assignedBy: 'Manual Entry'
      };
      state.activeDeliveries.push(newOrder);
      state.stats.totalPending += 1;
    },
    
    // Update order status locally
    updateOrderStatusLocal: (state, action) => {
      const { trackId, status } = action.payload;
      
      // Update in active deliveries
      const activeIndex = state.activeDeliveries.findIndex(order => order.trackId === trackId);
      if (activeIndex !== -1) {
        state.activeDeliveries[activeIndex].status = status;
        
        if (status === 'Delivered') {
          // Move to completed
          const completedOrder = { ...state.activeDeliveries[activeIndex] };
          completedOrder.deliveredAt = new Date().toLocaleString();
          state.completedDeliveries.push(completedOrder);
          state.activeDeliveries.splice(activeIndex, 1);
          
          // Update stats
          state.stats.totalDelivered += 1;
          state.stats.totalPending -= 1;
          state.stats.todayDeliveries += 1;
        }
      }
    },
    
    // Reset scan state
    resetScanState: (state) => {
      state.scanResult = null;
      state.currentOrder = null;
      state.isScanning = false;
    },
    
    // Set scanning state
    setScanningState: (state, action) => {
      state.isScanning = action.payload;
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Scan Order
      .addCase(scanOrderForDelivery.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(scanOrderForDelivery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scanResult = action.payload;
        state.currentOrder = action.payload.orderDetails;
        state.successMessage = action.payload.message;
        
        // Add to active deliveries
        if (action.payload.orderDetails) {
          const newDelivery = {
            ...action.payload.orderDetails,
            status: 'Picked Up',
            scannedAt: new Date().toLocaleString(),
            assignedBy: 'QR Scan'
          };
          state.activeDeliveries.push(newDelivery);
          state.stats.totalPending += 1;
        }
      })
      .addCase(scanOrderForDelivery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Active Deliveries
      .addCase(fetchActiveDeliveries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeDeliveries = action.payload.activeDeliveries || [];
        state.stats.totalPending = action.payload.count || 0;
      })
      .addCase(fetchActiveDeliveries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Delivery Status
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Delivery Route
      .addCase(getDeliveryRoute.fulfilled, (state, action) => {
        state.deliveryRoute = action.payload;
      })
      
      // Update Location
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.successMessage = action.payload.message;
      });
  }
});

// Export actions
export const {
  setDeliveryPartner,
  clearMessages,
  setCurrentLocation,
  toggleLocationTracking,
  addManualOrder,
  updateOrderStatusLocal,
  resetScanState,
  setScanningState
} = deliverySlice.actions;

// Selectors
export const selectDeliveryPartner = (state) => state.delivery?.partnerInfo || null;
export const selectActiveDeliveries = (state) => state.delivery?.activeDeliveries || [];
export const selectCompletedDeliveries = (state) => state.delivery?.completedDeliveries || [];
export const selectDeliveryStats = (state) => state.delivery?.stats || { totalDelivered: 0, totalPending: 0, todayDeliveries: 0, earnings: 0 };
export const selectCurrentOrder = (state) => state.delivery?.currentOrder || null;
export const selectScanResult = (state) => state.delivery?.scanResult || null;
export const selectDeliveryRoute = (state) => state.delivery?.deliveryRoute || null;
export const selectIsLoading = (state) => state.delivery?.isLoading || false;
export const selectError = (state) => state.delivery?.error || null;
export const selectSuccessMessage = (state) => state.delivery?.successMessage || null;
export const selectCurrentLocation = (state) => state.delivery?.currentLocation || null;
export const selectIsLocationTracking = (state) => state.delivery?.isLocationTracking || false;


export default deliverySlice.reducer;