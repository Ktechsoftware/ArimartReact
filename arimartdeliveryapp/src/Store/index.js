import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productsReducer from './productsSlice';
import productDetailReducer from './productDetailSlice';
import orderReducer from './orderSlice';
import walletReducer from './walletSlice';
import wishlistReducer from './wishlistSlice';
import ratingReducer from './ratingSlice';
import searchReducer from './searchSlice'
import notificationReducer from "./notificationSlice";
import referalReducer from './referralSlice'
import shippingReducer from './addressSlice'

const store = configureStore({
  reducer: {
    products: productsReducer,
    order: orderReducer,
    productDetail: productDetailReducer,
    notifications: notificationReducer,
    shipping : shippingReducer,
    referral : referalReducer,
    search : searchReducer,
    wallet: walletReducer,
    wishlist: wishlistReducer,
    rating: ratingReducer,
    deliveryAuth : authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
});

export default store;