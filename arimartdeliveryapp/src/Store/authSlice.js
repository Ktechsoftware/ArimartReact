import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import API from '../api';

const DELIVERY_COOKIE_NAME = 'DeliveryPartnerDataArimart';
const TOKEN_COOKIE_NAME = 'DeliveryPartnerTokenArimart';
const USERID_COOKIE_NAME = 'DeliveryPartnerUserIdArimart';

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

// Helper function to save user data to cookies
const saveUserToCookies = (user, token) => {
  const cookieOptions = { expires: 7 };
  Cookies.set(DELIVERY_COOKIE_NAME, JSON.stringify(user), cookieOptions);
  Cookies.set(TOKEN_COOKIE_NAME, token, cookieOptions);
  // Handle both 'id' and 'Id' fields from backend
  const userId = user.id || user.Id;
  if (userId) {
    Cookies.set(USERID_COOKIE_NAME, userId.toString(), cookieOptions);
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

// Verify OTP and Login - CORRECTED to use delivery-user login endpoint
export const verifyOtpAsync = createAsyncThunk(
  'deliveryAuth/verifyOtp',
  async ({ phoneNumber, otp }, { rejectWithValue }) => {
    try {
      const response = await API.post('/auth/delivery-user/login', {
        mobileNumber: phoneNumber,
        otp: otp
      });

      // If successful, user exists - return user data
      return {
        user: response.data.user,
        token: response.data.token,
        isExistingUser: true
      };
    } catch (err) {
      // Check if error indicates user needs registration
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

// Update User Info
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

// Complete Personal Info - Register new user
export const completePersonalInfoAsync = createAsyncThunk(
  'deliveryAuth/completePersonalInfo',
  async (personalData, { rejectWithValue, getState }) => {
    try {
      const { currentPhoneNumber } = getState().deliveryAuth;

      const requestData = {
        name: personalData.fullname,
        email: personalData.email,
        phone: currentPhoneNumber || personalData.primaryMobile, // Use the phone from OTP verification
        fatherName: personalData.fatherName,
        dateOfBirth: personalData.dateOfBirth,
        whatsappNumber: personalData.whatsappNumber,
        secondaryMobile: personalData.secondaryMobile,
        bloodGroup: personalData.bloodGroup,
        city: personalData.city,
        address: personalData.address,
        language: personalData.language,
        // Add other fields as needed
        vendorName: personalData.vendorName || '',
        state: personalData.state || '',
        postalCode: personalData.postalCode || '',
        companyName: personalData.companyName || '',
        businessCategory: personalData.businessCategory || null,
        businessLocation: personalData.businessLocation || '',
        bankName: personalData.bankName || '',
        accountNo: personalData.accountNo || '',
        ifsccode: personalData.ifsccode || '',
        refid: personalData.refid || null
      };

      const response = await API.post('/auth/delivery-user/register', requestData);

      return {
        user: response.data.deliveryuser, // Backend returns 'deliveryuser'
        token: response.data.token
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
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

// Get Registration Status
export const getRegistrationStatusAsync = createAsyncThunk(
  'deliveryAuth/getRegistrationStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/auth/delivery-user/registration-status/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch registration status');
    }
  }
);

const initialUser = getDeliveryUserFromCookie();
const initialToken = Cookies.get(TOKEN_COOKIE_NAME);
const initialUserId = Cookies.get(USERID_COOKIE_NAME);

const initialState = {
  // Auth State
  isAuthenticated: !!initialUser && !!initialToken,
  user: initialUser,
  token: initialToken,
  userId: initialUserId,

  // Registration Flow State
  currentPhoneNumber: null,
  isExistingUser: null,

  // Completion Status
  registrationStep: initialUser?.currentStep || 1,
  personalInfoComplete: initialUser?.personalInfoComplete || false,
  documentsUploaded: initialUser?.documentsUploaded || false,
  profileComplete: initialUser?.profileComplete || false,
  registrationStatus: initialUser?.registrationStatus || 'PENDING',

  // UI State
  loading: false,
  error: null,
  otpSent: false,
};

const deliveryAuthSlice = createSlice({
  name: 'deliveryAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    resetOtpState: (state) => {
      state.otpSent = false;
      state.currentPhoneNumber = null;
    },

    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload;
    },

    checkAuth: (state) => {
      const user = getDeliveryUserFromCookie();
      const token = Cookies.get(TOKEN_COOKIE_NAME);
      const userId = Cookies.get(USERID_COOKIE_NAME);
      
      state.isAuthenticated = !!user && !!token;
      state.user = user;
      state.token = token;
      state.userId = userId;
      
      if (user) {
        state.registrationStep = user.currentStep || 1;
        state.personalInfoComplete = user.personalInfoComplete || false;
        state.documentsUploaded = user.documentsUploaded || false;
        state.vehicledetail = user.vehicledetail || false;
        state.emergencycomplete = user.emergencycomplete || false;
        state.bankcomplete = user.bankcomplete || false;
        state.profileComplete = user.profileComplete || false;
        state.registrationStatus = user.registrationStatus || 'PENDING';
      }
    },

    logout: (state) => {
      Cookies.remove(DELIVERY_COOKIE_NAME);
      Cookies.remove(TOKEN_COOKIE_NAME);
      Cookies.remove(USERID_COOKIE_NAME);
      return { ...initialState, isAuthenticated: false, user: null, token: null, userId: null };
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
          const user = action.payload.user;
          state.isAuthenticated = true;
          state.user = user;
          state.token = action.payload.token;
          state.isExistingUser = true;
          state.userId = (user.id || user.Id)?.toString();

          // Set completion status from user data
          state.registrationStep = user.currentStep || 1;
          state.personalInfoComplete = user.personalInfoComplete || false;
          state.documentsUploaded = user.documentsUploaded || false;
          state.profileComplete = user.profileComplete || false;
          state.registrationStatus = user.registrationStatus || 'PENDING';

          // Save to cookies
          saveUserToCookies(user, action.payload.token);
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

      // Complete Personal Info (Registration)
      .addCase(completePersonalInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completePersonalInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;

        const user = action.payload.user;
        
        state.user = user;
        state.token = action.payload.token;
        state.userId = (user.id || user.Id)?.toString();
        
        // Update registration status
        state.personalInfoComplete = user.personalInfoComplete || true;
        state.documentsUploaded = user.documentsUploaded || false;
        state.emergencycomplete = user.emergencycomplete || false;
        state.bankcomplete = user.bankcomplete || false;
        state.vehicledetail = user.vehicledetail || false;
        state.registrationStep = user.currentStep || 2;
        state.registrationStatus = user.registrationStatus || 'PENDING';

        // Save to cookies
        saveUserToCookies(user, action.payload.token);
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
        const updatedUser = { ...state.user, ...action.payload };
        state.user = updatedUser;

        // Update completion status
        if (action.payload.documentsUploaded) {
          state.documentsUploaded = true;
          state.registrationStep = Math.max(state.registrationStep, 3);
        }
        if (action.payload.profileComplete) {
          state.profileComplete = true;
          state.registrationStep = 4;
        }

        // Update cookies
        saveUserToCookies(updatedUser, state.token);
      })
      .addCase(updateDeliveryUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Info
      .addCase(getDeliveryUserInfoAsync.fulfilled, (state, action) => {
        const updatedUser = { ...state.user, ...action.payload };
        state.user = updatedUser;
        
        // Update status fields
        state.registrationStep = action.payload.currentStep || state.registrationStep;
        state.personalInfoComplete = action.payload.personalInfoComplete || state.personalInfoComplete;
        state.vehicledetail = action.payload.vehicledetail || state.vehicledetail;
        state.emergencycomplete = action.payload.emergencycomplete || state.emergencycomplete;
        state.bankcomplete = action.payload.bankcomplete || state.bankcomplete;
        state.documentsUploaded = action.payload.documentsUploaded || state.documentsUploaded;
        state.profileComplete = action.payload.profileComplete || state.profileComplete;
        state.registrationStatus = action.payload.registrationStatus || state.registrationStatus;

        // Update cookies
        saveUserToCookies(updatedUser, state.token);
      })

      // Get Registration Status
      .addCase(getRegistrationStatusAsync.fulfilled, (state, action) => {
        state.registrationStatus = action.payload.registrationStatus;
        state.registrationStep = action.payload.currentStep;
        state.personalInfoComplete = action.payload.personalInfoComplete;
        state.emergencycomplete = action.payload.emergencycomplete;
        state.bankcomplete = action.payload.bankcomplete;
        state.vehicledetail = action.payload.vehicledetail;
        state.documentsUploaded = action.payload.documentsUploaded;
        state.profileComplete = action.payload.profileComplete;

        // Update user object with status
        if (state.user) {
          const updatedUser = {
            ...state.user,
            registrationStatus: action.payload.registrationStatus,
            currentStep: action.payload.currentStep,
            personalInfoComplete: action.payload.personalInfoComplete,
            bankcomplete: action.payload.bankcomplete,
            emergencycomplete: action.payload.emergencycomplete,
            vehicledetail: action.payload.vehicledetail,
            documentsUploaded: action.payload.documentsUploaded,
            profileComplete: action.payload.profileComplete,
            rejectRemark: action.payload.rejectRemark
          };
          state.user = updatedUser;
          saveUserToCookies(updatedUser, state.token);
        }
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
export const selectUserId = (state) => state.deliveryAuth.userId;
export const selectRegistrationStep = (state) => state.deliveryAuth.registrationStep;
export const selectIsRegistrationComplete = (state) => state.deliveryAuth.profileComplete;
export const selectRegistrationStatus = (state) => state.deliveryAuth.registrationStatus;