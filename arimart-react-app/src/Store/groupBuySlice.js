import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// ---------------------- ASYNC THUNKS ----------------------

export const fetchAllGroups = createAsyncThunk("group/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await API.get(`/group/all`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch groups");
  }
});

export const fetchGroupById = createAsyncThunk("group/fetchById", async (gid, thunkAPI) => {
  try {
    const res = await API.get(`/group/${gid}`);
    // console.log(res.data)
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch group");
  }
});

export const createGroup = createAsyncThunk("group/create", async (groupData, thunkAPI) => {
  try {
    const res = await API.post(`/group/create`, groupData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to create group");
  }
});

export const joinGroup = createAsyncThunk("group/join", async (joinData, thunkAPI) => {
  try {
    const res = await API.post(`/group/join`, joinData);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to join group");
  }
});

export const leaveGroup = createAsyncThunk("group/leave", async ({ groupId, userId }, thunkAPI) => {
  try {
    const res = await API.delete(`/group/leave`, {
      params: { groupId, userId },
    });
    return { groupId, userId, message: res.data };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to leave group");
  }
});

export const fetchGroupMembers = createAsyncThunk("group/fetchMembers", async (groupId, thunkAPI) => {
  try {
    const res = await API.get(`/group/members/${groupId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch members");
  }
});

export const fetchMyJoinedGroups = createAsyncThunk("group/fetchMyJoined", async (userId, thunkAPI) => {
  try {
    const res = await API.get(`/group/my-joined/${userId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch joined groups");
  }
});

export const fetchAllGroupReferCodes = createAsyncThunk("group/fetchAllReferCodes", async (_, thunkAPI) => {
  try {
    const res = await API.get(`/group/refercode`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch refer codes");
  }
});

export const fetchGroupReferCodeById = createAsyncThunk("group/fetchReferCodeById", async (id, thunkAPI) => {
  try {
    const res = await API.get(`/group/refercode/${id}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch refer code");
  }
});

export const fetchGroupReferCodeByProduct = createAsyncThunk("group/fetchReferCodeByProduct", async ({ pid, pdid }, thunkAPI) => {
  try {
    const res = await API.get(`/group/grouprefercode/by-product/${pid}/${pdid}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch refer code");
  }
});


// ---------------------- SLICE ----------------------

const groupSlice = createSlice({
  name: "group",
  initialState: {
    // Loading states
    isLoading: false,
    isCreating: false,
    isJoining: false,
    isLeaving: false,
    isLoadingMembers: false,
    isLoadingMyGroups: false,
    isLoadingReferCodes: false,

    // Success states
    createSuccess: false,
    joinSuccess: false,
    leaveSuccess: false,

    // Error state
    error: null,

    // Data
    allGroups: [],
    groupsById: {}, // 👈 key = gid
    groupMembers: [],
    myJoinedGroups: [],
    allReferCodes: [],
    currentReferCode: null,

    // Last actions
    lastCreatedGroup: null,
    lastJoinedGroup: null,
    lastLeftGroup: null,
  },
  reducers: {
    // Reset all states
    resetGroupState: (state) => {
      state.isLoading = false;
      state.isCreating = false;
      state.isJoining = false;
      state.isLeaving = false;
      state.isLoadingMembers = false;
      state.isLoadingMyGroups = false;
      state.isLoadingReferCodes = false;
      state.createSuccess = false;
      state.joinSuccess = false;
      state.leaveSuccess = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current group
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },

    // Clear group members
    clearGroupMembers: (state) => {
      state.groupMembers = [];
    },

    // Reset success flags
    resetSuccessFlags: (state) => {
      state.createSuccess = false;
      state.joinSuccess = false;
      state.leaveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch all groups
    builder
      .addCase(fetchAllGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allGroups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch group by ID
    builder
      .addCase(fetchGroupById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        const group = action.payload;
        state.isLoading = false;
        if (group?.gid) {
          state.groupsById[group.gid] = group; // ✅ store by gid
        }
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create group
    builder
      .addCase(createGroup.pending, (state) => {
        state.isCreating = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.isCreating = false;
        state.createSuccess = true;
        state.lastCreatedGroup = action.payload;
        
        // Add to allGroups if it exists
        if (state.allGroups) {
          state.allGroups.unshift(action.payload);
        }
        
        // Store in groupsById
        if (action.payload?.gid) {
          state.groupsById[action.payload.gid] = action.payload;
        }
        
        // Auto-join: Add to myJoinedGroups (creator automatically joins their own group)
        if (state.myJoinedGroups && action.payload) {
          // Check if group is not already in myJoinedGroups to avoid duplicates
          const isAlreadyJoined = state.myJoinedGroups.some(
            group => group.Gid === action.payload.gid || group.gid === action.payload.gid
          );
          
          if (!isAlreadyJoined) {
            state.myJoinedGroups.unshift(action.payload);
          }
        }
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isCreating = false;
        state.createSuccess = false;
        state.error = action.payload;
      });

    // Join group
    builder
      .addCase(joinGroup.pending, (state) => {
        state.isJoining = true;
        state.joinSuccess = false;
        state.error = null;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.isJoining = false;
        state.joinSuccess = true;
        state.lastJoinedGroup = action.payload;
        
        // Add to myJoinedGroups if not already there
        if (state.myJoinedGroups && action.payload) {
          const isAlreadyJoined = state.myJoinedGroups.some(
            group => group.Gid === action.payload.gid || group.gid === action.payload.gid
          );
          
          if (!isAlreadyJoined) {
            state.myJoinedGroups.unshift(action.payload);
          }
        }
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.isJoining = false;
        state.joinSuccess = false;
        state.error = action.payload;
      });

    // Leave group
    builder
      .addCase(leaveGroup.pending, (state) => {
        state.isLeaving = true;
        state.leaveSuccess = false;
        state.error = null;
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.isLeaving = false;
        state.leaveSuccess = true;
        state.lastLeftGroup = action.payload;
        // Remove from myJoinedGroups if it exists
        if (state.myJoinedGroups) {
          state.myJoinedGroups = state.myJoinedGroups.filter(
            group => group.Gid !== action.payload.groupId && group.gid !== action.payload.groupId
          );
        }
      })
      .addCase(leaveGroup.rejected, (state, action) => {
        state.isLeaving = false;
        state.leaveSuccess = false;
        state.error = action.payload;
      });

    // Fetch group members
    builder
      .addCase(fetchGroupMembers.pending, (state) => {
        state.isLoadingMembers = true;
        state.error = null;
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        state.isLoadingMembers = false;
        state.groupMembers = action.payload;
      })
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.isLoadingMembers = false;
        state.error = action.payload;
      });

    // Fetch my joined groups
    builder
      .addCase(fetchMyJoinedGroups.pending, (state) => {
        state.isLoadingMyGroups = true;
        state.error = null;
      })
      .addCase(fetchMyJoinedGroups.fulfilled, (state, action) => {
        state.isLoadingMyGroups = false;
        state.myJoinedGroups = action.payload;
      })
      .addCase(fetchMyJoinedGroups.rejected, (state, action) => {
        state.isLoadingMyGroups = false;
        state.error = action.payload;
      });

    // Fetch all group refer codes
    builder
      .addCase(fetchAllGroupReferCodes.pending, (state) => {
        state.isLoadingReferCodes = true;
        state.error = null;
      })
      .addCase(fetchAllGroupReferCodes.fulfilled, (state, action) => {
        state.isLoadingReferCodes = false;
        state.allReferCodes = action.payload;
      })
      .addCase(fetchAllGroupReferCodes.rejected, (state, action) => {
        state.isLoadingReferCodes = false;
        state.error = action.payload;
      });

    // Fetch group refer code by ID
    builder
      .addCase(fetchGroupReferCodeById.pending, (state) => {
        state.isLoadingReferCodes = true;
        state.error = null;
      })
      .addCase(fetchGroupReferCodeById.fulfilled, (state, action) => {
        state.isLoadingReferCodes = false;
        state.currentReferCode = action.payload;
      })
      .addCase(fetchGroupReferCodeById.rejected, (state, action) => {
        state.isLoadingReferCodes = false;
        state.error = action.payload;
      });

    // Fetch group refer code by product
    builder
      .addCase(fetchGroupReferCodeByProduct.pending, (state) => {
        state.isLoadingReferCodes = true;
        state.error = null;
      })
      .addCase(fetchGroupReferCodeByProduct.fulfilled, (state, action) => {
        state.isLoadingReferCodes = false;
        state.currentReferCode = action.payload;
      })
      .addCase(fetchGroupReferCodeByProduct.rejected, (state, action) => {
        state.isLoadingReferCodes = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetGroupState,
  clearError,
  clearCurrentGroup,
  clearGroupMembers,
  resetSuccessFlags
} = groupSlice.actions;

export default groupSlice.reducer;