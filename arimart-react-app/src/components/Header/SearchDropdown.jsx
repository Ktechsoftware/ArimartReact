// SearchDropdown.jsx
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getAutocompleteSuggestions,
  clearAutocompleteSuggestions,
  setDropdownOpen,
  searchProducts
} from '../../Store/searchSlice';
import {
  ShoppingBag,
  Search,
  Folder,
  FolderOpen,
  FileText,
  Sparkles,
  FileQuestion,
  Package
} from 'lucide-react';

export const SearchDropdown = ({ query, onClose, onSuggestionClick }) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const {
    autocompleteSuggestions,
    autocompleteLoading,
    autocompleteError,
    results: searchResults,
    suggestions: searchSuggestions,
    loading: searchLoading
  } = useSelector((state) => state.search);

  // Fetch both autocomplete and product suggestions when query changes
  useEffect(() => {
    if (query && query.trim().length >= 2) {
      dispatch(getAutocompleteSuggestions(query.trim()));
      dispatch(searchProducts({ 
        query: query.trim(), 
        pageSize: 5,
        page: 1 
      }));
    } else {
      dispatch(clearAutocompleteSuggestions());
    }
  }, [query, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Generate URL based on suggestion type
  const generateUrl = (suggestion) => {
    switch (suggestion.type) {
      case 'product':
        return `/search?query=${encodeURIComponent(suggestion.text)}`;

      case 'category':
        const catName = suggestion.categoryName || suggestion.text;
        return `/category/${encodeURIComponent(catName)}`;

      case 'subcategory':
        const parentCat = suggestion.categoryName || suggestion.parentCategory || 'unknown';
        const subCat = suggestion.subcategoryName || suggestion.text;
        return `/category/${encodeURIComponent(parentCat)}/${encodeURIComponent(subCat)}`;

      case 'keyword':
      case 'autocomplete':
      default:
        return `/search?query=${encodeURIComponent(suggestion.text)}`;
    }
  };

  // Generate URL for product results
  const generateProductUrl = (product) => {
    const categoryName = product.categoryName || 'unknown';
    const subcategoryName = product.subcategoryName || 'unknown';
    const productId = product.id;
    return `/category/${encodeURIComponent(categoryName)}/${encodeURIComponent(subcategoryName)}/product/${productId}`;
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion.text);
    }
    onClose();
  };

  // Handle product click
  const handleProductClick = (product) => {
    if (onSuggestionClick) {
      onSuggestionClick(product.productName);
    }
    onClose();
  };

  // Handle "See all results" click
  const handleSeeAllResults = () => {
    onClose();
  };

  // Group autocomplete suggestions by type
  const groupedSuggestions = autocompleteSuggestions.reduce((acc, suggestion) => {
    const type = suggestion.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(suggestion);
    return acc;
  }, {});

  // Define type display names and icons
  const typeConfig = {
    product: { name: 'Products', icon: <ShoppingBag className="w-4 h-4" /> },
    keyword: { name: 'Keywords', icon: <Search className="w-4 h-4" /> },
    category: { name: 'Categories', icon: <Folder className="w-4 h-4" /> },
    subcategory: { name: 'Subcategories', icon: <FolderOpen className="w-4 h-4" /> },
    childcategory: { name: 'Child Categories', icon: <FileText className="w-4 h-4" /> },
    autocomplete: { name: 'Suggestions', icon: <Sparkles className="w-4 h-4" /> },
  };

  if (!query || query.trim().length < 2) {
    return null;
  }

  const isLoading = autocompleteLoading || searchLoading;
  const hasResults = searchResults.length > 0 || autocompleteSuggestions.length > 0;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <span className="mt-2 block">Searching...</span>
        </div>
      ) : (autocompleteError && !hasResults) ? (
        <div className="p-4 text-center text-red-500">
          Error loading suggestions
        </div>
      ) : hasResults ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Product Results Section */}
          {searchResults.length > 0 && (
            <div className="p-2">
              <div className="flex items-center px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Package className="w-4 h-4 mr-1" />
                Products
              </div>
              {searchResults.slice(0, 5).map((product, index) => (
                <Link
                  key={`product-${product.id}`}
                  to={generateProductUrl(product)}
                  onClick={() => handleProductClick(product)}
                  className="w-full text-left flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded block no-underline"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {product.image && (
                      <img
                        src={"http://localhost:5015/Uploads/" + product.image}
                        alt={product.productName}
                        className="w-8 h-8 object-cover rounded mr-3 flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.productName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {product.categoryName} › {product.subcategoryName}
                      </div>
                    </div>
                  </div>
                  {product.price && (
                    <div className="ml-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                      ₹{product.price}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Search Suggestions from API */}
          {searchSuggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 mr-1" />
                Related Searches
              </div>
              {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                <Link
                  key={`search-suggestion-${index}`}
                  to={generateUrl(suggestion)}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded block no-underline"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {suggestion.text}
                    </span>
                    {suggestion.category && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        in {suggestion.category}
                      </span>
                    )}
                  </div>
                  {suggestion.matchCount > 0 && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {suggestion.matchCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Autocomplete Suggestions */}
          {Object.entries(groupedSuggestions).map(([type, suggestions]) => (
            <div key={type} className="p-2">
              <div className="flex items-center px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span className="mr-1">
                  {typeConfig[type]?.icon || <FileQuestion className="w-4 h-4" />}
                </span>
                {typeConfig[type]?.name || type}
              </div>
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <Link
                  key={`${type}-${index}`}
                  to={generateUrl(suggestion)}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded block no-underline"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {suggestion.text}
                    </span>
                    {suggestion.category && (
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        in {suggestion.category}
                      </span>
                    )}
                  </div>
                  {suggestion.matchCount > 0 && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {suggestion.matchCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}

          {/* See all results link */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700">
            <Link
              to={`/search?query=${encodeURIComponent(query)}`}
              className="block w-full p-2 text-center text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              onClick={handleSeeAllResults}
            >
              See all results for "{query}"
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <div className="mb-2">🔍</div>
          <div>No suggestions found for "{query}"</div>
          <Link
            to={`/search?query=${encodeURIComponent(query)}`}
            className="inline-block mt-2 text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline"
            onClick={handleSeeAllResults}
          >
            Search anyway
          </Link>
        </div>
      )}
    </div>
  );
};