import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// ✅ Search products with suggestions
export const searchProducts = createAsyncThunk(
  'search/searchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `products/search${queryString ? `?${queryString}` : ''}`;
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Load more search results
export const loadMoreSearchResults = createAsyncThunk(
  'search/loadMoreSearchResults',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { search } = getState();
      const nextPage = search.pagination.page + 1;
      const queryParams = { ...params, page: nextPage };
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `products/search${queryString ? `?${queryString}` : ''}`;
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Get autocomplete suggestions
export const getAutocompleteSuggestions = createAsyncThunk(
  'search/getAutocompleteSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      if (!query || query.length < 2) {
        return [];
      }
      const response = await API.get(`products/autocomplete?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    // Search Results
    results: [],
    suggestions: [],
    loading: false,
    loadingMore: false,
    error: null,
    
    // Autocomplete
    autocompleteSuggestions: [],
    autocompleteLoading: false,
    autocompleteError: null,
    
    // Current Search
    currentQuery: '',
    lastSearchQuery: '',
    
    // Pagination
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    
    // Search Options
    searchOptions: {
      showAll: false,
      includeSuggestions: true,
    },
    
    // UI State
    hasMore: true,
    isDropdownOpen: false,
  },
  reducers: {
    setCurrentQuery: (state, action) => {
      state.currentQuery = action.payload;
    },
    clearCurrentQuery: (state) => {
      state.currentQuery = '';
    },
    setSearchOptions: (state, action) => {
      state.searchOptions = { ...state.searchOptions, ...action.payload };
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.suggestions = [];
      state.pagination = {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      state.hasMore = true;
      state.lastSearchQuery = '';
    },
    clearAutocompleteSuggestions: (state) => {
      state.autocompleteSuggestions = [];
    },
    clearSearchError: (state) => {
      state.error = null;
      state.autocompleteError = null;
    },
    resetSearch: (state) => {
      state.results = [];
      state.suggestions = [];
      state.autocompleteSuggestions = [];
      state.currentQuery = '';
      state.lastSearchQuery = '';
      state.pagination = {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      state.hasMore = true;
      state.error = null;
      state.autocompleteError = null;
    },
    setDropdownOpen: (state, action) => {
      state.isDropdownOpen = action.payload;
    },
    // Add a suggestion to recent searches or similar
    addToRecentSearches: (state, action) => {
      // Implementation for storing recent searches
      // This could be enhanced to maintain a list of recent queries
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.products || [];
        state.suggestions = action.payload.suggestions || [];
        state.lastSearchQuery = action.payload.searchQuery || '';
        
        // Update pagination
        state.pagination = {
          page: action.payload.currentPage || 1,
          pageSize: action.payload.pageSize || 10,
          totalCount: action.payload.totalCount || 0,
          totalPages: action.payload.totalPages || 0,
          hasNextPage: action.payload.hasNextPage || false,
          hasPreviousPage: action.payload.hasPreviousPage || false,
        };
        
        state.hasMore = action.payload.hasNextPage || false;
        state.searchOptions.showAll = action.payload.showAll || false;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Load More Search Results
      .addCase(loadMoreSearchResults.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreSearchResults.fulfilled, (state, action) => {
        state.loadingMore = false;
        const newResults = action.payload.products || [];
        state.results = [...state.results, ...newResults];
        
        // Update pagination
        state.pagination = {
          page: action.payload.currentPage || state.pagination.page,
          pageSize: action.payload.pageSize || state.pagination.pageSize,
          totalCount: action.payload.totalCount || state.pagination.totalCount,
          totalPages: action.payload.totalPages || state.pagination.totalPages,
          hasNextPage: action.payload.hasNextPage || false,
          hasPreviousPage: action.payload.hasPreviousPage || false,
        };
        
        state.hasMore = action.payload.hasNextPage || false;
      })
      .addCase(loadMoreSearchResults.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload;
      })

      // 🔄 Autocomplete Suggestions
      .addCase(getAutocompleteSuggestions.pending, (state) => {
        state.autocompleteLoading = true;
        state.autocompleteError = null;
      })
      .addCase(getAutocompleteSuggestions.fulfilled, (state, action) => {
        state.autocompleteLoading = false;
        state.autocompleteSuggestions = action.payload || [];
      })
      .addCase(getAutocompleteSuggestions.rejected, (state, action) => {
        state.autocompleteLoading = false;
        state.autocompleteError = action.payload;
      });
  },
});

export const {
  setCurrentQuery,
  clearCurrentQuery,
  setSearchOptions,
  clearSearchResults,
  clearAutocompleteSuggestions,
  clearSearchError,
  resetSearch,
  setDropdownOpen,
  addToRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;