// src/api/products.js
import API from "./index";

// Calls your .NET Core API endpoints
export const fetchProducts = () => API.get("/products");
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const searchProducts = (query) => API.get(`/products/search?query=${query}`);
export const fetchProductNames = (query = "") => API.get(`/products/names?query=${query}`);
