import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productsReducer from './productsSlice'; // ← Import your NEW slice
import categoryReducer from './categoriesSlice';
import productDetailReducer from './productDetailSlice';
import orderReducer from './orderSlice';
import cartReducer from './cartSlice';
import walletReducer from './walletSlice';
import wishlistReducer from './wishlistSlice';
import groupReducer from './groupBuySlice'; // �� Import your NEW slice
import ratingReducer, { ratingApi } from './ratingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer, // ← Use your NEW slice instead
    category: categoryReducer,
    order: orderReducer,
    productDetail: productDetailReducer,
    cart: cartReducer,
    wallet: walletReducer,
    wishlist: wishlistReducer,
    group: groupReducer,
    rating: ratingReducer,
    [ratingApi.reducerPath]: ratingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(ratingApi.middleware),
});

export default store;