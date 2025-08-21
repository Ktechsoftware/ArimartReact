import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Async Thunks for API calls
export const saveEmergencyDetails = createAsyncThunk(
  'deliveryUserDetails/saveEmergencyDetails',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/deliveryuserdetails/emergency-details/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saveBankDetails = createAsyncThunk(
  'deliveryUserDetails/saveBankDetails',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/deliveryuserdetails/bank-details/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saveVehicleDetails = createAsyncThunk(
  'deliveryUserDetails/saveVehicleDetails',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/deliveryuserdetails/vehicle-details/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getUserDetailsStatus = createAsyncThunk(
  'deliveryUserDetails/getUserDetailsStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/deliveryuserdetails/status/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getEmergencyDetails = createAsyncThunk(
  'deliveryUserDetails/getEmergencyDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/deliveryuserdetails/emergency-details/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getBankDetails = createAsyncThunk(
  'deliveryUserDetails/getBankDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/deliveryuserdetails/bank-details/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getVehicleDetails = createAsyncThunk(
  'deliveryUserDetails/getVehicleDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/deliveryuserdetails/vehicle-details/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Initial State
const initialState = {
  // Loading states
  loading: {
    emergencyDetails: false,
    bankDetails: false,
    vehicleDetails: false,
    userStatus: false,
  },
  
  // Error states
  errors: {
    emergencyDetails: null,
    bankDetails: null,
    vehicleDetails: null,
    userStatus: null,
  },

  // Success messages
  successMessages: {
    emergencyDetails: null,
    bankDetails: null,
    vehicleDetails: null,
  },

  // User completion status
  userStatus: {
    userId: null,
    currentStep: 1,
    personalInfoComplete: false,
    documentsUploaded: false,
    emergencyDetailsComplete: false,
    bankDetailsComplete: false,
    vehicleDetailsComplete: false,
    profileComplete: false,
    registrationStatus: 'pending'
  },

  // Form data
  emergencyDetails: {
    primaryContactName: '',
    primaryContactPhone: '',
    primaryContactRelation: '',
    secondaryContactName: '',
    secondaryContactPhone: '',
    secondaryContactRelation: '',
    medicalConditions: '',
    allergies: '',
    bloodGroup: '',
    emergencyAddress: ''
  },

  bankDetails: {
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: '',
    upiId: ''
  },

  vehicleDetails: {
    vehicleType: '',
    vehicleNumber: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    registrationDate: '',
    insuranceNumber: '',
    drivingLicense: ''
  }
};

// Redux Slice
const deliveryUserDetailsSlice = createSlice({
  name: 'deliveryUserDetails',
  initialState,
  reducers: {
    // Local form data updates
    updateEmergencyDetails: (state, action) => {
      state.emergencyDetails = { ...state.emergencyDetails, ...action.payload };
    },
    
    updateBankDetails: (state, action) => {
      state.bankDetails = { ...state.bankDetails, ...action.payload };
    },
    
    updateVehicleDetails: (state, action) => {
      state.vehicleDetails = { ...state.vehicleDetails, ...action.payload };
    },

    // Clear error messages
    clearError: (state, action) => {
      const { section } = action.payload;
      if (state.errors[section]) {
        state.errors[section] = null;
      }
    },

    // Clear success messages
    clearSuccessMessage: (state, action) => {
      const { section } = action.payload;
      if (state.successMessages[section]) {
        state.successMessages[section] = null;
      }
    },

    // Reset form data
    resetEmergencyDetails: (state) => {
      state.emergencyDetails = initialState.emergencyDetails;
    },

    resetBankDetails: (state) => {
      state.bankDetails = initialState.bankDetails;
    },

    resetVehicleDetails: (state) => {
      state.vehicleDetails = initialState.vehicleDetails;
    }
  },
  
  extraReducers: (builder) => {
    // Save Emergency Details
    builder
      .addCase(saveEmergencyDetails.pending, (state) => {
        state.loading.emergencyDetails = true;
        state.errors.emergencyDetails = null;
      })
      .addCase(saveEmergencyDetails.fulfilled, (state, action) => {
        state.loading.emergencyDetails = false;
        state.successMessages.emergencyDetails = action.payload.message;
        state.userStatus.emergencyDetailsComplete = true;
        if (action.payload.data?.currentStep) {
          state.userStatus.currentStep = action.payload.data.currentStep;
        }
      })
      .addCase(saveEmergencyDetails.rejected, (state, action) => {
        state.loading.emergencyDetails = false;
        state.errors.emergencyDetails = action.payload;
      });

    // Save Bank Details
    builder
      .addCase(saveBankDetails.pending, (state) => {
        state.loading.bankDetails = true;
        state.errors.bankDetails = null;
      })
      .addCase(saveBankDetails.fulfilled, (state, action) => {
        state.loading.bankDetails = false;
        state.successMessages.bankDetails = action.payload.message;
        state.userStatus.bankDetailsComplete = true;
        if (action.payload.data?.currentStep) {
          state.userStatus.currentStep = action.payload.data.currentStep;
        }
      })
      .addCase(saveBankDetails.rejected, (state, action) => {
        state.loading.bankDetails = false;
        state.errors.bankDetails = action.payload;
      });

    // Save Vehicle Details
    builder
      .addCase(saveVehicleDetails.pending, (state) => {
        state.loading.vehicleDetails = true;
        state.errors.vehicleDetails = null;
      })
      .addCase(saveVehicleDetails.fulfilled, (state, action) => {
        state.loading.vehicleDetails = false;
        state.successMessages.vehicleDetails = action.payload.message;
        state.userStatus.vehicleDetailsComplete = true;
        if (action.payload.data?.currentStep) {
          state.userStatus.currentStep = action.payload.data.currentStep;
        }
      })
      .addCase(saveVehicleDetails.rejected, (state, action) => {
        state.loading.vehicleDetails = false;
        state.errors.vehicleDetails = action.payload;
      });

    // Get User Status
    builder
      .addCase(getUserDetailsStatus.pending, (state) => {
        state.loading.userStatus = true;
        state.errors.userStatus = null;
      })
      .addCase(getUserDetailsStatus.fulfilled, (state, action) => {
        state.loading.userStatus = false;
        state.userStatus = { ...state.userStatus, ...action.payload };
      })
      .addCase(getUserDetailsStatus.rejected, (state, action) => {
        state.loading.userStatus = false;
        state.errors.userStatus = action.payload;
      });

    // Get Emergency Details
    builder
      .addCase(getEmergencyDetails.fulfilled, (state, action) => {
        state.emergencyDetails = { ...state.emergencyDetails, ...action.payload };
      });

    // Get Bank Details
    builder
      .addCase(getBankDetails.fulfilled, (state, action) => {
        const { confirmAccountNumber, ...bankData } = action.payload;
        state.bankDetails = { 
          ...state.bankDetails, 
          ...bankData,
          confirmAccountNumber: action.payload.accountNumber // Set confirm to match account number
        };
      });

    // Get Vehicle Details
    builder
      .addCase(getVehicleDetails.fulfilled, (state, action) => {
        state.vehicleDetails = { ...state.vehicleDetails, ...action.payload };
      });
  }
});

// Export actions
export const {
  updateEmergencyDetails,
  updateBankDetails,
  updateVehicleDetails,
  clearError,
  clearSuccessMessage,
  resetEmergencyDetails,
  resetBankDetails,
  resetVehicleDetails
} = deliveryUserDetailsSlice.actions;

// Selectors
export const selectEmergencyDetails = (state) => state.deliveryUserDetails.emergencyDetails;
export const selectBankDetails = (state) => state.deliveryUserDetails.bankDetails;
export const selectVehicleDetails = (state) => state.deliveryUserDetails.vehicleDetails;
export const selectUserStatus = (state) => state.deliveryUserDetails.userStatus;
export const selectLoading = (state) => state.deliveryUserDetails.loading;
export const selectErrors = (state) => state.deliveryUserDetails.errors;
export const selectSuccessMessages = (state) => state.deliveryUserDetails.successMessages;

// Export reducer
export default deliveryUserDetailsSlice.reducer;