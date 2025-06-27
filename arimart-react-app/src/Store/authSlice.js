import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  isAuthenticated: !!Cookies.get('userLoginDataArimart'),
  userData: Cookies.get('userLoginDataArimart') 
    ? JSON.parse(Cookies.get('userLoginDataArimart'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkAuth: (state) => {
      const cookie = Cookies.get('userLoginDataArimart');
      if (cookie) {
        state.isAuthenticated = true;
        state.userData = JSON.parse(cookie);
      } else {
        state.isAuthenticated = false;
        state.userData = null;
      }
    },
    logout: (state) => {
      Cookies.remove('userLoginDataArimart');
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { checkAuth, logout } = authSlice.actions;
export default authSlice.reducer;
