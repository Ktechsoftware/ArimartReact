import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

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
};

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
      localStorage.removeItem('user_cart'); // correct key
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
});

export const { checkAuth, login, logout } = authSlice.actions;
export default authSlice.reducer;
