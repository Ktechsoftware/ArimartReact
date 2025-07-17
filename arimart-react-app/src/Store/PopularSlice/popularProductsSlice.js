import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api';

// ✅ Fetch popular products with category filter
export const fetchPopularProducts = createAsyncThunk(
  'popularProducts/fetchPopularProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `products/popular${queryString ? `?${queryString}` : ''}`;
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Load more popular products (append to existing products)
export const loadMorePopularProducts = createAsyncThunk(
  'popularProducts/loadMorePopularProducts',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { popularProducts } = getState();
      const nextPage = popularProducts.pagination.page + 1;
      const queryParams = { ...params, page: nextPage };
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `products/popular${queryString ? `?${queryString}` : ''}`;
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch special categories with counts
export const fetchSpecialCategories = createAsyncThunk(
  'popularProducts/fetchSpecialCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('products/categories/special');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch product recommendations
export const fetchProductRecommendations = createAsyncThunk(
  'popularProducts/fetchProductRecommendations',
  async ({ productId, limit = 8 }, { rejectWithValue }) => {
    try {
      const response = await API.get(`products/recommendations/${productId}?limit=${limit}`);
      return {
        productId,
        recommendations: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch homepage sections
export const fetchHomepageSections = createAsyncThunk(
  'popularProducts/fetchHomepageSections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('products/homepage-sections');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch products by category (bestseller, trending, featured, etc.)
export const fetchProductsByCategory = createAsyncThunk(
  'popularProducts/fetchProductsByCategory',
  async ({ category, ...params }, { rejectWithValue }) => {
    try {
      const queryParams = { category, ...params };
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `products/popular${queryString ? `?${queryString}` : ''}`;
      const response = await API.get(url);
      return {
        category,
        ...response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const popularProductsSlice = createSlice({
  name: 'popularProducts',
  initialState: {
    // Popular products by category
    items: [],
    loading: false,
    loadingMore: false,
    error: null,
    
    // Current category filter
    currentCategory: 'all', // all, bestseller, trending, featured, new-arrivals, deals, premium
    
    // Pagination
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    
    // Special categories with counts
    specialCategories: {
      categories: [],
      loading: false,
      error: null,
    },
    
    // Homepage sections
    homepageSections: {
      sections: [],
      loading: false,
      error: null,
    },
    
    // Product recommendations by productId
    recommendations: {
      // [productId]: { recommendations: [], loading: false, error: null }
    },
    
    // Category-specific products cache
    categoryProducts: {
      // [category]: { items: [], pagination: {}, loading: false, error: null }
    },
  },
  
  reducers: {
    // Set current category filter
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    
    // Clear popular products
    clearPopularProducts: (state) => {
      state.items = [];
      state.pagination.page = 1;
      state.pagination.hasNextPage = false;
    },
    
    // Reset pagination
    resetPagination: (state) => {
      state.pagination = {
        page: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    },
    
    // Clear errors
    clearPopularProductsError: (state) => {
      state.error = null;
      state.specialCategories.error = null;
      state.homepageSections.error = null;
    },
    
    // Clear category products cache
    clearCategoryProductsCache: (state) => {
      state.categoryProducts = {};
    },
    
    // Clear recommendations for a specific product
    clearRecommendations: (state, action) => {
      const productId = action.payload;
      if (state.recommendations[productId]) {
        delete state.recommendations[productId];
      }
    },
    
    // Clear all recommendations
    clearAllRecommendations: (state) => {
      state.recommendations = {};
    },
  },
  
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Popular Products
      .addCase(fetchPopularProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.pagination = {
          page: action.payload.currentPage || 1,
          pageSize: action.payload.pageSize || 10,
          totalCount: action.payload.totalCount || 0,
          totalPages: action.payload.totalPages || 0,
          hasNextPage: action.payload.hasNextPage || false,
          hasPreviousPage: action.payload.hasPreviousPage || false,
        };
      })
      .addCase(fetchPopularProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Load More Popular Products
      .addCase(loadMorePopularProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMorePopularProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        const newProducts = action.payload.products || [];
        state.items = [...state.items, ...newProducts];
        state.pagination = {
          page: action.payload.currentPage || state.pagination.page,
          pageSize: action.payload.pageSize || state.pagination.pageSize,
          totalCount: action.payload.totalCount || state.pagination.totalCount,
          totalPages: action.payload.totalPages || state.pagination.totalPages,
          hasNextPage: action.payload.hasNextPage || false,
          hasPreviousPage: action.payload.hasPreviousPage || false,
        };
      })
      .addCase(loadMorePopularProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload;
      })

      // 🔄 Fetch Special Categories
      .addCase(fetchSpecialCategories.pending, (state) => {
        state.specialCategories.loading = true;
        state.specialCategories.error = null;
      })
      .addCase(fetchSpecialCategories.fulfilled, (state, action) => {
        state.specialCategories.loading = false;
        state.specialCategories.categories = action.payload.categories || [];
      })
      .addCase(fetchSpecialCategories.rejected, (state, action) => {
        state.specialCategories.loading = false;
        state.specialCategories.error = action.payload;
      })

      // 🔄 Fetch Product Recommendations
      .addCase(fetchProductRecommendations.pending, (state, action) => {
        const productId = action.meta.arg.productId;
        if (!state.recommendations[productId]) {
          state.recommendations[productId] = {
            recommendations: [],
            loading: false,
            error: null,
          };
        }
        state.recommendations[productId].loading = true;
        state.recommendations[productId].error = null;
      })
      .addCase(fetchProductRecommendations.fulfilled, (state, action) => {
        const { productId, recommendations } = action.payload;
        state.recommendations[productId] = {
          recommendations,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchProductRecommendations.rejected, (state, action) => {
        const productId = action.meta.arg.productId;
        if (state.recommendations[productId]) {
          state.recommendations[productId].loading = false;
          state.recommendations[productId].error = action.payload;
        }
      })

      // 🔄 Fetch Homepage Sections
      .addCase(fetchHomepageSections.pending, (state) => {
        state.homepageSections.loading = true;
        state.homepageSections.error = null;
      })
      .addCase(fetchHomepageSections.fulfilled, (state, action) => {
        state.homepageSections.loading = false;
        state.homepageSections.sections = action.payload.sections || [];
      })
      .addCase(fetchHomepageSections.rejected, (state, action) => {
        state.homepageSections.loading = false;
        state.homepageSections.error = action.payload;
      })

      // 🔄 Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        const category = action.meta.arg.category;
        if (!state.categoryProducts[category]) {
          state.categoryProducts[category] = {
            items: [],
            pagination: {},
            loading: false,
            error: null,
          };
        }
        state.categoryProducts[category].loading = true;
        state.categoryProducts[category].error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        const { category, products, ...pagination } = action.payload;
        state.categoryProducts[category] = {
          items: products || [],
          pagination: {
            currentPage: pagination.currentPage || 1,
            pageSize: pagination.pageSize || 10,
            totalCount: pagination.totalCount || 0,
            totalPages: pagination.totalPages || 0,
            hasNextPage: pagination.hasNextPage || false,
            hasPreviousPage: pagination.hasPreviousPage || false,
          },
          loading: false,
          error: null,
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        const category = action.meta.arg.category;
        if (state.categoryProducts[category]) {
          state.categoryProducts[category].loading = false;
          state.categoryProducts[category].error = action.payload;
        }
      });
  },
});

export const {
  setCurrentCategory,
  clearPopularProducts,
  resetPagination,
  clearPopularProductsError,
  clearCategoryProductsCache,
  clearRecommendations,
  clearAllRecommendations,
} = popularProductsSlice.actions;

export default popularProductsSlice.reducer;