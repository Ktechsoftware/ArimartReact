import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useDispatch, useSelector } from 'react-redux';

// Base API configuration without auth token
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/rating',
});

// RTK Query API slice for rating operations
export const ratingApi = createApi({
  reducerPath: 'ratingApi',
  baseQuery,
  tagTypes: ['Rating', 'Analytics', 'Summary'],
  endpoints: (builder) => ({
    submitRating: builder.mutation({
      query: (ratingData) => ({
        url: '',
        method: 'POST',
        body: ratingData,
      }),
      invalidatesTags: (result, error, { pdid }) => [
        { type: 'Rating', id: pdid },
        { type: 'Analytics', id: pdid },
        { type: 'Summary', id: pdid },
      ],
    }),

    getRatingAnalytics: builder.query({
      query: (pdid) => `/analytics/${pdid}`,
      providesTags: (result, error, pdid) => [{ type: 'Analytics', id: pdid }],
    }),

    getRatingSummary: builder.query({
      query: (pdid) => `/summary/${pdid}`,
      providesTags: (result, error, pdid) => [{ type: 'Summary', id: pdid }],
    }),

    getDetailedRatings: builder.query({
      query: ({ pdid, page = 1, pageSize = 10, filterByStars }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (filterByStars) {
          params.append('filterByStars', filterByStars.toString());
        }

        return `/detailed/${pdid}?${params}`;
      },
      providesTags: (result, error, { pdid }) => [{ type: 'Rating', id: pdid }],
    }),

    getAverageRating: builder.query({
      query: (pdid) => `/average/${pdid}`,
      providesTags: (result, error, pdid) => [{ type: 'Rating', id: pdid }],
    }),

    getRatingsWithUserInfo: builder.query({
      query: (pdid) => `/withuser/${pdid}`,
      providesTags: (result, error, pdid) => [{ type: 'Rating', id: pdid }],
    }),

    getRatingsByProduct: builder.query({
      query: (pdid) => `/product/${pdid}`,
      providesTags: (result, error, pdid) => [{ type: 'Rating', id: pdid }],
    }),

    getOverallStats: builder.query({
      query: () => '/stats/overview',
      providesTags: ['Rating'],
    }),
  }),
});

export const {
  useSubmitRatingMutation,
  useGetRatingAnalyticsQuery,
  useGetRatingSummaryQuery,
  useGetDetailedRatingsQuery,
  useGetAverageRatingQuery,
  useGetRatingsWithUserInfoQuery,
  useGetRatingsByProductQuery,
  useGetOverallStatsQuery,
} = ratingApi;

const initialState = {
  selectedStarFilter: null,
  showRatingModal: false,
  currentPage: 1,
  pageSize: 10,

  ratingForm: {
    ratingid: 0,
    userid: null,
    orderid: null,
    descr: '',
    pdid: null,
  },

  isSubmitting: false,
  submitError: null,

  analyticsCache: {},

  sortBy: 'newest',
  showOnlyWithReviews: false,
};

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    setSelectedStarFilter: (state, action) => {
      state.selectedStarFilter = action.payload;
      state.currentPage = 1;
    },
    clearStarFilter: (state) => {
      state.selectedStarFilter = null;
      state.currentPage = 1;
    },
    setShowRatingModal: (state, action) => {
      state.showRatingModal = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setShowOnlyWithReviews: (state, action) => {
      state.showOnlyWithReviews = action.payload;
    },
    setRatingForm: (state, action) => {
      state.ratingForm = { ...state.ratingForm, ...action.payload };
    },
    resetRatingForm: (state) => {
      state.ratingForm = {
        ratingid: 0,
        userid: null,
        orderid: null,
        descr: '',
        pdid: null,
      };
    },
    setRatingStars: (state, action) => {
      state.ratingForm.ratingid = action.payload;
    },
    setRatingDescription: (state, action) => {
      state.ratingForm.descr = action.payload;
    },
    cacheAnalytics: (state, action) => {
      const { pdid, data } = action.payload;
      state.analyticsCache[pdid] = {
        data,
        timestamp: Date.now(),
      };
    },
    clearAnalyticsCache: (state) => {
      state.analyticsCache = {};
    },
    clearSubmitError: (state) => {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        ratingApi.endpoints.submitRating.matchPending,
        (state) => {
          state.isSubmitting = true;
          state.submitError = null;
        }
      )
      .addMatcher(
        ratingApi.endpoints.submitRating.matchFulfilled,
        (state) => {
          state.isSubmitting = false;
          state.showRatingModal = false;
          state.ratingForm = initialState.ratingForm;
        }
      )
      .addMatcher(
        ratingApi.endpoints.submitRating.matchRejected,
        (state, action) => {
          state.isSubmitting = false;
          state.submitError = action.error?.message || 'Failed to submit rating';
        }
      );
  },
});

export const {
  setSelectedStarFilter,
  clearStarFilter,
  setShowRatingModal,
  setCurrentPage,
  setPageSize,
  setSortBy,
  setShowOnlyWithReviews,
  setRatingForm,
  resetRatingForm,
  setRatingStars,
  setRatingDescription,
  cacheAnalytics,
  clearAnalyticsCache,
  clearSubmitError,
} = ratingSlice.actions;

export default ratingSlice.reducer;

// Selectors
export const selectRatingState = (state) => state.rating;
export const selectRatingForm = (state) => state.rating.ratingForm;
export const selectSelectedStarFilter = (state) => state.rating.selectedStarFilter;
export const selectCurrentPage = (state) => state.rating.currentPage;
export const selectPageSize = (state) => state.rating.pageSize;
export const selectSortBy = (state) => state.rating.sortBy;
export const selectShowOnlyWithReviews = (state) => state.rating.showOnlyWithReviews;
export const selectIsSubmitting = (state) => state.rating.isSubmitting;
export const selectSubmitError = (state) => state.rating.submitError;
export const selectShowRatingModal = (state) => state.rating.showRatingModal;
export const selectAnalyticsCache = (state) => state.rating.analyticsCache;

// Custom Hooks
export const useRatingFilters = () => {
  const dispatch = useDispatch();
  const selectedStarFilter = useSelector(selectSelectedStarFilter);
  const currentPage = useSelector(selectCurrentPage);
  const pageSize = useSelector(selectPageSize);
  const sortBy = useSelector(selectSortBy);
  const showOnlyWithReviews = useSelector(selectShowOnlyWithReviews);

  return {
    selectedStarFilter,
    currentPage,
    pageSize,
    sortBy,
    showOnlyWithReviews,
    setStarFilter: (stars) => dispatch(setSelectedStarFilter(stars)),
    clearFilter: () => dispatch(clearStarFilter()),
    setPage: (page) => dispatch(setCurrentPage(page)),
    setSize: (size) => dispatch(setPageSize(size)),
    setSort: (sort) => dispatch(setSortBy(sort)),
    setShowReviews: (show) => dispatch(setShowOnlyWithReviews(show)),
  };
};

export const useRatingForm = () => {
  const dispatch = useDispatch();
  const form = useSelector(selectRatingForm);
  const isSubmitting = useSelector(selectIsSubmitting);
  const submitError = useSelector(selectSubmitError);
  const showModal = useSelector(selectShowRatingModal);

  return {
    form,
    isSubmitting,
    submitError,
    showModal,
    updateForm: (data) => dispatch(setRatingForm(data)),
    resetForm: () => dispatch(resetRatingForm()),
    setStars: (stars) => dispatch(setRatingStars(stars)),
    setDescription: (desc) => dispatch(setRatingDescription(desc)),
    setModal: (show) => dispatch(setShowRatingModal(show)),
    clearError: () => dispatch(clearSubmitError()),
  };
};
