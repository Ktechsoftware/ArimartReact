import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { getUserInfo, updateUserInfo } from '../api/auth';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x';
import API from '../api';

const COOKIE_NAME = 'userLoginDataArimart';

export const getUserFromCookie = () => {
  try {
    const cookie = Cookies.get(COOKIE_NAME);
    return cookie ? JSON.parse(cookie) : null;
  } catch (error) {
    console.error('Invalid user cookie:', error);
    return null;
  }
};

export const updateUserInfoAsync = createAsyncThunk(
  'auth/updateUserInfo',
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateUserInfo(userId, updatedData);
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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

const initialUser = getUserFromCookie();

const initialState = {
  isAuthenticated: !!initialUser,
  userData: initialUser,
  loading: false,
  error: null,
};

export const refreshUserInfo = createAsyncThunk(
  'auth/refreshUserInfo',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getUserInfo(userId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkAuth: (state) => {
      const user = getUserFromCookie();
      state.isAuthenticated = !!user;
      state.userData = user;
    },
    login: (state, action) => {
      const user = action.payload;
      Cookies.set(COOKIE_NAME, JSON.stringify(user), { expires: 7 });
      state.isAuthenticated = true;
      state.userData = user;
    },
    logout: (state) => {
      Cookies.remove(COOKIE_NAME);
      localStorage.removeItem('user_cart');
      state.isAuthenticated = false;
      state.userData = null;
    },
    updateUser: (state, action) => {
      const user = action.payload;
      Cookies.set(COOKIE_NAME, JSON.stringify(user), { expires: 7 });
      state.userData = user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        Cookies.set(COOKIE_NAME, JSON.stringify(action.payload), { expires: 7 });
      })
      .addCase(refreshUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        Cookies.set(COOKIE_NAME, JSON.stringify(action.payload), { expires: 7 });
      })
      .addCase(updateUserInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { checkAuth, login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
