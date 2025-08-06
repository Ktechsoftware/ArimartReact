import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Heart, Star, ShoppingCart, Plus, Minus, Check, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchHomepageSections } from '../../../Store/PopularSlice/popularProductsSlice';
import { addToWishlist } from '../../../Store/wishlistSlice';
import { useCart } from '../../../context/CartContext';

const HomepageFeaturedProducts = () => {
    const { market } = useParams();
    const dispatch = useDispatch();
    const { homepageSections } = useSelector(state => state.popularProducts);
    const userData = useSelector((state) => state.auth.userData);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const { imageUrls, imageLoading } = useSelector((state) => state.products);

    const { addToCart, isItemInCart, getItemQuantity, updateQuantity, removeFromCart, getCartItemInfo } = useCart();
    const [loadingStates, setLoadingStates] = useState({});

    useEffect(() => {
        dispatch(fetchHomepageSections());
    }, [dispatch]);

    // Helper function to get section tag color
    const getSectionTagColor = (sectionKey) => {
        const colors = {
            'bestseller': 'bg-gradient-to-r from-red-500 to-pink-500',
            'trending': 'bg-gradient-to-r from-green-500 to-emerald-500',
            'new-arrivals': 'bg-gradient-to-r from-blue-500 to-cyan-500',
            'deals': 'bg-gradient-to-r from-yellow-500 to-orange-500',
            'featured': 'bg-gradient-to-r from-orange-500 to-violet-500',
            'premium': 'bg-gradient-to-r from-indigo-500 to-orange-500'
        };
        return colors[sectionKey] || 'bg-gradient-to-r from-gray-500 to-gray-600';
    };

    // Helper function to parse price
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        const parsed = parseFloat(priceStr);
        return isNaN(parsed) ? 0 : parsed;
    };

    // Helper function to calculate discount percentage
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
        // toast.success("Added to wishlist!");
    };

    const handleAddToCart = async (product) => {
        setLoadingStates(prev => ({ ...prev, [product.id]: true }));
        try {
            await addToCart(product, 1);
        } catch (error) {
            toast.error("Failed to add to cart");
            console.error('Error adding to cart:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [product.id]: false }));
        }
    };

    const handleUpdateQuantity = async (productId, delta) => {
        const cartItem = getCartItemInfo(productId);
        if (!cartItem) return;
        const newQuantity = Math.max(1, cartItem.quantity + delta);
        setLoadingStates(prev => ({ ...prev, [`${productId}_qty`]: true }));
        toast.success("Update quantity");
        try {
            await updateQuantity(cartItem.cartItemId, newQuantity);
        } catch (error) {
            toast.error("Failed to update quantity");
            console.error("Update quantity error:", error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [`${productId}_qty`]: false }));
        }
    };


    const handleRemoveFromCart = async (productId) => {
        setLoadingStates(prev => ({ ...prev, [`${productId}_remove`]: true }));
        try {
            await removeFromCart(productId);
            // toast.success("Removed from cart");
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

    const HorizontalProductCard = ({ product }) => {
        const discountPercentage = getDiscountPercentage(product.price, product.discountprice);
        const displayPrice = parsePrice(product.discountprice) > 0 ? parsePrice(product.discountprice) : parsePrice(product.price);
        const originalPrice = parsePrice(product.price);
        const groupPrice = parsePrice(product.gprice);
        const groupQty = product.gqty;
        const productId = product.id;

        const imageUrl = product.image
            ? `https://apiari.kuldeepchaurasia.in/Uploads/${product.image}`
            : '/placeholder-image.jpg';

        const inCart = getCartItemInfo(productId);
        const quantity = getItemQuantity(productId);
        const loading = loadingStates[productId] || false;
        const qtyLoading = loadingStates[`${productId}_qty`] || false;

        return (
            <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow transition-all duration-200 relative">
                {/* Product Image */}
                <Link to={generateProductLink(product)} className="w-24 h-24 flex-shrink-0">
                    <img
                        src={imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                    />
                </Link>

                {/* Product Details */}
                <div className="flex flex-col justify-between p-3 flex-1">
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 pr-2">
                                {product.productName}
                            </h3>
                            <button
                                    onClick={() => handleWishlist(product)}
                                    disabled={loading}
                                    className="ml-2"
                                >
                                    <Heart
                                        size={18}
                                        className={`transition-all duration-200 ${isWishlisted(product.pdid)
                                                ? 'text-red-500 fill-red-500'
                                                : 'text-gray-300 hover:text-red-500 fill-none'
                                            }`}
                                    />
                                </button>
                        </div>

                        {product.wweight && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.wweight}</p>
                        )}

                        {groupPrice > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 text-xs px-2 py-1 rounded inline-block mt-1">
                                Group: ₹{groupPrice} (Min {groupQty})
                            </div>
                        )}
                    </div>

                    {/* Price Info */}
                    <div className="mt-2">
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-gray-900 dark:text-white">₹{displayPrice}</span>
                            {parsePrice(product.discountprice) > 0 && (
                                <span className="text-xs line-through text-gray-400">₹{originalPrice}</span>
                            )}
                            {discountPercentage > 0 && (
                                <span className="text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 px-1.5 py-0.5 rounded">
                                    {discountPercentage}% OFF
                                </span>
                            )}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Star size={12} className="fill-yellow-400 mr-0.5" />
                            <span>4.5</span>
                        </div>
                    </div>
                </div>

                {/* Cart Controls - Right Side */}
                <div className="flex flex-col justify-center pr-3">
                    {!inCart ? (
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={loading}
                            className="w-10 h-10 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full transition"
                            aria-label="Add to cart"
                        >
                            {loading ? <Spinner size={16} /> : <ShoppingCart size={16} />}
                        </button>
                    ) : (
                        <div className="flex flex-col items-center space-y-1">
                            <button
                                onClick={() => handleUpdateQuantity(product.pdid, 1)}
                                disabled={qtyLoading}
                                className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full"
                                aria-label="Increase quantity"
                            >
                                <Plus size={12} />
                            </button>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">
                                {console.log(inCart)}
                                {inCart.quantity}
                            </span>
                            {inCart.quantity <= 1 ? (
                                <button
                                    onClick={() => handleRemoveFromCart(product.id)}
                                    disabled={loadingStates[`${product.id}_remove`]}
                                    className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full transition"
                                    aria-label="Remove from cart"
                                >
                                    <Trash size={12} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleUpdateQuantity([product.pdid], -1)} // ✅ fixed here
                                    disabled={qtyLoading}
                                    className="w-6 h-6 flex items-center justify-center bg-red-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full disabled:opacity-50"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div >
        );
    };



    if (homepageSections.loading) {
        return (
            <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (homepageSections.error) {
        return (
            <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-6">
                    <div className="text-center text-red-500 dark:text-red-400 py-20">
                        <h3 className="text-xl font-semibold mb-2">Error loading products</h3>
                        <p>{homepageSections.error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-6xl mx-auto px-2">
                {homepageSections.sections && homepageSections.sections.length > 0 ? (
                    homepageSections.sections
                        .filter(section => section.products && section.products.length > 0) // ✅ Only include sections with products
                        .map((section, sectionIndex) => (
                            <div key={section.key} className={`${sectionIndex > 0 ? 'mt-16' : ''}`}>
                                {/* Section Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1 h-8 ${getSectionTagColor(section.key)} rounded-full`}></div>
                                        <h2 className="text-xl md:text-3xl font-bold dark:text-white">{section.title}</h2>
                                    </div>
                                    <Link
                                        to={`/category/${section.key}`}
                                        className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 flex items-center gap-1 font-medium transition-colors"
                                    >
                                        View all <ChevronRight size={18} />
                                    </Link>
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {section.products.map((product) => (
                                        <HorizontalProductCard
                                            key={product.id}
                                            product={product}
                                            sectionKey={section.key}
                                            sectionTitle={section.title}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-20">
                        <h3 className="text-xl font-semibold mb-2">No featured products available</h3>
                        <p>Please check back later for our latest offerings.</p>
                    </div>
                )}
            </div>

        </section>
    );
};

export default HomepageFeaturedProducts;