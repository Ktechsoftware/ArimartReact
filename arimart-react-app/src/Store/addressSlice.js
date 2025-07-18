
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// 🔹 GET All Addresses
export const fetchUserAddresses = createAsyncThunk(
  "address/fetchUserAddresses",
  async (userId, thunkAPI) => {
    try {
      const response = await API.get(`/addresses/user/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
  }
);

// 🔹 GET Primary Address
export const fetchPrimaryAddress = createAsyncThunk(
  "address/fetchPrimaryAddress",
  async (userId, thunkAPI) => {
    try {
      const response = await API.get(`/addresses/primary/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Primary address not found");
    }
  }
);

// 🔹 ADD New Address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, thunkAPI) => {
    try {
      const response = await API.post(`/addresses/add`, addressData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

// 🔹 UPDATE Address
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ adId, updatedData }, thunkAPI) => {
    try {
      const response = await API.put(`/addresses/update/${adId}`, updatedData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

// 🔹 DELETE Address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (adId, thunkAPI) => {
    try {
      const response = await API.delete(`/addresses/delete/${adId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
  }
);

// 🔹 SET Primary Address
export const setPrimaryAddress = createAsyncThunk(
  "address/setPrimaryAddress",
  async (adId, thunkAPI) => {
    try {
      const response = await API.put(`/addresses/set-primary/${adId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to set primary address");
    }
  }
);

// 🔹 Initial State
const initialState = {
  addresses: [],
  primaryAddress: null,
  loading: false,
  addLoading: false,
  updateLoading: false,
  deleteLoading: false,
  setPrimaryLoading: false,
  error: null,
  successMessage: null,
};

// 🔹 Slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch primary address
      .addCase(fetchPrimaryAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrimaryAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.primaryAddress = action.payload;
      })
      .addCase(fetchPrimaryAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add address
      .addCase(addAddress.pending, (state) => {
        state.addLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addLoading = false;
        state.successMessage = action.payload.message || "Address added successfully";
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.payload;
      })

      // Update address
      .addCase(updateAddress.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.successMessage = action.payload.message || "Address updated successfully";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.successMessage = action.payload.message || "Address deleted successfully";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Set primary address
      .addCase(setPrimaryAddress.pending, (state) => {
        state.setPrimaryLoading = true;
        state.error = null;
      })
      .addCase(setPrimaryAddress.fulfilled, (state, action) => {
        state.setPrimaryLoading = false;
        state.successMessage = action.payload.message || "Primary address set successfully";
      })
      .addCase(setPrimaryAddress.rejected, (state, action) => {
        state.setPrimaryLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddressState } = addressSlice.actions;
export default addressSlice.reducer;