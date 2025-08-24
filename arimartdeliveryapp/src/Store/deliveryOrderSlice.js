import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
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
      console.log(data)
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
      // Update the fetchActiveDeliveries.fulfilled case in deliverySlice
      .addCase(fetchActiveDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;

        // Map the API response to match component expectations
        const apiResponse = action.payload;

        if (apiResponse.deliveries && Array.isArray(apiResponse.deliveries)) {
          state.activeDeliveries = apiResponse.deliveries.map(delivery => ({
            // Basic order info
            trackId: delivery.trackId,
            id: delivery.id,
            orderDate: delivery.orderDate,
            qty: delivery.qty,
            deliveryprice: delivery.deliveryprice,
            totalAmount: delivery.totalAmount,
            paymentMethod: delivery.paymentMethod,

            // Status and timing
            status: delivery.status,
            pickedUpTime: delivery.pickedUpTime,
            shippedTime: delivery.shippedTime,
            estimatedDeliveryTime: delivery.estimatedDeliveryTime,

            // Customer info
            customer: delivery.customer,
            customerName: delivery.customer?.name || 'Unknown Customer',
            customerPhone: delivery.customer?.phone || 'N/A',
            customerRating: delivery.customerRating,

            // Address info
            shippingAddress: delivery.shippingAddress,
            deliveryAddress: delivery.shippingAddress?.fullAddress,
            deliveryLocation: {
              latitude: delivery.shippingAddress?.latitude || 0,
              longitude: delivery.shippingAddress?.longitude || 0,
              address: delivery.shippingAddress?.fullAddress
            },

            // Product info
            product: delivery.product,

            // Delivery info
            deliveryInfo: delivery.deliveryInfo,
            estimatedDistance: delivery.deliveryInfo?.estimatedDistance,

            // Additional fields
            specialInstructions: delivery.specialInstructions,
            deliveryNotes: delivery.deliveryNotes,
            isFragile: delivery.isFragile,
            isCOD: delivery.isCOD,

            // Meta info
            scannedAt: new Date().toLocaleString(), // or use actual scan time if available
            assignedBy: 'System Assigned'
          }));
        } else {
          state.activeDeliveries = [];
        }

        // Update stats from summary
        if (apiResponse.summary) {
          state.stats = {
            totalDelivered: state.stats.totalDelivered, // Keep existing delivered count
            totalPending: apiResponse.summary.totalActiveDeliveries || 0,
            todayDeliveries: state.stats.todayDeliveries, // Keep existing today count
            earnings: apiResponse.summary.totalRevenue || 0
          };
        }

        // Set completed deliveries as empty for now (they come from a different endpoint)
        if (!state.completedDeliveries.length) {
          state.completedDeliveries = [];
        }
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
export const selectDeliveryPartner = (state) => state.delivery?.partnerInfo;
export const selectActiveDeliveries = createSelector(
  [(state) => state.deliveryorder],
  (delivery) => delivery?.activeDeliveries || []
);

export const selectCompletedDeliveries = createSelector(
  [(state) => state.deliveryorder],
  (delivery) => delivery?.completedDeliveries || []
);

export const selectDeliveryStats = createSelector(
  [(state) => state.deliveryorder],
  (delivery) => delivery?.stats || { totalDelivered: 0, totalPending: 0, todayDeliveries: 0, earnings: 0 }
);
export const selectCurrentOrder = (state) => state.delivery?.currentOrder;
export const selectScanResult = (state) => state.delivery?.scanResult;
export const selectDeliveryRoute = (state) => state.delivery?.deliveryRoute;
export const selectIsLoading = (state) => state.delivery?.isLoading || false;
export const selectError = (state) => state.delivery?.error;
export const selectSuccessMessage = (state) => state.delivery?.successMessage;
export const selectCurrentLocation = (state) => state.delivery?.currentLocation;
export const selectIsLocationTracking = (state) => state.delivery?.isLocationTracking || false;


export default deliverySlice.reducer;