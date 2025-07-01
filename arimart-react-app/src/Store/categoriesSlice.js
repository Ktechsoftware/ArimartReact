// categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const response = await API.get('/category');
  return response.data;
});

export const fetchSubcategories = createAsyncThunk('category/fetchSubcategories', async (categoryId) => {
  const response = await API.get(`/subcategory/by-category/${categoryId}`);
  return response.data;
});

export const fetchChildSubcategories = createAsyncThunk('category/fetchChildSubcategories', async (subCategoryId) => {
  const response = await API.get(`/category/child-subcategories/${subCategoryId}`);
  return response.data;
});

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    subcategories: [],
    childSubcategories: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
      })
      .addCase(fetchChildSubcategories.fulfilled, (state, action) => {
        state.childSubcategories = action.payload;
      });
  },
});

export default categorySlice.reducer;
