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
import searchReducer from './searchSlice'
import filterReducer from './filterSlice'
import topOrdersReducer from './Tops/topOrdersSlice'
import notificationReducer from "./notificationSlice";
import popularProductsReducer from './PopularSlice/popularProductsSlice'
import referalReducer from './referralSlice'
import addressReducer from './addressSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    category: categoryReducer,
    order: orderReducer,
    productDetail: productDetailReducer,
    popularProducts: popularProductsReducer,
    notifications: notificationReducer,
    cart: cartReducer,
    address : addressReducer,
    referral : referalReducer,
    search : searchReducer,
    wallet: walletReducer,
    topOrders : topOrdersReducer,
    filters : filterReducer,
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