import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import DProductCard from './DProductcards';
import API from '../../api';
import ProductCard from './ProductCard';

const DesktopProducts = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const carouselRef = useRef(null);
    const location = useLocation();

    const query = new URLSearchParams(location.search).get('query');
    
    useEffect(() => {
        if (query) {
            setIsSearching(true);
            fetchSearchResults(query);
        } else {
            setIsSearching(false);
            fetchAllProducts();
        }
    }, [query]);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const res = await API.get('/products');
            setAllProducts(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchResults = async (query) => {
        try {
            setLoading(true);
            const res = await API.get(`/products/search?query=${query}`);
            setSearchResults(res.data);
            console.log("Search Results:", res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction) => {
        const container = carouselRef.current;
        const scrollAmount = direction === 'left' ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="p-8 text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    const productsToDisplay = isSearching ? searchResults : allProducts;

    return (
        <div className="hidden md:block py-8 px-4 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {isSearching
                        ? `Search Results for "${query}"`
                        : "All Products"}
                </h2>
            </div>

            {productsToDisplay.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No products found.</p>
            ) : (
                <div className="relative group">
                    {/* <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ChevronLeftIcon className="text-gray-700 dark:text-gray-300 text-xl" />
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ChevronRightIcon className="text-gray-700 dark:text-gray-300 text-xl" />
                    </button> */}

                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 p-4">
                        {productsToDisplay.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesktopProducts;
