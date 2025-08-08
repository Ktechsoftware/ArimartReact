// src/Store/filterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  async (query, { rejectWithValue }) => {
    try {
      const res = await API.get(`/Products/filters?query=${query}`);
      console.log(res.data)
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await API.post('/products/search/filtered', {
        query: params.query || '',
        page: 1,
        pageSize: 12,
        priceMin: params.minPrice ? parseFloat(params.minPrice) : undefined,
        priceMax: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
        showAll: false,
        includeSuggestions: true,
        // Add other filters like discountRanges, categoryIds etc. here as needed
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    data: {},
    selectedFilters: {},
    loading: false,
    error: null,
  },
  reducers: {
    toggleFilter: (state, action) => {
      const { category, value } = action.payload;
      if (!state.selectedFilters[category]) {
        state.selectedFilters[category] = [value];
      } else {
        const exists = state.selectedFilters[category].includes(value);
        state.selectedFilters[category] = exists
          ? state.selectedFilters[category].filter((v) => v !== value)
          : [...state.selectedFilters[category], value];
      }
    },
    clearAllFilters: (state) => {
      state.selectedFilters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleFilter, clearAllFilters } = filterSlice.actions;
export default filterSlice.reducer;
