import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// ✅ Fetch products with filters
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `products${queryString ? `?${queryString}` : ''}`;
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Load more products (append to existing products)
export const loadMoreProducts = createAsyncThunk(
  'products/loadMoreProducts',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { products } = getState();
      const nextPage = products.pagination.page + 1;
      const queryParams = { ...params, page: nextPage };
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `products${queryString ? `?${queryString}` : ''}`;
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch product image URL
export const fetchProductImageUrl = createAsyncThunk(
  'products/fetchProductImageUrl',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`products/${productId}/image-url`);
      // console.log('Product Image URL:', response.data);
      return {
        productId,
        imageUrl: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch multiple product image URLs
export const fetchProductImageUrls = createAsyncThunk(
  'products/fetchProductImageUrls',
  async (productIds, { rejectWithValue }) => {
    try {
      const queryString = productIds.map(id => `ids=${id}`).join('&');
      const response = await API.get(`products/image-urls?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// fetch product from subcateogroy
export const fetchSubcategoryproducts = createAsyncThunk(
  'products/fetchSubcategoryproducts',
  async ({ subcategoryId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: limit.toString()
      });

      const response = await API.get(`products/by-subcategory/${subcategoryId}?${queryParams}`);
      console.log('Subcategory products:', response.data);

      return {
        subcategoryId,
        subcategoryProducts: response.data.products || response.data,
        pagination: {
          currentPage: response.data.currentPage || page,
          pageSize: response.data.pageSize || limit,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 1,
          hasNextPage: response.data.hasNextPage || false
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// New action for loading more subcategory products
export const loadMoreSubcategoryProducts = createAsyncThunk(
  'products/loadMoreSubcategoryProducts',
  async ({ subcategoryId, page, limit = 10 }, { rejectWithValue, getState }) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: limit.toString()
      });

      const response = await API.get(`products/by-subcategory/${subcategoryId}?${queryParams}`);

      return {
        subcategoryId,
        newProducts: response.data.products || response.data,
        pagination: {
          currentPage: response.data.currentPage || page,
          pageSize: response.data.pageSize || limit,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 1,
          hasNextPage: response.data.hasNextPage || false
        }
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Fetch group buys for product (gid, pid, pdid only)
export const fetchGroupBuysByProductId = createAsyncThunk(
  'products/fetchGroupBuysByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.get(`products/groupbuy/${productId}`);
      // console.log('Group buys for product:', response.data);
      return {
        productId,
        groupBuys: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Create new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await API.post('products', productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.put(`products/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await API.delete(`products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProductRecommendations = createAsyncThunk(
  'products/fetchProductRecommendations',
  async ({ productId, limit = 8 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await API.get(`products/recommendations/${productId}?${queryParams}`);
      return {
        productId,
        recommendations: response.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    loadingMore: false,
    error: null,
    imageUrls: {},
    subcategoryProducts: {},
    subcategoryPagination: {}, // Add pagination for each subcategory
    subcategoryHasMore: {}, // Track hasMore for each subcategory
    subcategoryLoadingMore: {},
    recommendations: {}, // Store recommendations by productId
    recommendationsLoading: {},
    imageLoading: {},
    groupBuys: {},
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    filters: {
      category: '',
      priceRange: { min: 0, max: 1000 },
      search: '',
    },
    hasMore: true,
  },
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceRange: { min: 0, max: 1000 },
        search: '',
      };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearProductsError: (state) => {
      state.error = null;
    },
    clearImageUrls: (state) => {
      state.imageUrls = {};
      state.imageLoading = {};
    },
    resetProducts: (state) => {
      state.items = [];
      state.pagination.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || action.payload;
        if (action.payload.currentPage) {
          state.pagination = {
            page: action.payload.currentPage,
            limit: action.payload.pageSize,
            total: action.payload.totalCount,
            totalPages: action.payload.totalPages,
          };
          state.hasMore = action.payload.currentPage < action.payload.totalPages;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Load More Products
      .addCase(loadMoreProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        const newProducts = action.payload.products || action.payload;
        state.items = [...state.items, ...newProducts];
        if (action.payload.currentPage) {
          state.pagination = {
            page: action.payload.currentPage,
            limit: action.payload.pageSize,
            total: action.payload.totalCount,
            totalPages: action.payload.totalPages,
          };
          state.hasMore = action.payload.currentPage < action.payload.totalPages;
        }
      })
      .addCase(loadMoreProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload;
      })

      // 🔄 Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Fetch Product Image URL
      .addCase(fetchProductImageUrl.pending, (state, action) => {
        const productId = action.meta.arg;
        state.imageLoading[productId] = true;
      })
      .addCase(fetchProductImageUrl.fulfilled, (state, action) => {
        const { productId, imageUrl } = action.payload;
        state.imageLoading[productId] = false;
        state.imageUrls[productId] = imageUrl;
      })
      .addCase(fetchProductImageUrl.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.imageLoading[productId] = false;
        state.error = action.payload;
      })

      // 🔄 Fetch Multiple Image URLs
      .addCase(fetchProductImageUrls.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductImageUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrls = { ...state.imageUrls, ...action.payload };
      })
      .addCase(fetchProductImageUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Fetch Group Buys
      .addCase(fetchGroupBuysByProductId.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchGroupBuysByProductId.fulfilled, (state, action) => {
        const { productId, groupBuys } = action.payload;
        state.groupBuys[productId] = groupBuys;
      })
      .addCase(fetchGroupBuysByProductId.rejected, (state, action) => {
        state.error = action.payload;
      })
      // 🔄 Fetch Subcategory product
      .addCase(fetchSubcategoryproducts.pending, (state, action) => {
        const { subcategoryId } = action.meta.arg;
        state.error = null;
        state.loading = true;
        state.subcategoryLoadingMore[subcategoryId] = false;
      })
      .addCase(fetchSubcategoryproducts.fulfilled, (state, action) => {
        const { subcategoryId, subcategoryProducts, pagination } = action.payload;
        console.log('Storing in state:', subcategoryId, subcategoryProducts);

        // Replace products for fresh load
        state.subcategoryProducts[subcategoryId] = subcategoryProducts;
        state.subcategoryPagination[subcategoryId] = pagination;
        state.subcategoryHasMore[subcategoryId] = pagination.hasNextPage;
        state.loading = false;
        state.subcategoryLoadingMore[subcategoryId] = false;
      })
      .addCase(fetchSubcategoryproducts.rejected, (state, action) => {
        const { subcategoryId } = action.meta.arg;
        state.error = action.payload;
        state.loading = false;
        state.subcategoryLoadingMore[subcategoryId] = false;
      })

      // Add cases for load more
      .addCase(loadMoreSubcategoryProducts.pending, (state, action) => {
        const { subcategoryId } = action.meta.arg;
        state.subcategoryLoadingMore[subcategoryId] = true;
        state.error = null;
      })
      .addCase(loadMoreSubcategoryProducts.fulfilled, (state, action) => {
        const { subcategoryId, newProducts, pagination } = action.payload;

        // Append new products to existing ones
        const existingProducts = state.subcategoryProducts[subcategoryId] || [];
        state.subcategoryProducts[subcategoryId] = [...existingProducts, ...newProducts];
        state.subcategoryPagination[subcategoryId] = pagination;
        state.subcategoryHasMore[subcategoryId] = pagination.hasNextPage;
        state.subcategoryLoadingMore[subcategoryId] = false;
      })
      .addCase(loadMoreSubcategoryProducts.rejected, (state, action) => {
        const { subcategoryId } = action.meta.arg;
        state.subcategoryLoadingMore[subcategoryId] = false;
        state.error = action.payload;
      })

      // 🔄 Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
        delete state.imageUrls[action.payload];
        delete state.imageLoading[action.payload];
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔄 Fetch Product Recommendations
      .addCase(fetchProductRecommendations.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.recommendationsLoading[productId] = true;
        state.error = null;
      })
      .addCase(fetchProductRecommendations.fulfilled, (state, action) => {
        const { productId, recommendations } = action.payload;
        state.recommendationsLoading[productId] = false;
        state.recommendations[productId] = recommendations;
      })
      .addCase(fetchProductRecommendations.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.recommendationsLoading[productId] = false;
        state.error = action.payload;
      })
  },
});

export const {
  setCurrentProduct,
  clearCurrentProduct,
  setFilters,
  clearFilters,
  setPagination,
  clearProductsError,
  clearImageUrls,
  resetProducts,
} = productsSlice.actions;

export default productsSlice.reducer;