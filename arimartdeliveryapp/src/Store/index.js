import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Existing reducers
import authReducer from './authSlice';
import productsReducer from './productsSlice';
import productDetailReducer from './productDetailSlice';
import walletReducer from './walletSlice';
import wishlistReducer from './wishlistSlice';
import ratingReducer from './ratingSlice';
import searchReducer from './searchSlice';
import referEarnReducer from './referEarnSlice';
import documentUploadReducer from './documentUploadSlice';
import notificationReducer from "./notificationSlice";
import shippingReducer from './addressSlice';
import deliveryUserDetailsReducer from './deliveryUserDetailsSlice';
import deliveryorderReducer from './deliveryOrderSlice';
import deliveryWalletReducer from './deliveryWalletSlice';

// New delivery partner slices
import earningsReducer from './earningsSlice';
import shiftsReducer from './shiftsSlice';
import incentivesReducer from './incentivesSlice';

// Persist configurations for new slices
const earningsPersistConfig = {
  key: 'earnings',
  storage,
  blacklist: ['isLoading', 'isRecording', 'error', 'successMessage'] // Don't persist UI states
};

const shiftsPersistConfig = {
  key: 'shifts',
  storage,
  blacklist: ['isLoading', 'isStartingShift', 'isEndingShift', 'error', 'successMessage'] // Don't persist UI states
};

const incentivesPersistConfig = {
  key: 'incentives',
  storage,
  blacklist: ['isLoading', 'isCreating', 'isUpdating', 'isDeleting', 'isCalculating', 'isProcessing', 'error', 'successMessage'] // Don't persist UI states
};

// Main persist config for the entire store
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['earnings', 'shifts', 'incentives', 'deliveryAuth', 'deliveryWallet', 'deliveryUserDetails'], // Add slices you want to persist
  blacklist: ['deliveryorder', 'notifications', 'products', 'productDetail'] // Don't persist these (they're fetched fresh)
};

const store = configureStore({
  reducer: {
    // Existing reducers
    products: productsReducer,
    productDetail: productDetailReducer,
    notifications: notificationReducer,
    shipping: shippingReducer,
    documentUpload: documentUploadReducer,
    deliveryorder: deliveryorderReducer,
    deliveryUserDetails: deliveryUserDetailsReducer,
    deliveryWallet: deliveryWalletReducer,
    referEarn: referEarnReducer,
    search: searchReducer,
    wallet: walletReducer,
    wishlist: wishlistReducer,
    rating: ratingReducer,
    deliveryAuth: authReducer,
    
    // New delivery partner slices with persistence
    earnings: persistReducer(earningsPersistConfig, earningsReducer),
    shifts: persistReducer(shiftsPersistConfig, shiftsReducer),
    incentives: persistReducer(incentivesPersistConfig, incentivesReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

export default store;