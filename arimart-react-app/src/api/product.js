import API from "./index";
export const fetchProducts = (page = 1, pageSize = 10) => 
  API.get(`/products?page=${page}&pageSize=${pageSize}`);

export const fetchProductById = (id) => API.get(`/products/${id}`);

export const searchProducts = (query, page = 1, pageSize = 10) => 
  API.get(`/products/search?query=${query}&page=${page}&pageSize=${pageSize}`);

export const fetchProductNames = (query = "") => 
  API.get(`/products/names?query=${query}`);