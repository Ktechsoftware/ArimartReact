// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { productReducer } from '../reducers/productReducer';
import categoryReducer from './categoriesSlice';
import productDetailReducer from './productDetailSlice';
import orderReducer from './orderSlice';
import cartReducer from './cartSlice'; // Fixed import name
import walletReducer from './walletSlice';
import wishlistReducer from './wishlistSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    category: categoryReducer,
    order: orderReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    wallet: walletReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;