// MobileSearchPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAutocompleteSuggestions,
  clearAutocompleteSuggestions,
  searchProducts
} from '../../Store/searchSlice';
import { Search, X, Clock, Package, Sparkles, Folder, FolderOpen, FileText, FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MobileSearchPage = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();

  const {
    autocompleteSuggestions,
    autocompleteLoading,
    autocompleteError,
    results: searchResults,
    suggestions: searchSuggestions,
    loading: searchLoading,
  } = useSelector((state) => state.search);

  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    if (query && query.trim().length >= 2) {
      dispatch(getAutocompleteSuggestions(query.trim()));
      dispatch(searchProducts({ query: query.trim(), pageSize: 5, page: 1 }));
    } else {
      dispatch(clearAutocompleteSuggestions());
    }
  }, [query, dispatch]);

  const saveToHistory = (term) => {
    const newHistory = [term, ...searchHistory.filter((item) => item !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSelect = (term) => {
    saveToHistory(term);
    setQuery(term);
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearAutocompleteSuggestions());
    inputRef.current?.focus();
  };

  const generateProductUrl = (product) => {
    const cat = product.categoryName || 'unknown';
    const sub = product.subcategoryName || 'unknown';
    return `/category/${encodeURIComponent(cat)}/${encodeURIComponent(sub)}/product/${product.id}`;
  };

  const generateUrl = (suggestion) => {
    switch (suggestion.type) {
      case 'product':
        return `/search?query=${encodeURIComponent(suggestion.text)}`;
      case 'category':
        return `/category/${encodeURIComponent(suggestion.categoryName || suggestion.text)}`;
      case 'subcategory':
        return `/category/${encodeURIComponent(suggestion.categoryName || suggestion.parentCategory || 'unknown')}/${encodeURIComponent(suggestion.subcategoryName || suggestion.text)}`;
      default:
        return `/search?query=${encodeURIComponent(suggestion.text)}`;
    }
  };

  const typeConfig = {
    product: { name: 'Products', icon: <Package className="w-4 h-4" /> },
    keyword: { name: 'Keywords', icon: <Search className="w-4 h-4" /> },
    category: { name: 'Categories', icon: <Folder className="w-4 h-4" /> },
    subcategory: { name: 'Subcategories', icon: <FolderOpen className="w-4 h-4" /> },
    childcategory: { name: 'Child Categories', icon: <FileText className="w-4 h-4" /> },
    autocomplete: { name: 'Suggestions', icon: <Sparkles className="w-4 h-4" /> },
  };

  const groupedSuggestions = autocompleteSuggestions.reduce((acc, suggestion) => {
    const type = suggestion.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(suggestion);
    return acc;
  }, {});

  const isLoading = autocompleteLoading || searchLoading;
  const hasResults = searchResults.length > 0 || autocompleteSuggestions.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 top-2.5">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {!query && (
        <div>
          <h3 className="text-gray-700 dark:text-white mb-2">Recent Searches</h3>
          {searchHistory.length > 0 ? (
            <div className="space-y-2">
              {searchHistory.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(item)}
                  className="flex items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer"
                >
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-800 dark:text-gray-200">{item}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-8">No recent searches</div>
          )}
        </div>
      )}

      {query && (
        <>
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">Searching...</div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-gray-400">
              No suggestions found for "{query}"
            </div>
          ) : (
            <div className="space-y-6">
              {searchResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">
                    <Package className="h-4 w-4" /> Products
                  </div>
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={generateProductUrl(product)}
                        onClick={() => saveToHistory(product.productName)}
                        className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm"
                      >
                        {product.image && (
                          <img
                            src={`http://localhost:5015/Uploads/${product.image}`}
                            alt={product.productName}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {product.productName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {product.categoryName} › {product.subcategoryName}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 ml-2">
                          ₹{product.price}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchSuggestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">
                    <Sparkles className="h-4 w-4" /> Related Searches
                  </div>
                  <div className="space-y-2">
                    {searchSuggestions.map((s, i) => (
                      <Link
                        key={i}
                        to={generateUrl(s)}
                        onClick={() => handleSelect(s.text)}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="text-sm text-gray-800 dark:text-white truncate">{s.text}</div>
                        {s.matchCount > 0 && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {s.matchCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(groupedSuggestions).map(([type, group]) => (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-500 dark:text-gray-300 uppercase">
                    {typeConfig[type]?.icon || <FileQuestion className="h-4 w-4" />}
                    {typeConfig[type]?.name || type}
                  </div>
                  <div className="space-y-2">
                    {group.map((s, idx) => (
                      <Link
                        key={idx}
                        to={generateUrl(s)}
                        onClick={() => handleSelect(s.text)}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="text-sm text-gray-800 dark:text-white truncate">{s.text}</div>
                        {s.matchCount > 0 && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {s.matchCount}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MobileSearchPage;
