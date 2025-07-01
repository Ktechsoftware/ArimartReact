// src/redux/actions/productActions.js
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchProductNames,
} from "../../api/products";

export const getProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "PRODUCTS_REQUEST" });
    const { data } = await fetchProducts();
    dispatch({ type: "PRODUCTS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "PRODUCTS_FAIL", payload: error.message });
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

export const searchForProducts = (query) => async (dispatch) => {
  try {
    dispatch({ type: "SEARCH_PRODUCTS_REQUEST" });
    const { data } = await searchProducts(query);
    dispatch({ type: "SEARCH_PRODUCTS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "SEARCH_PRODUCTS_FAIL", payload: error.message });
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
