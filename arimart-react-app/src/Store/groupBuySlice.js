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
    return { gid, data: res.data };
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

// ✅ ENHANCED: Store members by GID
export const fetchGroupMembers = createAsyncThunk("group/fetchMembers", async (groupId, thunkAPI) => {
  try {
    const res = await API.get(`/group/members/${groupId}`);
    return { groupId, members: res.data };
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

// ✅ ENHANCED: Store refer codes by GID
export const fetchGroupReferCodeById = createAsyncThunk("group/fetchReferCodeById", async (id, thunkAPI) => {
  try {
    const res = await API.get(`/group/refercode/${id}`);
    return { gid: id, referCode: res.data };
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

export const fetchCurrentRunningGroups = createAsyncThunk(
  "group/fetchCurrentRunning",
  async ({ page = 1, pageSize = 10, append = false } = {}, thunkAPI) => {
    try {
      const res = await API.get(`/group/current-running`, {
        params: { page, pageSize }
      });
      return { ...res.data, append };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch current running groups");
    }
  }
);
export const fetchGroupStatus = createAsyncThunk("group/fetchStatus", async (gid, thunkAPI) => {
  try {
    const res = await API.get(`/group/status-short/${gid}`);
    return { gid, status: res.data };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch group status");
  }
});


export const fetchGroupByReferCode = createAsyncThunk(
  "group/fetchByReferCode",
  async (referCode, thunkAPI) => {
    try {
      const res = await API.get(`/group/by-refercode/${referCode}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch group by refer code");
    }
  }
);


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
    lastFetchedReferGid: null,

    // Success states
    createSuccess: false,
    joinSuccess: false,
    leaveSuccess: false,

    // Error state
    error: null,

    // Data
    allGroups: [],
    groupsById: {},
    statusByGid: {},
    membersByGid: {},
    referCodesByGid: {},
    loadingStatesByGid: {},
    currentRunningGroups: [],
    // ✅ NEW: Add pagination data for current running groups
    currentRunningGroupsPagination: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    },
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
      state.lastFetchedReferGid = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current group
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },

    // ✅ NEW: Reset current running groups pagination
    resetCurrentRunningGroupsPagination: (state) => {
      state.currentRunningGroups = [];
      state.currentRunningGroupsPagination = {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      };
    },

    // ✅ ENHANCED: Clear specific group members
    clearGroupMembers: (state, action) => {
      const gid = action.payload;
      if (gid && state.membersByGid[gid]) {
        delete state.membersByGid[gid];
      }
    },

    // ✅ ENHANCED: Clear specific group refer code
    clearGroupReferCode: (state, action) => {
      const gid = action.payload;
      if (gid && state.referCodesByGid[gid]) {
        delete state.referCodesByGid[gid];
      }
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

    // ✅ ENHANCED: Fetch group by ID
    builder
      .addCase(fetchGroupById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        const { gid, data } = action.payload;
        state.isLoading = false;
        if (gid && data) {
          state.groupsById[gid] = data;
        }
      })
     .addCase(fetchGroupById.rejected, (state, action) => {
    state.isLoading = false;
    // Fix this line:
    state.error = action.payload?.message || action.payload?.title || action.payload || action.error?.message || "Failed to fetch group";
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

        // Auto-join: Add to myJoinedGroups
        if (state.myJoinedGroups && action.payload) {
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
    state.error = action.payload?.message || action.payload?.title || action.payload || action.error?.message || "Failed to create group";
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
    state.error = action.payload?.message || action.payload?.title || action.payload || action.error?.message || "Failed to join group";
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

        // Remove from myJoinedGroups
        if (state.myJoinedGroups) {
          state.myJoinedGroups = state.myJoinedGroups.filter(
            group => group.Gid !== action.payload.groupId && group.gid !== action.payload.groupId
          );
        }

        // ✅ ENHANCED: Remove from membersByGid
        if (state.membersByGid[action.payload.groupId]) {
          state.membersByGid[action.payload.groupId] = state.membersByGid[action.payload.groupId].filter(
            member => member.userid !== action.payload.userId && member.Userid !== action.payload.userId
          );
        }
      })
     .addCase(leaveGroup.rejected, (state, action) => {
    state.isLeaving = false;
    state.leaveSuccess = false;
    state.error = action.payload?.message || action.payload?.title || action.payload || action.error?.message || "Failed to leave group";
})

    // ✅ ENHANCED: Fetch group members by GID
    builder
      .addCase(fetchGroupMembers.pending, (state, action) => {
        state.isLoadingMembers = true;
        state.error = null;

        // Set loading state for specific GID
        const gid = action.meta.arg;
        if (!state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid] = {};
        }
        state.loadingStatesByGid[gid].isLoadingMembers = true;
      })
      .addCase(fetchGroupMembers.fulfilled, (state, action) => {
        const { groupId, members } = action.payload;
        state.isLoadingMembers = false;

        // Store members by GID
        state.membersByGid[groupId] = members;

        // Clear loading state for specific GID
        if (state.loadingStatesByGid[groupId]) {
          state.loadingStatesByGid[groupId].isLoadingMembers = false;
        }
      })
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.isLoadingMembers = false;
        state.error = action.payload;

        // Clear loading state for specific GID
        const gid = action.meta.arg;
        if (state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid].isLoadingMembers = false;
        }
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

    // ✅ ENHANCED: Fetch group refer code by ID
    builder
      .addCase(fetchGroupReferCodeById.pending, (state, action) => {
        state.isLoadingReferCodes = true;
        state.error = null;

        // Set loading state for specific GID
        const gid = action.meta.arg;
        if (!state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid] = {};
        }
        state.loadingStatesByGid[gid].isLoadingReferCode = true;
      })
      .addCase(fetchGroupReferCodeById.fulfilled, (state, action) => {
        const { gid, referCode } = action.payload;
        state.isLoadingReferCodes = false;

        // Store refer code by GID
        state.referCodesByGid[gid] = referCode;

        // Clear loading state for specific GID
        if (state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid].isLoadingReferCode = false;
        }
      })
      .addCase(fetchGroupReferCodeById.rejected, (state, action) => {
        state.isLoadingReferCodes = false;
        state.error = action.payload;

        // Clear loading state for specific GID
        const gid = action.meta.arg;
        if (state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid].isLoadingReferCode = false;
        }
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
    // for current running groups
    builder
      .addCase(fetchCurrentRunningGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentRunningGroups.fulfilled, (state, action) => {
        state.isLoading = false;

        const { append } = action.payload;

        // Handle both paginated and non-paginated responses
        if (action.payload.data && action.payload.pagination) {
          // Paginated response
          if (append) {
            // Append new data to existing data (Load More)
            const existingIds = new Set(state.currentRunningGroups.map(group =>
              group.gid || group.Gid || group.id
            ));

            // Filter out duplicates and append new items
            const newItems = action.payload.data.filter(group =>
              !existingIds.has(group.gid || group.Gid || group.id)
            );

            state.currentRunningGroups = [...state.currentRunningGroups, ...newItems];
          } else {
            // Replace data (Initial load or refresh)
            state.currentRunningGroups = action.payload.data;
          }

          state.currentRunningGroupsPagination = action.payload.pagination;
        } else if (Array.isArray(action.payload)) {
          // Non-paginated response (backward compatibility)
          if (append) {
            // For non-paginated responses, we don't append in load more scenarios
            state.currentRunningGroups = action.payload;
          } else {
            state.currentRunningGroups = action.payload;
          }

          state.currentRunningGroupsPagination = {
            currentPage: 1,
            pageSize: action.payload.length,
            totalCount: action.payload.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false
          };
        } else {
          // Fallback
          if (!append) {
            state.currentRunningGroups = [];
          }
        }
      })
      .addCase(fetchCurrentRunningGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // ✅ Fetch group status by GID
    builder
      .addCase(fetchGroupStatus.pending, (state, action) => {
        const gid = action.meta.arg;
        if (!state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid] = {};
        }
        state.loadingStatesByGid[gid].isLoadingStatus = true;
      })
      .addCase(fetchGroupStatus.fulfilled, (state, action) => {
        const { gid, status } = action.payload;
        state.statusByGid[gid] = status;

        if (state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid].isLoadingStatus = false;
        }
      })
      .addCase(fetchGroupStatus.rejected, (state, action) => {
        const gid = action.meta.arg;
        if (state.loadingStatesByGid[gid]) {
          state.loadingStatesByGid[gid].isLoadingStatus = false;
        }
        state.error = action.payload;
      });
    // Fetch group by refer code
    builder
      .addCase(fetchGroupByReferCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupByReferCode.fulfilled, (state, action) => {
        state.isLoading = false;

        const { gid, STATUS } = action.payload || {};

        // Optional: set last fetched refer GID or status
        if (STATUS === 1 && gid) {
          state.lastFetchedReferGid = gid;
        }
      })
      .addCase(fetchGroupByReferCode.rejected, (state, action) => {
        state.isLoading = false;
      });

  },
});

export const {
  resetGroupState,
  clearError,
  clearCurrentGroup,
  clearGroupMembers,
  clearGroupReferCode,
  resetSuccessFlags,
  resetCurrentRunningGroupsPagination
} = groupSlice.actions;

export default groupSlice.reducer;