import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // 👈 for reading `price` from URL
import {
    fetchProductsUnder9,
    fetchProductsUnder49,
    fetchProductsUnder99,
    fetchProductsUnder999,
    selectProductsByCategory,
} from "../../Store/Tops/topProductsSlice";

import { LoaderCircle, PlusCircle, Filter } from "lucide-react";
import ProductCard from "../Products/ProductCard";
import FilterSheet from "./FilterSheet";

const thunkMap = {
    9: fetchProductsUnder9,
    49: fetchProductsUnder49,
    99: fetchProductsUnder99,
    999: fetchProductsUnder999,
};

const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
            <div
                key={idx}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-pulse border border-gray-100 dark:border-gray-700"
            >
                <div className="w-20 h-20 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-3" />
                <div className="space-y-2 text-center">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mx-auto" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto" />
                    <div className="h-4 bg-green-300 dark:bg-green-700 rounded w-1/2 mx-auto mt-2" />
                    <div className="h-9 bg-green-400 dark:bg-green-600 rounded-lg w-full mt-3" />
                </div>
            </div>
        ))}
    </div>
);

const EmptyProducts = () => (
    <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <PlusCircle className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No products found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
            Try selecting a different price category
        </p>
    </div>
);

const TopProductsComponent = () => {
    const { price } = useParams(); // 👈 read the URL param `/topstore/:price`
    const category = parseInt(price || 9); // fallback to 9 if no price
    const dispatch = useDispatch();
    const loadMoreRef = useRef(null);
    const observerRef = useRef(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const {
        products,
        loading,
        error,
        pagination: { currentPage, limit, hasMore },
    } = useSelector((state) => selectProductsByCategory(state, category) || {
        products: [],
        loading: false,
        error: null,
        pagination: { currentPage: 1, limit: 10, hasMore: false },
    });

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            dispatch(thunkMap[category]?.({ page: currentPage + 1, limit }));
        }
    }, [category, hasMore, loading, currentPage, limit, dispatch]);

    useEffect(() => {
        dispatch(thunkMap[category]?.({ page: 1, limit }));
    }, [category, dispatch, limit]);


    useEffect(() => {
        const current = loadMoreRef.current;

        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    loadMore();
                }
            },
            { rootMargin: "100px", threshold: 0.1 }
        );

        if (current) observerRef.current.observe(current);

        return () => observerRef.current?.disconnect();
    }, [loadMore]);

    return (
        <div className="w-full">
            <div className="mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                        Top Products under ₹{category}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {products.length} products available
                    </p>
                </div>

                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                </button>

                <FilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
            </div>

            {products.length === 0 ? (
                loading ? (
                    <SkeletonGrid />
                ) : (
                    <EmptyProducts />
                )
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products.map((product, idx) => (
                            <ProductCard key={`${product.id}-${idx}`} product={product} />
                        ))}
                    </div>

                    <div ref={loadMoreRef} className="flex justify-center py-4">
                        {loading && (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <LoaderCircle className="w-5 h-5 animate-spin" />
                                <span className="text-sm">Loading more products...</span>
                            </div>
                        )}
                        {!hasMore && (
                            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                                No more products to load
                            </div>
                        )}
                    </div>
                </>
            )}

        </div>
    );
};

export default TopProductsComponent;
