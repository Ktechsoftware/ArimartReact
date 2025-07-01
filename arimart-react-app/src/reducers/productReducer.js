const initialState = {
  loading: false,
  products: [],
  product: null,
  error: null,
  searchResults: [],
  nameSuggestions: [],
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCTS_REQUEST":
    case "PRODUCT_REQUEST":
    case "SEARCH_PRODUCTS_REQUEST":
      return { ...state, loading: true };

    case "PRODUCTS_SUCCESS":
      return { ...state, loading: false, products: action.payload };

    case "PRODUCT_SUCCESS":
      return { ...state, loading: false, product: action.payload };

    case "SEARCH_PRODUCTS_SUCCESS":
      return { ...state, loading: false, searchResults: action.payload };

    case "PRODUCT_NAMES_SUCCESS":
      return { ...state, nameSuggestions: action.payload };

    case "PRODUCTS_FAIL":
    case "PRODUCT_FAIL":
    case "SEARCH_PRODUCTS_FAIL":
    case "PRODUCT_NAMES_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
