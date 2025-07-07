import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    useGetRatingAnalyticsQuery,
    useGetDetailedRatingsQuery,
    useSubmitRatingMutation,
    useRatingFilters,
    useRatingForm
} from '../../Store/ratingSlice';

const ReviewsComponent = ({ pdid }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);

    // Get rating state from custom hooks
    const {
        selectedStarFilter,
        currentPage,
        pageSize,
        sortBy,
        showOnlyWithReviews,
        setStarFilter,
        clearFilter,
        setPage,
        setSize,
        setSort,
        setShowReviews,
    } = useRatingFilters();

    const {
        form,
        isSubmitting,
        submitError,
        showModal,
        updateForm,
        resetForm,
        setStars,
        setDescription,
        setModal,
        clearError,
    } = useRatingForm();

    // API queries
    const { data: analytics, isLoading: analyticsLoading } = useGetRatingAnalyticsQuery(pdid);
    const { data: detailedRatings, isLoading: ratingsLoading } = useGetDetailedRatingsQuery({
        pdid,
        page: currentPage,
        pageSize,
        filterByStars: selectedStarFilter
    });

    // Mutations
    const [submitRating] = useSubmitRatingMutation();

    // Local state for star rating input
    const [hoverRating, setHoverRating] = useState(0);

    // Initialize form with user data
    useEffect(() => {
        if (userData?.id && (form.userid !== userData.id || form.pdid !== pdid)) {
            updateForm({
                userid: userData.id,
                pdid: pdid
            });
        }
    }, [userData, pdid, updateForm, form.userid, form.pdid]);


    // Handle star filter click
    const handleStarFilter = (stars) => {
        if (selectedStarFilter === stars) {
            clearFilter();
        } else {
            setStarFilter(stars);
        }
    };

    // Handle rating submission
    const handleSubmitRating = async () => {
        if (!userData?.id) {
            alert('Please login to submit a review');
            return;
        }

        try {
            await submitRating(form).unwrap();
            setModal(false);
            resetForm();
        } catch (error) {
            console.error('Failed to submit rating:', error);
        }
    };

    // Calculate rating distribution
    const getRatingDistribution = () => {
        if (!analytics?.ratingDistribution) return [];

        const total = analytics.totalReviews || 1;
        return [5, 4, 3, 2, 1].map(rating => ({
            stars: rating,
            count: analytics.ratingDistribution[rating] || 0,
            percentage: ((analytics.ratingDistribution[rating] || 0) / total) * 100
        }));
    };

    // Render star rating
    const renderStars = (rating, size = 'h-4 w-4', interactive = false, onClick = null) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`${size} ${star <= (interactive ? hoverRating || form.ratingid : rating)
                                ? 'text-yellow-300'
                                : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        onClick={() => interactive && onClick && onClick(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                    >
                        <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                    </svg>
                ))}
            </div>
        );
    };

    if (analyticsLoading || ratingsLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Reviews</h2>
                    <div className="mt-2 flex items-center gap-2 sm:mt-0">
                        {renderStars(analytics?.averageRating || 0)}
                        <p className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
                            ({analytics?.averageRating?.toFixed(1) || '0.0'})
                        </p>
                        <a href="#" className="text-sm font-medium leading-none text-gray-900 underline hover:no-underline dark:text-white">
                            {analytics?.totalReviews || 0} Reviews
                        </a>
                    </div>
                </div>

                {/* Rating Overview */}
                <div className="my-6 gap-8 sm:flex sm:items-start md:my-8">
                    <div className="shrink-0 space-y-4">
                        <p className="text-2xl font-semibold leading-none text-gray-900 dark:text-white">
                            {analytics?.averageRating?.toFixed(2) || '0.00'} out of 5
                        </p>
                        <button
                            type="button"
                            onClick={() => setModal(true)}
                            className="mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Write a review
                        </button>
                    </div>

                    {/* Rating Distribution */}
                    <div className="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
                        {getRatingDistribution().map(({ stars, count, percentage }) => (
                            <div key={stars} className="flex items-center gap-2">
                                <p className="w-2 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white">
                                    {stars}
                                </p>
                                <svg className="h-4 w-4 shrink-0 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
                                </svg>
                                <div className="h-1.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        className="h-1.5 rounded-full bg-yellow-300"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <button
                                    onClick={() => handleStarFilter(stars)}
                                    className={`w-8 shrink-0 text-right text-sm font-medium leading-none hover:underline sm:w-auto sm:text-left ${selectedStarFilter === stars ? 'text-blue-700 dark:text-blue-500' : 'text-gray-700 dark:text-gray-500'
                                        }`}
                                >
                                    {count} <span className="hidden sm:inline">reviews</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Individual Reviews */}
                <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
                    {detailedRatings?.reviews?.map((review) => (
                        <div key={review.id} className="gap-3 pb-6 sm:flex sm:items-start">
                            <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
                                {renderStars(review.rating)}

                                <div className="space-y-0.5">
                                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                                        {review.userName || 'Anonymous'}
                                    </p>
                                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {review.isVerifiedPurchase && (
                                    <div className="inline-flex items-center gap-1">
                                        <svg className="h-5 w-5 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                fillRule="evenodd"
                                                d="M12 2c-.791 0-1.55.314-2.11.874l-.893.893a.985.985 0 0 1-.696.288H7.04A2.984 2.984 0 0 0 4.055 7.04v1.262a.986.986 0 0 1-.288.696l-.893.893a2.984 2.984 0 0 0 0 4.22l.893.893a.985.985 0 0 1 .288.696v1.262a2.984 2.984 0 0 0 2.984 2.984h1.262c.261 0 .512.104.696.288l.893.893a2.984 2.984 0 0 0 4.22 0l.893-.893a.985.985 0 0 1 .696-.288h1.262a2.984 2.984 0 0 0 2.984-2.984V15.7c0-.261.104-.512.288-.696l.893-.893a2.984 2.984 0 0 0 0-4.22l-.893-.893a.985.985 0 0 1-.288-.696V7.04a2.984 2.984 0 0 0-2.984-2.984h-1.262a.985.985 0 0 1-.696-.288l-.893-.893A2.984 2.984 0 0 0 12 2Zm3.683 7.73a1 1 0 1 0-1.414-1.413l-4.253 4.253-1.277-1.277a1 1 0 0 0-1.415 1.414l1.985 1.984a1 1 0 0 0 1.414 0l4.96-4.96Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Verified purchase</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
                                <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                                    {review.description || review.comment}
                                </p>

                                <div className="flex items-center gap-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Was it helpful to you?
                                    </p>
                                    <div className="flex items-center">
                                        <input
                                            id={`helpful-yes-${review.id}`}
                                            type="radio"
                                            name={`helpful-${review.id}`}
                                            className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                        />
                                        <label htmlFor={`helpful-yes-${review.id}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            Yes: {review.helpfulCount || 0}
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id={`helpful-no-${review.id}`}
                                            type="radio"
                                            name={`helpful-${review.id}`}
                                            className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                                        />
                                        <label htmlFor={`helpful-no-${review.id}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                            No: {review.notHelpfulCount || 0}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {detailedRatings?.totalPages > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Page {currentPage} of {detailedRatings.totalPages}
                            </span>

                            <button
                                onClick={() => setPage(currentPage + 1)}
                                disabled={currentPage === detailedRatings.totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Write a Review
                            </h3>
                            <button
                                onClick={() => setModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Rating
                                </label>
                                {renderStars(form.ratingid, 'h-6 w-6', true, setStars)}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Review
                                </label>
                                <textarea
                                    value={form.descr}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Share your experience..."
                                />
                            </div>

                            {submitError && (
                                <div className="text-red-600 text-sm">{submitError}</div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSubmitRating}
                                    disabled={isSubmitting || form.ratingid === 0}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                                <button
                                    onClick={() => setModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ReviewsComponent;