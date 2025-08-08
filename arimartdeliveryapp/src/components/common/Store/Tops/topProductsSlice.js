import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

// ==========================
// 📦 Async Thunks for each price category
// ==========================

// Products under $9
export const fetchProductsUnder9 = createAsyncThunk(
  'topProducts/fetchProductsUnder9',
  async ({ limit = 10, page = 1 }, thunkAPI) => {
    try {
      const res = await API.get(`/Top/products/under-9?limit=${limit}`);
      return {
        data: res.data,
        page,
        limit,
        category: 9
      };
    } catch (err) {
      console.error('Failed to fetch products under $9:', err);
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch products under $9' });
    }
  }
);

// Products under $49
export const fetchProductsUnder49 = createAsyncThunk(
  'topProducts/fetchProductsUnder49',
  async ({ limit = 10, page = 1 }, thunkAPI) => {
    try {
      const res = await API.get(`/Top/products/under-49?limit=${limit}`);
      console.log("49rs products :",res.data)
      return {
        data: res.data,
        page,
        limit,
        category: 49
      };
    } catch (err) {
      console.error('Failed to fetch products under $49:', err);
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch products under $49' });
    }
  }
);

// Products under $99
export const fetchProductsUnder99 = createAsyncThunk(
  'topProducts/fetchProductsUnder99',
  async ({ limit = 10, page = 1 }, thunkAPI) => {
    try {
      const res = await API.get(`/Top/products/under-99?limit=${limit}`);
      return {
        data: res.data,
        page,
        limit,
        category: 99
      };
    } catch (err) {
      console.error('Failed to fetch products under $99:', err);
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch products under $99' });
    }
  }
);

// Products under $999
export const fetchProductsUnder999 = createAsyncThunk(
  'topProducts/fetchProductsUnder999',
  async ({ limit = 10, page = 1 }, thunkAPI) => {
    try {
      const res = await API.get(`/Top/products/under-999?limit=${limit}`);
      return {
        data: res.data,
        page,
        limit,
        category: 999
      };
    } catch (err) {
      console.error('Failed to fetch products under $999:', err);
      return thunkAPI.rejectWithValue(err.response?.data || { message: 'Failed to fetch products under $999' });
    }
  }
);

// ==========================
// 🧩 Initial State
// ==========================
const initialState = {
  under9: {
    products: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      limit: 10,
      totalItems: 0,
      hasMore: true
    }
  },
  under49: {
    products: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      limit: 10,
      totalItems: 0,
      hasMore: true
    }
  },
  under99: {
    products: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      limit: 10,
      totalItems: 0,
      hasMore: true
    }
  },
  under999: {
    products: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      limit: 10,
      totalItems: 0,
      hasMore: true
    }
  }
};

// ==========================
// 🧩 Top Products Slice
// ==========================
const topProductsSlice = createSlice({
  name: 'topProducts',
  initialState,
  reducers: {
    // Clear specific category
    clearProductsUnder9: (state) => {
      state.under9 = initialState.under9;
    },
    clearProductsUnder49: (state) => {
      state.under49 = initialState.under49;
    },
    clearProductsUnder99: (state) => {
      state.under99 = initialState.under99;
    },
    clearProductsUnder999: (state) => {
      state.under999 = initialState.under999;
    },
    
    // Clear all categories
    clearAllProducts: (state) => {
      return initialState;
    },
    
    // Reset pagination for specific category
    resetPaginationUnder9: (state) => {
      state.under9.pagination.currentPage = 1;
      state.under9.products = [];
      state.under9.pagination.hasMore = true;
    },
    resetPaginationUnder49: (state) => {
      state.under49.pagination.currentPage = 1;
      state.under49.products = [];
      state.under49.pagination.hasMore = true;
    },
    resetPaginationUnder99: (state) => {
      state.under99.pagination.currentPage = 1;
      state.under99.products = [];
      state.under99.pagination.hasMore = true;
    },
    resetPaginationUnder999: (state) => {
      state.under999.pagination.currentPage = 1;
      state.under999.products = [];
      state.under999.pagination.hasMore = true;
    },
    
    // Update pagination settings
    updatePaginationSettings: (state, action) => {
      const { category, limit } = action.payload;
      const categoryKey = `under${category}`;
      if (state[categoryKey]) {
        state[categoryKey].pagination.limit = limit;
        state[categoryKey].pagination.currentPage = 1;
        state[categoryKey].products = [];
        state[categoryKey].pagination.hasMore = true;
      }
    }
  },
  extraReducers: (builder) => {
    // Products Under $9
    builder
      .addCase(fetchProductsUnder9.pending, (state) => {
        state.under9.loading = true;
        state.under9.error = null;
      })
      .addCase(fetchProductsUnder9.fulfilled, (state, action) => {
        const { data, page, limit } = action.payload;
        state.under9.loading = false;
        
        if (page === 1) {
          state.under9.products = Array.isArray(data) ? data : [];
        } else {
          state.under9.products = [...state.under9.products, ...(Array.isArray(data) ? data : [])];
        }
        
        state.under9.pagination.currentPage = page;
        state.under9.pagination.limit = limit;
        state.under9.pagination.totalItems = state.under9.products.length;
        state.under9.pagination.hasMore = Array.isArray(data) ? data.length === limit : false;
      })
      .addCase(fetchProductsUnder9.rejected, (state, action) => {
        state.under9.loading = false;
        state.under9.error = action.payload?.message || 'Failed to fetch products under $9';
      })

    // Products Under $49
      .addCase(fetchProductsUnder49.pending, (state) => {
        state.under49.loading = true;
        state.under49.error = null;
      })
      .addCase(fetchProductsUnder49.fulfilled, (state, action) => {
        const { data, page, limit } = action.payload;
        state.under49.loading = false;
        
        if (page === 1) {
          state.under49.products = Array.isArray(data) ? data : [];
        } else {
          state.under49.products = [...state.under49.products, ...(Array.isArray(data) ? data : [])];
        }
        
        state.under49.pagination.currentPage = page;
        state.under49.pagination.limit = limit;
        state.under49.pagination.totalItems = state.under49.products.length;
        state.under49.pagination.hasMore = Array.isArray(data) ? data.length === limit : false;
      })
      .addCase(fetchProductsUnder49.rejected, (state, action) => {
        state.under49.loading = false;
        state.under49.error = action.payload?.message || 'Failed to fetch products under $49';
      })

    // Products Under $99
      .addCase(fetchProductsUnder99.pending, (state) => {
        state.under99.loading = true;
        state.under99.error = null;
      })
      .addCase(fetchProductsUnder99.fulfilled, (state, action) => {
        const { data, page, limit } = action.payload;
        state.under99.loading = false;
        
        if (page === 1) {
          state.under99.products = Array.isArray(data) ? data : [];
        } else {
          state.under99.products = [...state.under99.products, ...(Array.isArray(data) ? data : [])];
        }
        
        state.under99.pagination.currentPage = page;
        state.under99.pagination.limit = limit;
        state.under99.pagination.totalItems = state.under99.products.length;
        state.under99.pagination.hasMore = Array.isArray(data) ? data.length === limit : false;
      })
      .addCase(fetchProductsUnder99.rejected, (state, action) => {
        state.under99.loading = false;
        state.under99.error = action.payload?.message || 'Failed to fetch products under $99';
      })

    // Products Under $999
      .addCase(fetchProductsUnder999.pending, (state) => {
        state.under999.loading = true;
        state.under999.error = null;
      })
      .addCase(fetchProductsUnder999.fulfilled, (state, action) => {
        const { data, page, limit } = action.payload;
        state.under999.loading = false;
        
        if (page === 1) {
          state.under999.products = Array.isArray(data) ? data : [];
        } else {
          state.under999.products = [...state.under999.products, ...(Array.isArray(data) ? data : [])];
        }
        
        state.under999.pagination.currentPage = page;
        state.under999.pagination.limit = limit;
        state.under999.pagination.totalItems = state.under999.products.length;
        state.under999.pagination.hasMore = Array.isArray(data) ? data.length === limit : false;
      })
      .addCase(fetchProductsUnder999.rejected, (state, action) => {
        state.under999.loading = false;
        state.under999.error = action.payload?.message || 'Failed to fetch products under $999';
      });
  },
});

// ==========================
// 🔄 Export actions and reducer
// ==========================
export const {
  clearProductsUnder9,
  clearProductsUnder49,
  clearProductsUnder99,
  clearProductsUnder999,
  clearAllProducts,
  resetPaginationUnder9,
  resetPaginationUnder49,
  resetPaginationUnder99,
  resetPaginationUnder999,
  updatePaginationSettings
} = topProductsSlice.actions;

export default topProductsSlice.reducer;

// ==========================
// 📋 Selectors (Optional - for easier state access)
// ==========================
export const selectProductsUnder9 = (state) => state.topProducts.under9;
export const selectProductsUnder49 = (state) => state.topProducts.under49;
export const selectProductsUnder99 = (state) => state.topProducts.under99;
export const selectProductsUnder999 = (state) => state.topProducts.under999;

// Get loading state for any category
export const selectIsLoading = (state) => {
  return state.topProducts.under9.loading || 
         state.topProducts.under49.loading || 
         state.topProducts.under99.loading || 
         state.topProducts.under999.loading;
};

// Get products by category helper
export const selectProductsByCategory = (state, category) => {
  const categoryMap = {
    9: state.topProducts.under9,
    49: state.topProducts.under49,
    99: state.topProducts.under99,
    999: state.topProducts.under999
  };
  return categoryMap[category] || null;
};