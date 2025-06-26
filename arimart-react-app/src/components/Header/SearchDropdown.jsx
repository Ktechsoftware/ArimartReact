import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchProducts } from '../../utils/searchProducts';

export const SearchDropdown = ({ query, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Search whenever query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const filtered = searchProducts(allProducts, query).slice(0, 5); // Show top 5 results
    setResults(filtered);
    setLoading(false);
  }, [query, allProducts]);

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border border-gray-200 dark:border-gray-700">
      {loading ? (
        <div className="p-4 text-center text-gray-500">Searching...</div>
      ) : results.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {results.map((product) => (
            <Link
              key={product.asin}
              to={`/product/${product.asin}`}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              <img 
                src={product.product_photo} 
                alt={product.product_title}
                className="w-10 h-10 object-contain mr-3"
              />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                  {product.product_title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {product.product_price}
                </p>
              </div>
            </Link>
          ))}
          <Link
            to={`/search?query=${encodeURIComponent(query)}`}
            className="block p-3 text-center text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            See all results for "{query}"
          </Link>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};