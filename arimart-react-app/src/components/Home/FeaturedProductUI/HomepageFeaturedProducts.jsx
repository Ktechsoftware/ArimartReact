import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Heart, Star, ShoppingCart, Plus, Minus, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchHomepageSections } from '../../../Store/PopularSlice/popularProductsSlice';
import { fetchProducts, loadMoreProducts } from '../../../Store/productsSlice';
import { addToWishlist } from '../../../Store/wishlistSlice';
import { useCart } from '../../../context/CartContext';
import FilterComponent from './FilterComponent';


const HomepageFeaturedProducts = () => {
    const { market } = useParams();
    const dispatch = useDispatch();
    const { homepageSections } = useSelector(state => state.popularProducts);
    const { items: products, loading, loadingMore, hasMore: hasMoreProducts } = useSelector(state => state.products);
    const userData = useSelector((state) => state.auth.userData);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const { addToCart, isItemInCart, getItemQuantity, updateQuantity, removeFromCart, getCartItemInfo } = useCart();
    const filterRef = useRef(null);
    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [loadingStates, setLoadingStates] = useState({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showFilters]);
    // Fetch initial data
    useEffect(() => {
        dispatch(fetchHomepageSections()); // For tags data
        dispatch(fetchProducts()); // For actual products
    }, [dispatch]);

    // Get tag categories from homepage sections for filtering logic
    const tagCategories = useMemo(() => {
        if (!homepageSections.sections) return {};

        const categories = {};
        homepageSections.sections.forEach(section => {
            if (section.products) {
                section.products.forEach(product => {
                    // Map products to their tag categories
                    if (section.name?.toLowerCase().includes('bestseller') || section.name?.toLowerCase().includes('best')) {
                        categories[product.id] = [...(categories[product.id] || []), 'bestseller'];
                    }
                    if (section.name?.toLowerCase().includes('trending')) {
                        categories[product.id] = [...(categories[product.id] || []), 'trending'];
                    }
                    if (section.name?.toLowerCase().includes('new')) {
                        categories[product.id] = [...(categories[product.id] || []), 'new'];
                    }
                    if (section.name?.toLowerCase().includes('featured')) {
                        categories[product.id] = [...(categories[product.id] || []), 'featured'];
                    }
                    if (section.name?.toLowerCase().includes('deal')) {
                        categories[product.id] = [...(categories[product.id] || []), 'deal'];
                    }
                });
            }
        });
        return categories;
    }, [homepageSections.sections]);

    // Filter products based on active filter using both product data and homepage sections
    const filteredProducts = useMemo(() => {
        if (activeFilter === 'all') return products;

        return products.filter(product => {
            const productTags = tagCategories[product.id] || [];

            switch (activeFilter) {
                case 'bestseller':
                    return productTags.includes('bestseller') ||
                        product.isBestseller ||
                        product.bestseller;
                case 'trending':
                    return productTags.includes('trending') ||
                        product.isTrending ||
                        product.trending;
                case 'new-arrivals':
                    return productTags.includes('new') ||
                        product.isNew ||
                        product.newArrival;
                case 'deals':
                    return productTags.includes('deal') ||
                        (product.discountprice && parseFloat(product.discountprice) < parseFloat(product.price));
                case 'featured':
                    return productTags.includes('featured') ||
                        product.isFeatured ||
                        product.featured;
                case 'premium':
                    return product.isPremium ||
                        product.premium;
                default:
                    return true;
            }
        });
    }, [products, activeFilter, tagCategories]);

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
        if (loadingMore || !hasMoreProducts) return;

        // Load more products from products slice
        dispatch(loadMoreProducts());
    }, [dispatch, loadingMore, hasMoreProducts]);

    // Attach scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Helper functions
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        const parsed = parseFloat(priceStr);
        return isNaN(parsed) ? 0 : parsed;
    };

    const getDiscountPercentage = (price, discountPrice) => {
        const originalPrice = parsePrice(price);
        const discountedPrice = parsePrice(discountPrice);
        if (originalPrice > discountedPrice && originalPrice > 0) {
            return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
        }
        return 0;
    };

    const handleWishlist = (product) => {
        if (!userData?.id) return toast.error("Please login to use wishlist.");
        dispatch(addToWishlist({ userid: userData.id, pdid: product.pdid }));
    };

    const handleAddToCart = async (product) => {
        setLoadingStates(prev => ({ ...prev, [product.id]: true }));
        try {
            await addToCart(product, 1);
        } catch (error) {
            toast.error("Failed to add to cart");
        } finally {
            setLoadingStates(prev => ({ ...prev, [product.id]: false }));
        }
    };

    const handleUpdateQuantity = async (productId, delta) => {
        const cartItem = getCartItemInfo(productId);
        if (!cartItem) return;
        const newQuantity = Math.max(1, cartItem.quantity + delta);
        setLoadingStates(prev => ({ ...prev, [`${productId}_qty`]: true }));
        try {
            await updateQuantity(cartItem.cartItemId, newQuantity);
        } catch (error) {
            toast.error("Failed to update quantity");
        } finally {
            setLoadingStates(prev => ({ ...prev, [`${productId}_qty`]: false }));
        }
    };

    const handleRemoveFromCart = async (productId) => {
        setLoadingStates(prev => ({ ...prev, [`${productId}_remove`]: true }));
        try {
            await removeFromCart(productId);
            toast.success("Removed from cart");
        } catch (error) {
            toast.error("Failed to remove from cart");
        } finally {
            setLoadingStates(prev => ({ ...prev, [`${productId}_remove`]: false }));
        }
    };

    const generateProductLink = (product) => {
        const marketParam = market || product.categoryName || "";
        const subcategoryParam = product.subcategoryName || product.name || "";
        return `/category/${encodeURIComponent(marketParam)}/${encodeURIComponent(subcategoryParam)}/product/${product.id}`;
    };

    const isWishlisted = (productId) => {
        return wishlistItems.some((item) => item.pdid === productId);
    };

    const getTagColor = (tag) => {
        const colors = {
            'bestseller': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            'trending': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            'new': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            'deal': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            'featured': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
            'premium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
        };
        return colors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    };

    // Loading state
    if (loading && !filteredProducts.length) {
        return (
            <div className="flex justify-center items-center py-20 min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Error state
    if (homepageSections.error) {
        return (
            <div className="text-center py-20 text-red-500 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div>
                    <p className="text-lg font-medium">{homepageSections.error}</p>
                    <button
                        onClick={() => dispatch(fetchHomepageSections())}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Product Card Component
    const ProductCard = ({ product }) => {
        const discountPercentage = getDiscountPercentage(product.price, product.discountprice);
        const displayPrice = parsePrice(product.discountprice) > 0 ? parsePrice(product.discountprice) : parsePrice(product.price);
        const originalPrice = parsePrice(product.price);
        const groupPrice = parsePrice(product.gprice);
        const productId = product.id;
        const inCart = isItemInCart(productId);
        const quantity = getItemQuantity(productId);
        const loading = loadingStates[productId];
        const qtyLoading = loadingStates[`${productId}_qty`];
        const removeLoading = loadingStates[`${productId}_remove`];

        // Determine tags based on homepage sections and product properties
        const tags = [];
        const productTags = tagCategories[product.id] || [];

        // Add tags from homepage sections
        if (productTags.includes('bestseller')) tags.push('bestseller');
        if (productTags.includes('trending')) tags.push('trending');
        if (productTags.includes('new')) tags.push('new');
        if (productTags.includes('featured')) tags.push('featured');
        if (productTags.includes('deal')) tags.push('deal');

        // Add tags from product properties as fallback
        if (!tags.includes('bestseller') && (product.isBestseller || product.bestseller)) tags.push('bestseller');
        if (!tags.includes('new') && (product.isNew || product.newArrival)) tags.push('new');
        if (!tags.includes('deal') && product.discountprice && product.discountprice < product.price) tags.push('deal');
        if (!tags.includes('featured') && (product.isFeatured || product.featured)) tags.push('featured');
        if (product.isPremium || product.premium) tags.push('premium');

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
                {/* Image with Tags */}
                <div className="relative">
                    <Link to={generateProductLink(product)} className="block aspect-square">
                        <img
                            src={`https://apiari.kuldeepchaurasia.in/Uploads/${product.image}`}
                            alt={product.productName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => e.target.src = '/placeholder-image.jpg'}
                        />
                    </Link>

                    {/* Tags at top-left */}
                    {tags.length > 0 && (
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {tags.slice(0, 2).map(tag => ( // Show max 2 tags to avoid overcrowding
                                <span key={tag} className={`${getTagColor(tag)} text-xs px-2 py-1 rounded-full flex items-center shadow-sm`}>
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Wishlist button */}
                    <button
                        onClick={() => handleWishlist(product)}
                        className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                        <Heart
                            size={18}
                            className={isWishlisted(product.pdid) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}
                        />
                    </button>

                    {/* Discount badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                            {discountPercentage}% OFF
                        </div>
                    )}
                </div>

                {/* Product Info - Flexible container */}
                <div className="p-3 flex flex-col flex-grow">
                    {/* Product details that can grow */}
                    <div className="flex-grow">
                        <Link to={generateProductLink(product)}>
                            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                {product.productName}
                            </h3>
                        </Link>

                        {product.wweight && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{product.wweight}</p>
                        )}

                        {groupPrice > 0 && (
                            <div className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 px-2 py-1 rounded mb-2">
                                Group: ₹{groupPrice} (Min {product.gqty})
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-gray-900 dark:text-white">₹{displayPrice}</span>
                            {originalPrice > displayPrice && (
                                <span className="text-sm line-through text-gray-400">₹{originalPrice}</span>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                            <span>{product.rating || '4.5'}</span>
                        </div>
                    </div>

                    {/* Cart Actions - Always at bottom */}
                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        {!inCart ? (
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={loading}
                                className={`w-full py-2.5 rounded-md flex items-center justify-center transition-all duration-200 font-medium ${loading
                                        ? 'bg-orange-400 cursor-not-allowed'
                                        : 'bg-orange-500 hover:bg-orange-600 hover:shadow-md active:bg-orange-700'
                                    } text-white`}
                            >
                                {loading ? (
                                    <span className="animate-spin">↻</span>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} className="mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/50">
                                {quantity <= 1 ? (
                                    <button
                                        onClick={() => handleRemoveFromCart(product.id)}
                                        disabled={removeLoading}
                                        className="px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-l-md"
                                    >
                                        {removeLoading ? (
                                            <span className="animate-spin">↻</span>
                                        ) : (
                                            <Trash size={16} />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUpdateQuantity(product.pdid, -1)}
                                        disabled={qtyLoading}
                                        className="px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-l-md"
                                    >
                                        {qtyLoading ? (
                                            <span className="animate-spin">↻</span>
                                        ) : (
                                            <Minus size={16} />
                                        )}
                                    </button>
                                )}
                                <span className="text-sm font-semibold px-3 min-w-[40px] text-center">{quantity} {product.wtype}</span>
                                <button
                                    onClick={() => handleUpdateQuantity(product.pdid, 1)}
                                    disabled={qtyLoading}
                                    className="px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-r-md"
                                >
                                    {qtyLoading ? (
                                        <span className="animate-spin">↻</span>
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
            {/* Filter Component */}
            <FilterComponent
                ref={filterRef}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
            />

            {/* Results Summary */}
            <div className="px-4 py-2 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredProducts.length} products
                    {activeFilter !== 'all' && (
                        <span className="ml-1">
                            in <span className="font-medium text-orange-600 dark:text-orange-400">
                                {activeFilter.replace('-', ' ')}
                            </span>
                        </span>
                    )}
                </p>
            </div>

            {/* Product Grid */}
            <div className="px-4 py-4">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {filteredProducts.map(product => (
                            <ProductCard key={`${product.id}-${product.pdid}`} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="mb-4">
                            <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <ShoppingCart size={32} className="text-gray-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Try adjusting your filters or browse all products
                        </p>
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            View All Products
                        </button>
                    </div>
                )}

                {/* Loading More Indicator */}
                {loadingMore && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomepageFeaturedProducts;