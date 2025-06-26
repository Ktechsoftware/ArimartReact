// utils/searchProducts.js
export const searchProducts = (products, query) => {
  if (!query) return products;
  
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(lowerCaseQuery) ||
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery)
  );
};