import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productsReducer from './productsSlice';
import productDetailReducer from './productDetailSlice';
import walletReducer from './walletSlice';
import wishlistReducer from './wishlistSlice';
import ratingReducer from './ratingSlice';
import searchReducer from './searchSlice'
import referEarnReducer from './referEarnSlice'
import documentUploadReducer from './documentUploadSlice'
import notificationReducer from "./notificationSlice";
import shippingReducer from './addressSlice'
import deliveryUserDetailsReducer from './deliveryUserDetailsSlice';
import deliveryorderReducer from '././deliveryOrderSlice';
import deliveryWalletReducer from '././deliveryWalletSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    productDetail: productDetailReducer,
    notifications: notificationReducer,
    shipping : shippingReducer,
    documentUpload : documentUploadReducer,
    deliveryorder : deliveryorderReducer,
    deliveryUserDetails: deliveryUserDetailsReducer,
    deliveryWallet: deliveryWalletReducer,
    referEarn : referEarnReducer,
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