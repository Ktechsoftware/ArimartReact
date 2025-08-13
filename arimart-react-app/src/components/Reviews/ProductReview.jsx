import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDetailedRatings, fetchRatingAnalytics, submitRating, clearRatingMessages, checkRatingEligibility } from '../../Store/ratingSlice';
import { motion, AnimatePresence } from 'framer-motion';

export const ReviewsComponent = ({ productId }) => {
    const dispatch = useDispatch();
    const { analytics, detailed: detailedRatings, eligibility, loading, error, successMessage } = useSelector(state => state.rating);

    const [hoverRating, setHoverRating] = useState(0);
    const [form, setForm] = useState({ ratingid: 0, descr: '' });
    const [showModal, setModal] = useState(false);
    const [currentPage, setPage] = useState(1);
    const [selectedStarFilter, setSelectedStarFilter] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (productId) {
            dispatch(fetchRatingAnalytics(productId));
            dispatch(checkRatingEligibility(productId));
            dispatch(fetchDetailedRatings({
                pdid: productId,
                page: currentPage,
                filterByStars: selectedStarFilter
            }));
        }
    }, [dispatch, productId, currentPage, selectedStarFilter]);

    const handleStarFilter = (stars) => {
        setSelectedStarFilter(selectedStarFilter === stars ? null : stars);
        setPage(1);
    };

    const setStars = (rating) => {
        setForm(prev => ({ ...prev, ratingid: rating }));
    };

    const setDescription = (description) => {
        setForm(prev => ({ ...prev, descr: description }));
    };

    const handleSubmitRating = async () => {
        if (form.ratingid === 0) return;

        setIsSubmitting(true);

        try {
            await dispatch(submitRating({
                pdid: productId,
                rating: form.ratingid,
                description: form.descr
            })).unwrap();

            setForm({ ratingid: 0, descr: '' });
            setModal(false);
            setHoverRating(0);

            dispatch(fetchRatingAnalytics(productId));
            dispatch(fetchDetailedRatings({
                pdid: productId,
                page: currentPage,
                filterByStars: selectedStarFilter
            }));
        } catch (error) {
            console.error('Failed to submit rating:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!showModal) {
            dispatch(clearRatingMessages());
        }
    }, [showModal, dispatch]);

    const getRatingDistribution = () => {
        if (!Array.isArray(analytics?.ratingBreakdown)) return [];

        return [5, 4, 3, 2, 1].map(stars => {
            const found = analytics.ratingBreakdown.find(item => item.stars === stars) || {
                stars,
                count: 0,
                percentage: 0
            };
            return {
                stars: found.stars,
                count: found.count,
                percentage: parseFloat(found.percentage.toFixed(2))
            };
        });
    };

    const renderStars = (rating, size = 'h-4 w-4', interactive = false, onClick = null) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.svg
                        key={star}
                        className={`${size} ${star <= (interactive ? hoverRating || form.ratingid : rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        onClick={() => interactive && onClick && onClick(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        whileHover={interactive ? { scale: 1.2 } : {}}
                        whileTap={interactive ? { scale: 0.9 } : {}}
                    >
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </motion.svg>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"
                ></motion.div>
            </div>
        );
    }

    return (
        <section className="bg-white md:py-8 py-2 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-2xl px-2 md:px-4 2xl:px-0">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Analytics and Review Form */}
                    <div className="lg:w-1/3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-sm sticky top-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h2>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-3xl font-bold text-white">
                                            {analytics?.averageRating?.toFixed(1) || '0.0'}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm">
                                        {renderStars(analytics?.averageRating || 0, 'h-4 w-4')}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Based on <span className="font-semibold">{analytics?.totalReviews || 0}</span> reviews
                                    </p>
                                    {eligibility.isEligible && !eligibility.hasAlreadyRated ? (
                                        <button
                                            onClick={() => setModal(true)}
                                            className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-md transition-all duration-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Write a review
                                        </button>
                                    ) : (
                                        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                            {eligibility.hasAlreadyRated
                                                ? "✓ You've already reviewed this product"
                                                : eligibility.reason || "Purchase this product to leave a review"
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 mt-6">
                                {getRatingDistribution().map(({ stars, count, percentage }) => {
                                    const color = stars === 5 ? 'from-green-500 to-emerald-400'
                                        : stars === 4 ? 'from-lime-500 to-lime-400'
                                            : stars === 3 ? 'from-yellow-500 to-yellow-400'
                                                : stars === 2 ? 'from-orange-500 to-orange-400'
                                                    : 'from-red-500 to-red-400';

                                    return (
                                        <motion.div
                                            key={stars}
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => handleStarFilter(stars)}
                                            className={`flex items-center md:p-2 rounded-lg cursor-pointer transition-all ${selectedStarFilter === stars ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                        >
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">{stars}</span>
                                                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 h-2.5 mx-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ duration: 1 }}
                                                    className={`h-full bg-gradient-to-r ${color} rounded-full`}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium text-right">
                                                {count} Reviews
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Share your experience to help others make informed decisions.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side - Reviews List */}
                    <div className="lg:w-2/3">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Customer Reviews
                                {selectedStarFilter && (
                                    <span className="ml-2 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                                        {selectedStarFilter} stars
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
                                <select className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Most recent</option>
                                    <option>Top rated</option>
                                    <option>Most helpful</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {detailedRatings?.ratings?.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <h4 className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No reviews yet</h4>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400">Be the first to share your thoughts!</p>
                                    {eligibility.isEligible && !eligibility.hasAlreadyRated ? (
                                        <button
                                            onClick={() => setModal(true)}
                                            className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-4 py-2 text-sm font-medium rounded-full shadow-md transition-all duration-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Write a review
                                        </button>
                                    ) : (
                                        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                            {eligibility.hasAlreadyRated
                                                ? "✓ You've already reviewed this product"
                                                : eligibility.reason || "Purchase this product to leave a review"
                                            }
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <AnimatePresence>
                                    {detailedRatings?.ratings?.map((review) => (
                                        <motion.div
                                            key={review.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="shrink-0">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-200 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center text-lg font-semibold text-purple-600 dark:text-purple-200">
                                                        {review.userName?.charAt(0) || 'A'}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                                {review.userName || 'Anonymous'}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {renderStars(review.rating)}
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {new Date(review.ratedOn).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {review.isVerifiedPurchase && (
                                                            <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                                                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path fillRule="evenodd" d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 01-.696.288H7.04A2.984 2.984 0 004.055 7.04v1.262a.986.986 0 01-.288.696l-.893.893a2.984 2.984 0 000 4.22l.893.893a.985.985 0 01.288.696v1.262a2.984 2.984 0 002.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 004.22 0l.893-.893a.985.985 0 01.696-.288h1.262a2.984 2.984 0 002.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 000-4.22l-.893-.893a.985.985 0 01-.288-.696V7.04a2.984 2.984 0 00-2.984-2.984h-1.262a.985.985 0 01-.696-.288l-.893-.893A2.984 2.984 0 0012 2zm3.683 7.73a1 1 0 10-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 00-1.415 1.414l1.985 1.984a1 1 0 001.414 0l4.96-4.96z" clipRule="evenodd" />
                                                                </svg>
                                                                Verified Purchase
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                                                        {review.description || review.comment}
                                                    </p>

                                                    <div className="mt-4 md:flex items-center gap-4">
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Was this helpful?
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                                </svg>
                                                                Yes ({review.helpfulCount || 0})
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m0 0v9m0-9h2.765a2 2 0 011.789 2.894l-3.5 7A2 2 0 0118.736 14H15.5m-8.5 0h2m-2 0h2" />
                                                                </svg>
                                                                No ({review.notHelpfulCount || 0})
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Pagination */}
                        {detailedRatings?.totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    <motion.button
                                        onClick={() => setPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </motion.button>

                                    {[...Array(detailedRatings.totalPages).keys()].map((page) => (
                                        <motion.button
                                            key={page + 1}
                                            onClick={() => setPage(page + 1)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === page + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            {page + 1}
                                        </motion.button>
                                    ))}

                                    <motion.button
                                        onClick={() => setPage(currentPage + 1)}
                                        disabled={currentPage === detailedRatings.totalPages}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </motion.button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Write a Review
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setModal(false);
                                            setForm({ ratingid: 0, descr: '' });
                                            setHoverRating(0);
                                        }}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            How would you rate this product? *
                                        </label>
                                        <div className="flex justify-center">
                                            {renderStars(form.ratingid, 'h-8 w-8', true, setStars)}
                                        </div>
                                        {form.ratingid === 0 && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center text-red-500 text-xs mt-2"
                                            >
                                                Please select a rating
                                            </motion.p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Share your experience
                                        </label>
                                        <textarea
                                            value={form.descr}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="What did you like or dislike? Would you recommend this to others?"
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md"
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                        {successMessage && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-md"
                                            >
                                                {successMessage}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex gap-4 pt-2">
                                        <motion.button
                                            onClick={handleSubmitRating}
                                            disabled={isSubmitting || form.ratingid === 0}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-6 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Submitting...
                                                </span>
                                            ) : 'Submit Review'}
                                        </motion.button>
                                        <motion.button
                                            onClick={() => {
                                                setModal(false);
                                                setForm({ ratingid: 0, descr: '' });
                                                setHoverRating(0);
                                            }}
                                            disabled={isSubmitting}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
