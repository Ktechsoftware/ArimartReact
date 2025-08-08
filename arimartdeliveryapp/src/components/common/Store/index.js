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
import ratingReducer from './ratingSlice';
import searchReducer from './searchSlice'
import filterReducer from './filterSlice'
import topOrdersReducer from './Tops/topOrdersSlice'
import notificationReducer from "./notificationSlice";
import popularProductsReducer from './PopularSlice/popularProductsSlice'
import referalReducer from './referralSlice'
import shippingReducer from './addressSlice'
import promocodeReducer from './promocodeSlice'
import analyticsReducer from './analyticsSlice'
import topProductsReducer from './Tops/topProductsSlice'

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
    shipping : shippingReducer,
    referral : referalReducer,
    search : searchReducer,
    wallet: walletReducer,
    topOrders : topOrdersReducer,
    filters : filterReducer,
    wishlist: wishlistReducer,
    group: groupReducer,
    rating: ratingReducer,
    promocode: promocodeReducer,
    analytics : analyticsReducer,
    topProducts : topProductsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
});

export default store;