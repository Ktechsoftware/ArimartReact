import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { getUserInfo } from '../api/auth'

const COOKIE_NAME = 'userLoginDataArimart';

const getUserFromCookie = () => {
  try {
    const cookie = Cookies.get(COOKIE_NAME);
    return cookie ? JSON.parse(cookie) : null;
  } catch (error) {
    console.error('Invalid user cookie:', error);
    return null;
  }
};

const initialUser = getUserFromCookie();

const initialState = {
  isAuthenticated: !!initialUser,
  userData: initialUser,
  // Optionally, add loading/error
  loading: false,
  error: null,
};

// Async thunk to fetch and refresh user info
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
    // Optionally, allow updating user in state and cookie
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
        // Also update cookie so next reload is up to date
        Cookies.set(COOKIE_NAME, JSON.stringify(action.payload), { expires: 7 });
      })
      .addCase(refreshUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { checkAuth, login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;