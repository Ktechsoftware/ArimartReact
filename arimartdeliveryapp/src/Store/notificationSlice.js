// src/Store/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api"; // Axios instance with API key and token

// 🔁 Thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async ({ page = 1, pageSize = 10 }, thunkAPI) => {
    const response = await API.get(`/notifications?page=${page}&pageSize=${pageSize}`);
    console.log(response.data.data)
    return response.data.data;
  }
);
export const createNotification = createAsyncThunk(
  "notifications/create",
  async (notificationData, thunkAPI) => {
    const response = await API.post(`/notifications`, notificationData);
    return response.data.data;
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id) => {
    const response = await API.put(`/notifications/${id}/read`);
    return { id, success: response.data.success };
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async () => {
    const response = await API.put(`/notifications/mark-all-read`);
    return response.data.success;
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id) => {
    await API.delete(`/notifications/${id}`);
    return id;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/unreadCount",
  async () => {
    const response = await API.get(`/notifications/unread-count`);
    return response.data.data;
  }
);

// 🧠 Slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    unreadCount: 0,
    loading: false,
    error: null
  },
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const isNextPage = action.meta.arg.page > 1;
        if (isNextPage) {
          state.list = [...state.list, ...action.payload.notifications];
        } else {
          state.list = action.payload.notifications;
        }
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.list.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.list[index].read = true;
          state.unreadCount = Math.max(state.unreadCount - 1, 0);
        }
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.unreadCount += 1;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.list = state.list.map(n => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.list = state.list.filter(n => n.id !== action.payload);
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  }
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
