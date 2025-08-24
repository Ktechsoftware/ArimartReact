import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api'

// Get wallet by partner ID
export const getWallet = createAsyncThunk(
  'deliveryWallet/getWallet',
  async (partnerId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/DeliveryWallet/${partnerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wallet'
      );
    }
  }
);

// Deposit amount
export const depositAmount = createAsyncThunk(
  'deliveryWallet/depositAmount',
  async ({ partnerId, depositData }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/DeliveryWallet/${partnerId}/deposit`, depositData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to deposit amount'
      );
    }
  }
);

// Get transactions with pagination
export const getTransactions = createAsyncThunk(
  'deliveryWallet/getTransactions',
  async ({ partnerId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await API.get(
        `/DeliveryWallet/${partnerId}/transactions?page=${page}&pageSize=${pageSize}`
      );
      return {
        transactions: response.data,
        page,
        pageSize,
        hasMore: response.data.length === pageSize
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transactions'
      );
    }
  }
);

// Request withdrawal
export const requestWithdrawal = createAsyncThunk(
  'deliveryWallet/requestWithdrawal',
  async ({ partnerId, withdrawalData }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/DeliveryWallet/${partnerId}/withdraw`, withdrawalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to request withdrawal'
      );
    }
  }
);

// Get withdrawal by ID
export const getWithdrawal = createAsyncThunk(
  'deliveryWallet/getWithdrawal',
  async (withdrawalId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/DeliveryWallet/withdrawal/${withdrawalId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch withdrawal'
      );
    }
  }
);

// Refresh wallet
export const refreshWallet = createAsyncThunk(
  'deliveryWallet/refreshWallet',
  async (partnerId, { rejectWithValue }) => {
    try {
      const response = await API.put(`/DeliveryWallet/refresh/${partnerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to refresh wallet'
      );
    }
  }
);

// Initial state
const initialState = {
  // Wallet data
  wallet: null,
  
  // Transactions
  transactions: [],
  transactionsPagination: {
    page: 1,
    pageSize: 10,
    hasMore: false
  },
  
  // Withdrawals
  withdrawals: [],
  currentWithdrawal: null,
  
  // Loading states
  loading: {
    wallet: false,
    transactions: false,
    deposit: false,
    withdrawal: false,
    refresh: false
  },
  
  // Error states
  errors: {
    wallet: null,
    transactions: null,
    deposit: null,
    withdrawal: null,
    refresh: null
  },
  
  // Success states
  success: {
    deposit: false,
    withdrawal: false,
    refresh: false
  }
};

// Delivery Wallet Slice
const deliveryWalletSlice = createSlice({
  name: 'deliveryWallet',
  initialState,
  reducers: {
    // Clear errors
    clearErrors: (state) => {
      state.errors = {
        wallet: null,
        transactions: null,
        deposit: null,
        withdrawal: null,
        refresh: null
      };
    },
    
    // Clear success states
    clearSuccess: (state) => {
      state.success = {
        deposit: false,
        withdrawal: false,
        refresh: false
      };
    },
    
    // Reset transactions (useful for changing partner)
    resetTransactions: (state) => {
      state.transactions = [];
      state.transactionsPagination = {
        page: 1,
        pageSize: 10,
        hasMore: false
      };
    },
    
    // Add new transaction to the list (for real-time updates)
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    
    // Update transaction status (for real-time updates)
    updateTransactionStatus: (state, action) => {
      const { transactionId, status, completedAt } = action.payload;
      const transaction = state.transactions.find(t => t.id === transactionId);
      if (transaction) {
        transaction.status = status;
        if (completedAt) {
          transaction.completedAt = completedAt;
        }
      }
    }
  },
  
  extraReducers: (builder) => {
    // Get Wallet
    builder
      .addCase(getWallet.pending, (state) => {
        state.loading.wallet = true;
        state.errors.wallet = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.loading.wallet = false;
        state.wallet = action.payload;
        state.errors.wallet = null;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading.wallet = false;
        state.errors.wallet = action.payload;
      });
    
    // Deposit Amount
    builder
      .addCase(depositAmount.pending, (state) => {
        state.loading.deposit = true;
        state.errors.deposit = null;
        state.success.deposit = false;
      })
      .addCase(depositAmount.fulfilled, (state, action) => {
        state.loading.deposit = false;
        state.wallet = action.payload;
        state.success.deposit = true;
        state.errors.deposit = null;
      })
      .addCase(depositAmount.rejected, (state, action) => {
        state.loading.deposit = false;
        state.errors.deposit = action.payload;
        state.success.deposit = false;
      });
    
    // Get Transactions
    builder
      .addCase(getTransactions.pending, (state) => {
        state.loading.transactions = true;
        state.errors.transactions = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading.transactions = false;
        const { transactions, page, hasMore } = action.payload;
        
        if (page === 1) {
          state.transactions = transactions;
        } else {
          state.transactions = [...state.transactions, ...transactions];
        }
        
        state.transactionsPagination = {
          page,
          pageSize: action.payload.pageSize,
          hasMore
        };
        state.errors.transactions = null;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading.transactions = false;
        state.errors.transactions = action.payload;
      });
    
    // Request Withdrawal
    builder
      .addCase(requestWithdrawal.pending, (state) => {
        state.loading.withdrawal = true;
        state.errors.withdrawal = null;
        state.success.withdrawal = false;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.loading.withdrawal = false;
        state.withdrawals.unshift(action.payload);
        state.success.withdrawal = true;
        state.errors.withdrawal = null;
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.loading.withdrawal = false;
        state.errors.withdrawal = action.payload;
        state.success.withdrawal = false;
      });
    
    // Get Withdrawal
    builder
      .addCase(getWithdrawal.pending, (state) => {
        state.loading.withdrawal = true;
        state.errors.withdrawal = null;
      })
      .addCase(getWithdrawal.fulfilled, (state, action) => {
        state.loading.withdrawal = false;
        state.currentWithdrawal = action.payload;
        state.errors.withdrawal = null;
      })
      .addCase(getWithdrawal.rejected, (state, action) => {
        state.loading.withdrawal = false;
        state.errors.withdrawal = action.payload;
      });
    
    // Refresh Wallet
    builder
      .addCase(refreshWallet.pending, (state) => {
        state.loading.refresh = true;
        state.errors.refresh = null;
        state.success.refresh = false;
      })
      .addCase(refreshWallet.fulfilled, (state, action) => {
        state.loading.refresh = false;
        state.wallet = action.payload;
        state.success.refresh = true;
        state.errors.refresh = null;
      })
      .addCase(refreshWallet.rejected, (state, action) => {
        state.loading.refresh = false;
        state.errors.refresh = action.payload;
        state.success.refresh = false;
      });
  }
});

// Export actions
export const {
  clearErrors,
  clearSuccess,
  resetTransactions,
  addTransaction,
  updateTransactionStatus
} = deliveryWalletSlice.actions;

// Selectors
export const selectWallet = (state) => state.deliveryWallet.wallet;
export const selectTransactions = (state) => state.deliveryWallet.transactions;
export const selectTransactionsPagination = (state) => state.deliveryWallet.transactionsPagination;
export const selectWithdrawals = (state) => state.deliveryWallet.withdrawals;
export const selectCurrentWithdrawal = (state) => state.deliveryWallet.currentWithdrawal;

// Loading selectors
export const selectWalletLoading = (state) => state.deliveryWallet.loading.wallet;
export const selectTransactionsLoading = (state) => state.deliveryWallet.loading.transactions;
export const selectDepositLoading = (state) => state.deliveryWallet.loading.deposit;
export const selectWithdrawalLoading = (state) => state.deliveryWallet.loading.withdrawal;
export const selectRefreshLoading = (state) => state.deliveryWallet.loading.refresh;

// Error selectors
export const selectWalletError = (state) => state.deliveryWallet.errors.wallet;
export const selectTransactionsError = (state) => state.deliveryWallet.errors.transactions;
export const selectDepositError = (state) => state.deliveryWallet.errors.deposit;
export const selectWithdrawalError = (state) => state.deliveryWallet.errors.withdrawal;
export const selectRefreshError = (state) => state.deliveryWallet.errors.refresh;

// Success selectors
export const selectDepositSuccess = (state) => state.deliveryWallet.success.deposit;
export const selectWithdrawalSuccess = (state) => state.deliveryWallet.success.withdrawal;
export const selectRefreshSuccess = (state) => state.deliveryWallet.success.refresh;

// Computed selectors
export const selectWalletBalance = (state) => state.deliveryWallet.wallet?.balance || 0;
export const selectTotalEarnings = (state) => state.deliveryWallet.wallet?.totalEarnings || 0;
export const selectWeeklyEarnings = (state) => state.deliveryWallet.wallet?.weeklyEarnings || 0;
export const selectMonthlyEarnings = (state) => state.deliveryWallet.wallet?.monthlyEarnings || 0;

// Transaction type filters
export const selectCreditTransactions = (state) => 
  state.deliveryWallet.transactions.filter(t => t.type === 'Credit');

export const selectDebitTransactions = (state) => 
  state.deliveryWallet.transactions.filter(t => t.type === 'Debit');

export const selectPendingTransactions = (state) => 
  state.deliveryWallet.transactions.filter(t => t.status === 'Pending');

export const selectCompletedTransactions = (state) => 
  state.deliveryWallet.transactions.filter(t => t.status === 'Completed');

// Export reducer
export default deliveryWalletSlice.reducer;