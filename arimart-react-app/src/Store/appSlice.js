import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for generic API calls
export const makeApiCall = createAsyncThunk(
  'api/makeCall',
  async ({ url, method = 'GET', data = null }, { rejectWithValue }) => {
    try {
      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    loading: false,
    data: null,
    error: null,
    cache: {},
  },
  reducers: {
    clearApiData: (state) => {
      state.data = null;
      state.error = null;
    },
    clearApiError: (state) => {
      state.error = null;
    },
    cacheApiData: (state, action) => {
      const { key, data } = action.payload;
      state.cache[key] = data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeApiCall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeApiCall.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(makeApiCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const { clearApiData, clearApiError, cacheApiData } = apiSlice.actions;
export default apiSlice.reducer;