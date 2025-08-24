import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Plus, 
  TrendingUp,
  Eye,
  EyeOff,
  MoreVertical,
  Download,
  RefreshCw,
  Loader2
} from "lucide-react";

// Import Redux actions and selectors
import {
  getWallet,
  getTransactions,
  refreshWallet,
  requestWithdrawal,
  clearErrors,
  clearSuccess,
  selectWallet,
  selectTransactions,
  selectTransactionsPagination,
  selectWalletLoading,
  selectTransactionsLoading,
  selectRefreshLoading,
  selectWithdrawalLoading,
  selectWalletError,
  selectWithdrawalError,
  selectWalletBalance,
  selectTotalEarnings,
  selectWeeklyEarnings,
  selectMonthlyEarnings,
  selectWithdrawalSuccess
} from '../../Store/deliveryWalletSlice';
import { useAuth } from "../../hooks/useAuth";

export const WalletPage = () => { 
  const dispatch = useDispatch();
  const { user, userId } = useAuth();
  const partnerId = userId;
  // Redux selectors
  const wallet = useSelector(selectWallet);
  const transactions = useSelector(selectTransactions);
  const pagination = useSelector(selectTransactionsPagination);
  
  // Loading states
  const walletLoading = useSelector(selectWalletLoading);
  const transactionsLoading = useSelector(selectTransactionsLoading);
  const refreshLoading = useSelector(selectRefreshLoading);
  const withdrawalLoading = useSelector(selectWithdrawalLoading);
  
  // Error states
  const walletError = useSelector(selectWalletError);
  const withdrawalError = useSelector(selectWithdrawalError);
  
  // Success states
  const withdrawalSuccess = useSelector(selectWithdrawalSuccess);
  
  // Wallet data
  const balance = useSelector(selectWalletBalance);
  const totalEarnings = useSelector(selectTotalEarnings);
  const weeklyEarnings = useSelector(selectWeeklyEarnings);
  const monthlyEarnings = useSelector(selectMonthlyEarnings);
  
  // Local state
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    method: 'UPI',
    accountNumber: '',
    ifscCode: '',
    upiId: ''
  });

  // Calculate stats
  const stats = [
    { 
      label: "This Week", 
      value: `₹${(weeklyEarnings || 0).toFixed(0)}`, 
      trend: "+12%" 
    },
    { 
      label: "This Month", 
      value: `₹${(monthlyEarnings || 0).toFixed(0)}`, 
      trend: "+8%" 
    },
    { 
      label: "Total Earned", 
      value: `₹${(totalEarnings || 0).toFixed(0)}`, 
      trend: "+15%" 
    }
  ];

  // Effects
  useEffect(() => {
    if (partnerId) {
      dispatch(getWallet(partnerId));
      dispatch(getTransactions({ partnerId, page: 1, pageSize: 10 }));
    }
  }, [dispatch, partnerId]);

  useEffect(() => {
    if (withdrawalSuccess) {
      setShowWithdrawalModal(false);
      setWithdrawalForm({
        amount: '',
        method: 'UPI',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
      });
      dispatch(clearSuccess());
      // Refresh wallet data after successful withdrawal
      dispatch(getWallet(partnerId));
    }
  }, [withdrawalSuccess, dispatch, partnerId]);

  // Handlers
  const handleRefresh = () => {
    dispatch(refreshWallet(partnerId));
    dispatch(getTransactions({ partnerId, page: 1, pageSize: 10 }));
  };

  const handleWithdraw = () => {
    if (!withdrawalForm.amount) return;
    
    const withdrawalData = {
      amount: parseFloat(withdrawalForm.amount),
      method: withdrawalForm.method,
      ...(withdrawalForm.method === 'BankTransfer' && {
        accountNumber: withdrawalForm.accountNumber,
        ifscCode: withdrawalForm.ifscCode
      }),
      ...(withdrawalForm.method === 'UPI' && {
        upiId: withdrawalForm.upiId
      })
    };

    dispatch(requestWithdrawal({ partnerId, withdrawalData }));
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !transactionsLoading) {
      dispatch(getTransactions({ 
        partnerId, 
        page: pagination.page + 1, 
        pageSize: pagination.pageSize 
      }));
    }
  };

  // Format transaction data for display
  const formatTransactions = (transactions) => {
    return transactions.map(txn => ({
      id: txn.id,
      type: txn.type.toLowerCase(),
      title: txn.title,
      description: txn.description || 'No description',
      amount: Math.abs(txn.amount),
      date: new Date(txn.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      time: new Date(txn.createdAt).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }),
      status: txn.status.toLowerCase(),
      referenceNumber: txn.referenceNumber
    }));
  };

  const displayTransactions = formatTransactions(transactions);

  // Loading state
  if (walletLoading && !wallet) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (walletError && !wallet) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{walletError}</p>
          <button 
            onClick={() => dispatch(getWallet(partnerId))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Wallet</h1>
            <p className="text-sm text-slate-600">Manage your earnings</p>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20"></div>
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white/90 text-sm font-medium">Total Balance</h2>
                    <p className="text-white/70 text-xs">Available to withdraw</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {showBalance ? 
                    <Eye className="w-5 h-5 text-white/80" /> : 
                    <EyeOff className="w-5 h-5 text-white/80" />
                  }
                </button>
              </div>

              <div className="mb-6">
                <h1 className="text-4xl font-bold text-white mb-1">
                  {showBalance ? `₹${(balance || 0).toLocaleString()}` : "₹••••••"}
                </h1>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium">
                    {weeklyEarnings > 0 ? "+18% from last week" : "Start earning now"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowWithdrawalModal(true)}
                  disabled={!balance || balance <= 0}
                  className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {withdrawalLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Withdraw
                </button>
                <button 
                  onClick={handleRefresh}
                  disabled={refreshLoading}
                  className="flex-1 bg-white/20 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-colors backdrop-blur disabled:opacity-50"
                >
                  {refreshLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 border border-slate-200">
              <p className="text-xs font-medium text-slate-600 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 mb-1">{stat.value}</p>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-green-600">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <button 
              onClick={handleLoadMore}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
              disabled={!pagination.hasMore || transactionsLoading}
            >
              {transactionsLoading ? 'Loading...' : pagination.hasMore ? 'Load More' : 'View All'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {displayTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500">No transactions yet</p>
              </div>
            ) : (
              displayTransactions.map((txn) => (
                <div key={txn.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      txn.type === "credit" 
                        ? "bg-green-100" 
                        : "bg-red-100"
                    }`}>
                      {txn.type === "credit" ? (
                        <ArrowDownCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowUpCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{txn.title}</p>
                      <p className="text-xs text-slate-600 truncate">{txn.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{txn.date} • {txn.time}</p>
                    </div>

                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        txn.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}>
                        {txn.type === "credit" ? "+" : "-"}₹{Math.abs(txn.amount).toFixed(0)}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          txn.status === 'completed' ? 'bg-green-500' : 
                          txn.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-slate-500 capitalize">{txn.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                setWithdrawalForm(prev => ({ ...prev, method: 'BankTransfer' }));
                setShowWithdrawalModal(true);
              }}
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 text-sm">Bank Transfer</p>
                <p className="text-xs text-slate-600">Free • 1-2 days</p>
              </div>
            </button>
            
            <button 
              onClick={() => {
                setWithdrawalForm(prev => ({ ...prev, method: 'UPI' }));
                setShowWithdrawalModal(true);
              }}
              className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 text-sm">UPI Transfer</p>
                <p className="text-xs text-slate-600">₹2 fee • Instant</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Withdraw Funds</h3>
            
            {withdrawalError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{withdrawalError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount (Available: ₹{balance})
                </label>
                <input
                  type="number"
                  value={withdrawalForm.amount}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                  max={balance}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Method</label>
                <select
                  value={withdrawalForm.method}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="UPI">UPI (₹2 fee • Instant)</option>
                  <option value="BankTransfer">Bank Transfer (Free • 1-2 days)</option>
                </select>
              </div>

              {withdrawalForm.method === 'BankTransfer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={withdrawalForm.accountNumber}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={withdrawalForm.ifscCode}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, ifscCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </>
              )}

              {withdrawalForm.method === 'UPI' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={withdrawalForm.upiId}
                    onChange={(e) => setWithdrawalForm(prev => ({ ...prev, upiId: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter UPI ID"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                disabled={withdrawalLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={withdrawalLoading || !withdrawalForm.amount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {withdrawalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};