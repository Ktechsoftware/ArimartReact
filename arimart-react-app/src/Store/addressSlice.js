import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// 🔹 GET All User Addresses
export const fetchUserAddresses = createAsyncThunk(
  "shipping/fetchUserAddresses",
  async (userId, thunkAPI) => {
    try {
      const response = await API.get(`/shipping/user/${userId}`);
      console.log("shipping data slice :", response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
    }
  }
);

// 🔹 GET Shipping Address by ID
export const getShippingById = createAsyncThunk(
  "shipping/getShippingById",
  async (id, thunkAPI) => {
    try {
      const response = await API.get(`/shipping/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Address not found");
    }
  }
);

// 🔹 ADD New Shipping Address
export const addAddress = createAsyncThunk(
  "shipping/addAddress",
  async (addressData, thunkAPI) => {
    try {
      // Map frontend data to backend TblShipping model
      const shippingData = {
        Userid: addressData.uId,
        VendorName: addressData.adName,
        ContactPerson: addressData.adType, // Store address type in ContactPerson
        Email: addressData.email || '',
        Phone: addressData.adContact,
        Address: `${addressData.adAddress1}${addressData.adAddress2 ? ', ' + addressData.adAddress2 : ''}${addressData.adLandmark ? ', Near ' + addressData.adLandmark : ''}`,
        City: addressData.adCity,
        State: addressData.adState || '',
        PostalCode: addressData.adPincode,
        Country: addressData.adCountry || 'India'
      };

      const response = await API.post(`/shipping/add`, shippingData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

// 🔹 UPDATE Shipping Address
export const updateAddress = createAsyncThunk(
  "shipping/updateAddress",
  async ({ adId, updatedData }, thunkAPI) => {
    try {
      // Map frontend data to backend TblShipping model
      const shippingData = {
        VendorName: updatedData.adName,
        ContactPerson: updatedData.adType, // Store address type in ContactPerson
        Email: updatedData.email || '',
        Phone: updatedData.adContact,
        Address: `${updatedData.adAddress1}${updatedData.adAddress2 ? ', ' + updatedData.adAddress2 : ''}${updatedData.adLandmark ? ', Near ' + updatedData.adLandmark : ''}`,
        City: updatedData.adCity,
        State: updatedData.adState || '',
        PostalCode: updatedData.adPincode,
        Country: updatedData.adCountry || 'India'
      };

      const response = await API.put(`/shipping/update/${adId}`, shippingData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

// 🔹 DELETE Shipping Address
export const deleteAddress = createAsyncThunk(
  "shipping/deleteAddress",
  async (adId, thunkAPI) => {
    try {
      const response = await API.delete(`/shipping/delete/${adId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
  }
);

// 🔹 SET Primary Address (Frontend logic since backend doesn't have primary flag)
export const setPrimaryAddress = createAsyncThunk(
  "shipping/setPrimaryAddress",
  async (adId, thunkAPI) => {
    try {
      // Since your backend doesn't have a primary flag, this is handled in frontend state only
      return { adId, message: "Primary address set successfully" };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to set primary address");
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

// 🔹 Shipping Slice
const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    clearAddressState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setPrimaryAddressLocal: (state, action) => {
      // Update primary address locally
      state.addresses = state.addresses.map(addr => ({
        ...addr,
        isPrimary: addr.adId === action.payload ? 1 : 0
      }));
      state.primaryAddress = state.addresses.find(addr => addr.adId === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all user addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend TblShipping data to frontend format
        state.addresses = action.payload.map(addr => ({
          adId: addr.id, // ✅ changed
          adName: addr.vendorName, // ✅ changed
          adType: addr.contactPerson,
          email: addr.email,
          adContact: addr.phone, // ✅ changed
          adAddress1: addr.address?.split(',')[0]?.trim() || '',
          adAddress2: addr.address?.split(',')[1]?.trim() || '',
          adLandmark: addr.address?.includes('Near ') ?
            addr.address.split('Near ')[1]?.split(',')[0]?.trim() : '',
          adCity: addr.city,
          adState: addr.state,
          adPincode: addr.postalCode,
          adCountry: addr.country,
          uId: addr.userid,
          isActive: addr.isActive,
          isDeleted: addr.isDeleted,
          addedDate: addr.addedDate,
          modifiedDate: addr.modifiedDate,
          isPrimary: 0
        }));


        // Set first address as primary if no primary exists
        if (state.addresses.length > 0 && !state.primaryAddress) {
          state.addresses[0].isPrimary = 1;
          state.primaryAddress = state.addresses[0];
        }
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get shipping by ID
      .addCase(getShippingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getShippingById.fulfilled, (state, action) => {
        state.loading = false;
        // Map single address data
        const addr = action.payload;
        state.currentAddress = {
          adId: addr.id, // ✅
          adName: addr.vendorName,
          adType: addr.contactPerson,
          email: addr.email,
          adContact: addr.phone,
          adAddress1: addr.address?.split(',')[0]?.trim() || '',
          adAddress2: addr.address?.split(',')[1]?.trim() || '',
          adLandmark: addr.address?.includes('Near ') ?
            addr.address.split('Near ')[1]?.split(',')[0]?.trim() : '',
          adCity: addr.city,
          adState: addr.state,
          adPincode: addr.postalCode,
          adCountry: addr.country,
          uId: addr.userid,
          isActive: addr.isActive,
          isDeleted: addr.isDeleted,
          addedDate: addr.addedDate,
          modifiedDate: addr.modifiedDate
        };

      })
      .addCase(getShippingById.rejected, (state, action) => {
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

        // Update primary address in state
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isPrimary: addr.adId === action.payload.adId ? 1 : 0
        }));
        state.primaryAddress = state.addresses.find(addr => addr.adId === action.payload.adId) || null;
      })
      .addCase(setPrimaryAddress.rejected, (state, action) => {
        state.setPrimaryLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearAddressState, setPrimaryAddressLocal } = shippingSlice.actions;

// Export selectors
export const selectAddresses = (state) => state.shipping?.addresses || [];
export const selectPrimaryAddress = (state) => state.shipping?.primaryAddress || null;
export const selectAddressLoading = (state) => state.shipping?.loading || false;
export const selectAddressError = (state) => state.shipping?.error || null;
export const selectSuccessMessage = (state) => state.shipping?.successMessage || null;

// Address types constant
export const ADDRESS_TYPES = [
  { value: 'Home', label: 'Home' },
  { value: 'Office', label: 'Office' },
  { value: 'Work', label: 'Work' },
  { value: 'Other', label: 'Other' }
];

// Export reducer
export default shippingSlice.reducer;