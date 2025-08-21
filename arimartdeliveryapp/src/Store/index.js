import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productsReducer from './productsSlice';
import productDetailReducer from './productDetailSlice';
import walletReducer from './walletSlice';
import wishlistReducer from './wishlistSlice';
import ratingReducer from './ratingSlice';
import searchReducer from './searchSlice'
import documentUploadReducer from './documentUploadSlice'
import notificationReducer from "./notificationSlice";
import referalReducer from './referralSlice'
import shippingReducer from './addressSlice'
import deliveryUserDetailsReducer from './deliveryUserDetailsSlice';
import deliveryorderReducer from '././deliveryOrderSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    productDetail: productDetailReducer,
    notifications: notificationReducer,
    shipping : shippingReducer,
    documentUpload : documentUploadReducer,
    deliveryorder : deliveryorderReducer,
    deliveryUserDetails: deliveryUserDetailsReducer,
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