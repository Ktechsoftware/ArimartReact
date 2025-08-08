import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// ✅ AsyncThunk: Get User Referral Code
export const fetchReferralCode = createAsyncThunk(
    'referral/fetchReferralCode',
    async (userId, thunkAPI) => {
        try {
            const response = await API.get(`/referral/my-refcode/${userId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to fetch referral code'
            );
        }
    }
);

export const fetchReferralStats = createAsyncThunk(
    'referral/fetchReferralStats',
    async (userId, thunkAPI) => {
        try {
            const res = await API.get(`/referral/stats/${userId}`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to fetch referral stats");
        }
    }
);


// ✅ Initial State
const initialState = {
    referCode: null,
    name: '',
    phone: '',
    loading: false,
    error: null,
    stats: {
        totalInstalled: 0,
        totalEarned: 0,
    },
};


// ✅ Slice
const referralSlice = createSlice({
    name: 'referral',
    initialState,
    reducers: {
        clearReferralState: (state) => {
            state.referCode = null;
            state.name = '';
            state.phone = '';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReferralCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReferralCode.fulfilled, (state, action) => {
                state.loading = false;
                state.referCode = action.payload.referCode;
                state.name = action.payload.name;
                state.phone = action.payload.phone;
            })
            .addCase(fetchReferralStats.fulfilled, (state, action) => {
                state.stats.totalInstalled = action.payload.totalInstalled;
                state.stats.totalEarned = action.payload.totalEarned;
            })
            .addCase(fetchReferralCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// ✅ Exports
export const { clearReferralState } = referralSlice.actions;
export default referralSlice.reducer;
