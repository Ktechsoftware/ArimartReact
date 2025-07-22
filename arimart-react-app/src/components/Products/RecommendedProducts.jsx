import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductRecommendations } from "../../Store/productsSlice";
import DProductCard from "./DProductcards";
import { motion } from "framer-motion";

const RecommendedProducts = ({ productId, category = "", limit = 8, title = "Products related to this item", className = "" }) => {
    const dispatch = useDispatch();
    const {
        recommendations,
        recommendationsLoading,
        error
    } = useSelector(state => state.products);
    console.log(productId, recommendations)
    const recommendedProducts = recommendations[productId] || [];
    const isLoading = recommendationsLoading[productId] || false;

    useEffect(() => {
        if (productId && !recommendations[productId]) {
            dispatch(fetchProductRecommendations({ productId, limit }));
        }
    }, [dispatch, productId, limit, recommendations]);

    useEffect(() => {
    if (category && !recommendations[category]) {
      dispatch(fetchProductsByCategory({ category, limit }));
    }
  }, [dispatch, category, limit, recommendations]);

    if (isLoading) {
        return (
            <div className={`py-8 ${className}`}>

                <motion.h4
                    className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                   {title}
                </motion.h4>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: limit }).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-300"></div>
                            <div className="p-4">
                                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                                <div className="flex items-center justify-between">
                                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                                    <div className="h-8 bg-gray-300 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`py-8 ${className}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-600 mb-2">Failed to load recommendations</p>
                    <button
                        onClick={() => dispatch(fetchProductRecommendations({ productId, limit }))}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!recommendedProducts || recommendedProducts.length === 0) {
        return (
            <div className={`py-8 ${className}`}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-600">No recommendations available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`py-8 ${className}`}>
            <div className="flex items-center justify-between mb-6">                
      <motion.h4
        className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >{title}
      </motion.h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recommendedProducts.map((product) => (
                    <DProductCard key={product.id} product={product} />
                ))}
            </div>

            {recommendedProducts.length > 0 && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => dispatch(fetchProductRecommendations({ productId, limit: limit + 4 }))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecommendedProducts;