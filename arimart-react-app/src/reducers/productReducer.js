const initialState = {
  loading: false,
  loadingMore: false,
  products: [], 
  product: null,
  error: null,
  searchResults: {
    products: [],
    currentPage: 0,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    searchQuery: ""
  },
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    pageSize: 10
  },
  nameSuggestions: [],
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCTS_REQUEST":
    case "PRODUCT_REQUEST":
    case "SEARCH_PRODUCTS_REQUEST":
      return { ...state, loading: true, error: null };

    case "LOAD_MORE_PRODUCTS_REQUEST":
    case "LOAD_MORE_SEARCH_REQUEST":
      return { ...state, loadingMore: true, error: null };

    case "PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        products: action.payload.products || [],
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount,
          hasNextPage: action.payload.hasNextPage,
          pageSize: action.payload.pageSize
        },
        error: null
      };

    case "LOAD_MORE_PRODUCTS_SUCCESS":
      return {
        ...state,
        loadingMore: false,
        products: action.payload.products,
        pagination: {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount,
          hasNextPage: action.payload.hasNextPage,
          pageSize: action.payload.pageSize
        },
        error: null
      };

    case "PRODUCT_SUCCESS":
      return { 
        ...state, 
        loading: false, 
        product: action.payload,
        error: null 
      };

    case "SEARCH_PRODUCTS_SUCCESS":
      return {
        ...state,
        loading: false,
        searchResults: {
          products: action.payload.products || [],
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount,
          hasNextPage: action.payload.hasNextPage,
          searchQuery: action.payload.searchQuery
        },
        error: null
      };

    case "LOAD_MORE_SEARCH_SUCCESS":
      return {
        ...state,
        loadingMore: false,
        searchResults: {
          ...state.searchResults,
          products: action.payload.products, // Already merged in action
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount,
          hasNextPage: action.payload.hasNextPage
        },
        error: null
      };

    case "PRODUCT_NAMES_SUCCESS":
      return { 
        ...state, 
        nameSuggestions: action.payload 
      };

    case "CLEAR_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: {
          products: [],
          currentPage: 0,
          totalPages: 0,
          totalCount: 0,
          hasNextPage: false,
          searchQuery: ""
        }
      };

    case "PRODUCTS_FAIL":
    case "PRODUCT_FAIL":
    case "SEARCH_PRODUCTS_FAIL":
    case "PRODUCT_NAMES_FAIL":
    case "LOAD_MORE_PRODUCTS_FAIL":
    case "LOAD_MORE_SEARCH_FAIL":
      return { 
        ...state, 
        loading: false, 
        loadingMore: false,
        error: action.payload 
      };

    default:
      return state;
  }
};