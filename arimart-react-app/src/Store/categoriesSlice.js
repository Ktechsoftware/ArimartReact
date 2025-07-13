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
    console.log("child category : ", response.data);
    return response.data;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    subcategories: [],
    childSubcategories: [],
    childSubcategoriesMap: {},
    loadingCategories: false,
    loadingSubcategories: false,
    loadingChildSubcategories: false,
    error: null,
  },

  reducers: {
    // Clear subcategories when category changes
    clearSubcategories: (state) => {
      state.subcategories = [];
      state.childSubcategories = [];
    },
    // Clear child subcategories when subcategory changes
    clearChildSubcategories: (state) => {
      state.childSubcategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loadingCategories = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.error = action.error.message;
      })

      // Fetch Subcategories
      .addCase(fetchSubcategories.pending, (state) => {
        state.loadingSubcategories = true;
        state.error = null;
        state.childSubcategories = [];
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
        state.loadingSubcategories = false;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loadingSubcategories = false;
        state.error = action.error.message;
      })

      // Fetch Child Subcategories
      .addCase(fetchChildSubcategories.pending, (state) => {
        state.loadingChildSubcategories = true;
        state.error = null;
      })
      .addCase(fetchChildSubcategories.fulfilled, (state, action) => {
        state.childSubcategories = action.payload;
        state.loadingChildSubcategories = false;
      })
      .addCase(fetchChildSubcategories.rejected, (state, action) => {
        state.loadingChildSubcategories = false;
        state.error = action.error.message;
      });

  },
});

export const { clearSubcategories, clearChildSubcategories } = categorySlice.actions;
export default categorySlice.reducer;