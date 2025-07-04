import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async () => {
    const response = await API.get('/category');
    return response.data;
  }
);

// Fetch subcategories based on category ID
export const fetchSubcategories = createAsyncThunk(
  'category/fetchSubcategories',
  async (categoryId) => {
    const response = await API.get(`/subcategory/by-category/${categoryId}`);
    return response.data;
  }
);

// Fetch child subcategories based on subcategory ID
export const fetchChildSubcategories = createAsyncThunk(
  'category/fetchChildSubcategories',
  async (subCategoryId) => {
    const response = await API.get(`/childsubcategory/by-subcategory/${subCategoryId}`);
    return { subCategoryId, data: response.data };
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    subcategories: [],
    childSubcategoriesMap: {}, // Store child subcategories by subcategory ID
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubcategories.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchChildSubcategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChildSubcategories.fulfilled, (state, action) => {
        const { subCategoryId, data } = action.payload;
        state.childSubcategoriesMap[subCategoryId] = data;
        state.loading = false;
      })
      .addCase(fetchChildSubcategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;