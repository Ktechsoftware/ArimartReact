// components/header/SearchDropdown.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../Store/productsSlice"
import { Link } from "react-router-dom";

export const SearchDropdown = ({ query, onClose }) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (query.length > 1) {
      dispatch(fetchProducts({ search: query, limit: 5 }));
    }
  }, [query, dispatch]);

  return (
    <div className="absolute z-50 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md max-h-64 overflow-auto mt-1 border border-gray-200 dark:border-gray-700">
      {loading && (
        <div className="p-3 text-gray-500 dark:text-gray-300 text-sm">Searching...</div>
      )}
      {error && (
        <div className="p-3 text-red-500 text-sm">Error: {error}</div>
      )}
      {!loading && items.length === 0 && (
        <div className="p-3 text-gray-500 dark:text-gray-400 text-sm">No results found</div>
      )}
      {!loading && items.length > 0 && (
        <ul>
          {items.map((item) => (
            <Link
              to={`/product/${item.id}`}
              onClick={onClose}
              key={item.id}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              <div className="font-medium text-black dark:text-white truncate">{item.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{item.categoryName}</div>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};
