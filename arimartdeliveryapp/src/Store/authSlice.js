import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import API from '../api';

const DELIVERY_COOKIE_NAME = 'DeliveryPartnerDataArimart';
const TOKEN_COOKIE_NAME = 'DeliveryPartnerTokenArimart';

// Get delivery user from cookie
export const getDeliveryUserFromCookie = () => {
  try {
    const cookie = Cookies.get(DELIVERY_COOKIE_NAME);
    return cookie ? JSON.parse(cookie) : null;
  } catch (error) {
    console.error('Invalid delivery user cookie:', error);
    return null;
  }
};

// Send OTP
export const sendOtpAsync = createAsyncThunk(
  'deliveryAuth/sendOtp',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/send-otp', { 
        mobileNumber: phoneNumber 
      });
      return { phoneNumber, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// Verify OTP and Login/Check Registration Status
export const verifyOtpAsync = createAsyncThunk(
  'deliveryAuth/verifyOtp',
  async ({ phoneNumber, otp }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/login', {
        mobileNumber: phoneNumber,
        otp: otp
      });
      
      // If user exists, return user data with completion status
      return {
        user: response.data.user,
        token: response.data.token,
        isExistingUser: true
      };
    } catch (err) {
      if (err.response?.data?.requiresRegistration) {
        return {
          isExistingUser: false,
          phoneNumber: phoneNumber
        };
      }
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

export const sendFcmTokenToBackend = createAsyncThunk(
  'auth/sendFcmTokenToBackend',
  async (userId, { rejectWithValue }) => {
    try {
      if (window.cordova && userId) {
        const fcmToken = await FirebaseX.getToken();
        if (fcmToken) {
          await API.post('/user/save-token', {
            userId,
            fToken: fcmToken,
            deviceType: 'android',
          });
        }
      }
    } catch (error) {
      console.error('Failed to send FCM token:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Complete Personal Information
export const completePersonalInfoAsync = createAsyncThunk(
  'deliveryAuth/completePersonalInfo',
  async (personalData, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/delivery-user/register', personalData);
      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Update User Info (for additional steps)
export const updateDeliveryUserAsync = createAsyncThunk(
  'deliveryAuth/updateUser',
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/auth/delivery-user/update/${userId}`, updateData);
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// Upload Documents
export const uploadDocumentAsync = createAsyncThunk(
  'deliveryAuth/uploadDocument',
  async ({ userId, documentType, fileData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('documentType', documentType);
      formData.append('file', fileData);
      
      const response = await API.post('/auth/delivery-user/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Document upload failed');
    }
  }
);

// Get User Status/Info
export const getDeliveryUserInfoAsync = createAsyncThunk(
  'deliveryAuth/getUserInfo',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/auth/delivery-user/user-info/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user info');
    }
  }
);

const initialUser = getDeliveryUserFromCookie();
const initialToken = Cookies.get(TOKEN_COOKIE_NAME);

const initialState = {
  // Auth State
  isAuthenticated: !!initialUser && !!initialToken,
  user: initialUser,
  token: initialToken,
  
  // Registration Flow State
  currentPhoneNumber: null,
  isExistingUser: null,
  
  // Completion Status
  registrationStep: initialUser?.currentStep || 1, // 1=Personal, 2=Documents, 3=Upload, 4=Complete
  personalInfoComplete: initialUser?.personalInfoComplete || false,
  documentsUploaded: initialUser?.documentsUploaded || false,
  profileComplete: initialUser?.profileComplete || false,
  registrationStatus: initialUser?.registrationStatus || 'PENDING', // PENDING, APPROVED, REJECTED
  
  // UI State
  loading: false,
  error: null,
  otpSent: false,
};

const deliveryAuthSlice = createSlice({
  name: 'deliveryAuth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset OTP state
    resetOtpState: (state) => {
      state.otpSent = false;
      state.currentPhoneNumber = null;
    },
    
    // Set registration step
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },
    
    // Check auth from cookie
    checkAuth: (state) => {
      const user = getDeliveryUserFromCookie();
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      state.isAuthenticated = !!user && !!token;
      state.user = user;
      state.token = token;
      if (user) {
        state.registrationStep = user.currentStep || 1;
        state.personalInfoComplete = user.personalInfoComplete || false;
        state.documentsUploaded = user.documentsUploaded || false;
        state.profileComplete = user.profileComplete || false;
        state.registrationStatus = user.registrationStatus || 'PENDING';
      }
    },
    
    // Logout
    logout: (state) => {
      Cookies.remove(DELIVERY_COOKIE_NAME);
      Cookies.remove(TOKEN_COOKIE_NAME);
      return { ...initialState, isAuthenticated: false };
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.currentPhoneNumber = action.payload.phoneNumber;
      })
      .addCase(sendOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify OTP
      .addCase(verifyOtpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.isExistingUser) {
          // Existing user - set auth data
          const user = action.payload.user;
          state.isAuthenticated = true;
          state.user = user;
          state.token = action.payload.token;
          state.isExistingUser = true;
          
          // Set completion status
          state.registrationStep = user.currentStep || 1;
          state.personalInfoComplete = user.personalInfoComplete || false;
          state.documentsUploaded = user.documentsUploaded || false;
          state.profileComplete = user.profileComplete || false;
          state.registrationStatus = user.registrationStatus || 'PENDING';
          
          // Save to cookies
          Cookies.set(DELIVERY_COOKIE_NAME, JSON.stringify(user), { expires: 7 });
          Cookies.set(TOKEN_COOKIE_NAME, action.payload.token, { expires: 7 });
        } else {
          // New user - needs registration
          state.isExistingUser = false;
          state.currentPhoneNumber = action.payload.phoneNumber;
        }
      })
      .addCase(verifyOtpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Complete Personal Info
      .addCase(completePersonalInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completePersonalInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.personalInfoComplete = true;
        state.registrationStep = 2; // Move to documents step
        
        // Save to cookies
        Cookies.set(DELIVERY_COOKIE_NAME, JSON.stringify(action.payload.user), { expires: 7 });
        Cookies.set(TOKEN_COOKIE_NAME, action.payload.token, { expires: 7 });
      })
      .addCase(completePersonalInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update User
      .addCase(updateDeliveryUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeliveryUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        
        // Update completion status based on what was updated
        if (action.payload.documentsUploaded) {
          state.documentsUploaded = true;
          state.registrationStep = Math.max(state.registrationStep, 3);
        }
        if (action.payload.profileComplete) {
          state.profileComplete = true;
          state.registrationStep = 4;
        }
        
        // Update cookie
        Cookies.set(DELIVERY_COOKIE_NAME, JSON.stringify(state.user), { expires: 7 });
      })
      .addCase(updateDeliveryUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload Document
      .addCase(uploadDocumentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadDocumentAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update user data if needed
      })
      .addCase(uploadDocumentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get User Info
      .addCase(getDeliveryUserInfoAsync.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        Cookies.set(DELIVERY_COOKIE_NAME, JSON.stringify(state.user), { expires: 7 });
      });
  }
});

export const { 
  clearError, 
  resetOtpState, 
  setRegistrationStep, 
  checkAuth, 
  logout 
} = deliveryAuthSlice.actions;

export default deliveryAuthSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.deliveryAuth.isAuthenticated;
export const selectUser = (state) => state.deliveryAuth.user;
export const selectRegistrationStep = (state) => state.deliveryAuth.registrationStep;
export const selectIsRegistrationComplete = (state) => state.deliveryAuth.profileComplete;
export const selectRegistrationStatus = (state) => state.deliveryAuth.registrationStatus;