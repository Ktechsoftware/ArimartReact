import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { productReducer } from '../reducers/productReducer';
import categoryReducer from './categoriesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products : productReducer,
    category : categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
