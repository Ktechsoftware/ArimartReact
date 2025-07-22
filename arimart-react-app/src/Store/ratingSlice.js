import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// ✅ Submit new rating
export const submitRating = createAsyncThunk(
  'ratings/submitRating',
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post('/rating/rate', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit rating');
    }
  }
);

// ✅ Get rating analytics
export const fetchRatingAnalytics = createAsyncThunk(
  'ratings/fetchRatingAnalytics',
  async (pdid, { rejectWithValue }) => {
    try {
      const response = await API.get(`/rating/analytics/${pdid}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// ✅ Get rating summary
export const fetchRatingSummary = createAsyncThunk(
  'ratings/fetchRatingSummary',
  async (pdid, { rejectWithValue }) => {
    try {
      const response = await API.get(`/rating/summary/${pdid}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch summary');
    }
  }
);

// ✅ Get detailed ratings with pagination and star filter
export const fetchDetailedRatings = createAsyncThunk(
  'ratings/fetchDetailedRatings',
  async ({ pdid, page = 1, pageSize = 10, filterByStars = null }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, pageSize });
      if (filterByStars) params.append('filterByStars', filterByStars);
      const response = await API.get(`/rating/detailed/${pdid}?${params}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch detailed ratings');
    }
  }
);

// ✅ Get average rating (optional fallback)
export const fetchAverageRating = createAsyncThunk(
  'ratings/fetchAverageRating',
  async (pdid, { rejectWithValue }) => {
    try {
      const response = await API.get(`/rating/average/${pdid}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch average rating');
    }
  }
);

// ✅ Get ratings with user info
export const fetchRatingsWithUserInfo = createAsyncThunk(
  'ratings/fetchRatingsWithUserInfo',
  async (pdid, { rejectWithValue }) => {
    try {
      const response = await API.get(`/rating/withuser/${pdid}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch ratings with user info');
    }
  }
);

// ✅ Mark review as helpful
export const markReviewHelpful = createAsyncThunk(
  'ratings/markReviewHelpful',
  async ({ reviewId, isHelpful }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/rating/helpful/${reviewId}`, { isHelpful });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mark review as helpful');
    }
  }
);

const ratingSlice = createSlice({
  name: 'rating',
  initialState: {
    analytics: null,
    summary: null,
    detailed: {
      ratings: [],
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      filterByStars: null
    },
    average: null,
    withUser: [],
    loading: false,
    analyticsLoading: false,
    ratingsLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearRatingMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    setRatingFilter: (state, action) => {
      state.detailed.filterByStars = action.payload;
    },
    resetRatingForm: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // Submit rating
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Review submitted successfully!';
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Rating analytics
      .addCase(fetchRatingAnalytics.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(fetchRatingAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
        state.error = null;
      })
      .addCase(fetchRatingAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      })

      // Rating summary
      .addCase(fetchRatingSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRatingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
        state.error = null;
      })
      .addCase(fetchRatingSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Detailed ratings
      .addCase(fetchDetailedRatings.pending, (state) => {
        state.ratingsLoading = true;
      })
      .addCase(fetchDetailedRatings.fulfilled, (state, action) => {
        state.ratingsLoading = false;
        state.detailed = {
          ...action.payload,
          ratings: action.payload.ratings || [],
        };
        state.error = null;
      })
      .addCase(fetchDetailedRatings.rejected, (state, action) => {
        state.ratingsLoading = false;
        state.error = action.payload;
      })

      // Average rating
      .addCase(fetchAverageRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        state.loading = false;
        state.average = action.payload;
        state.error = null;
      })
      .addCase(fetchAverageRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Ratings with user info
      .addCase(fetchRatingsWithUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRatingsWithUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.withUser = action.payload;
        state.error = null;
      })
      .addCase(fetchRatingsWithUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark review as helpful
      .addCase(markReviewHelpful.pending, (state) => {
        state.loading = true;
      })
      .addCase(markReviewHelpful.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Review marked as helpful!';
        
        // Update the helpful count in the detailed ratings if available
        const { reviewId, helpfulCount } = action.payload;
        if (state.detailed.ratings && reviewId) {
          const ratingIndex = state.detailed.ratings.findIndex(rating => rating.id === reviewId);
          if (ratingIndex !== -1 && helpfulCount !== undefined) {
            state.detailed.ratings[ratingIndex].helpfulCount = helpfulCount;
          }
        }
      })
      .addCase(markReviewHelpful.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearRatingMessages,
  setRatingFilter,
  resetRatingForm
} = ratingSlice.actions;

export default ratingSlice.reducer;