import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchProductNames,
} from '../api/product'

// Get initial products (first page)
export const getProducts = (page = 1, pageSize = 10) => async (dispatch) => {
  try {
    dispatch({ type: "PRODUCTS_REQUEST" });
    const { data } = await fetchProducts(page, pageSize);
    dispatch({ 
      type: "PRODUCTS_SUCCESS", 
      payload: data 
    });
  } catch (error) {
    dispatch({ type: "PRODUCTS_FAIL", payload: error.message });
  }
};

// Load more products (append to existing list)
export const loadMoreProducts = (page, pageSize = 10) => async (dispatch, getState) => {
  try {
    dispatch({ type: "LOAD_MORE_PRODUCTS_REQUEST" });
    const { data } = await fetchProducts(page, pageSize);
    
    // Get current products from state
    const currentProducts = getState().products.products;
    
    dispatch({ 
      type: "LOAD_MORE_PRODUCTS_SUCCESS", 
      payload: {
        ...data,
        products: [...currentProducts, ...data.products] // Append new products
      }
    });
  } catch (error) {
    dispatch({ type: "LOAD_MORE_PRODUCTS_FAIL", payload: error.message });
  }
};

export const getProductById = (id) => async (dispatch) => {
  try {
    dispatch({ type: "PRODUCT_REQUEST" });
    const { data } = await fetchProductById(id);
    dispatch({ type: "PRODUCT_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "PRODUCT_FAIL", payload: error.message });
  }
};

// Search products with pagination
export const searchForProducts = (query, page = 1, pageSize = 10) => async (dispatch) => {
  try {
    dispatch({ type: "SEARCH_PRODUCTS_REQUEST" });
    const { data } = await searchProducts(query, page, pageSize);
    dispatch({ 
      type: "SEARCH_PRODUCTS_SUCCESS", 
      payload: data 
    });
  } catch (error) {
    dispatch({ type: "SEARCH_PRODUCTS_FAIL", payload: error.message });
  }
};

// Load more search results
export const loadMoreSearchResults = (query, page, pageSize = 10) => async (dispatch, getState) => {
  try {
    dispatch({ type: "LOAD_MORE_SEARCH_REQUEST" });
    const { data } = await searchProducts(query, page, pageSize);
    
    // Get current search results from state
    const currentResults = getState().products.searchResults.products || [];
    
    dispatch({ 
      type: "LOAD_MORE_SEARCH_SUCCESS", 
      payload: {
        ...data,
        products: [...currentResults, ...data.products] // Append new results
      }
    });
  } catch (error) {
    dispatch({ type: "LOAD_MORE_SEARCH_FAIL", payload: error.message });
  }
};

export const getProductNames = (query) => async (dispatch) => {
  try {
    const { data } = await fetchProductNames(query);
    dispatch({ type: "PRODUCT_NAMES_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "PRODUCT_NAMES_FAIL", payload: error.message });
  }
};

// Clear search results
export const clearSearchResults = () => ({
  type: "CLEAR_SEARCH_RESULTS"
});