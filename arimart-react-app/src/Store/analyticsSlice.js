
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from '../api'

export const fetchUserAnalytics = createAsyncThunk(
  "analytics/fetchUserAnalytics",
  async (userId, thunkAPI) => {
    try {
      const res = await API.get(`/UserAnalytics/summary/${userId}`);
      console.log("Analytics data :",res.data)
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to load analytics");
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    clearAnalyticsData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearAnalyticsError, clearAnalyticsData } = analyticsSlice.actions;
export default analyticsSlice.reducer;
