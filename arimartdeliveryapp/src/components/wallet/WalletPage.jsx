import { useState } from "react";
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
  RefreshCw
} from "lucide-react";

export const WalletPage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 1250.75;
  const weeklyEarnings = 850.50;
  
  const transactions = [
    {
      id: 1,
      type: "credit",
      title: "Delivery Payout",
      description: "Orders #11251-11255",
      amount: 425.00,
      date: "Today",
      time: "2:30 PM",
      status: "completed"
    },
    {
      id: 2,
      type: "credit", 
      title: "Bonus Payment",
      description: "Peak hour incentive",
      amount: 75.00,
      date: "Yesterday",
      time: "11:45 PM",
      status: "completed"
    },
    {
      id: 3,
      type: "debit",
      title: "Fuel Allowance",
      description: "Weekly fuel reimbursement",
      amount: -180.00,
      date: "Jul 27",
      time: "6:00 PM", 
      status: "completed"
    },
    {
      id: 4,
      type: "credit",
      title: "Delivery Payout", 
      description: "Orders #11248-11250",
      amount: 320.50,
      date: "Jul 26",
      time: "8:30 PM",
      status: "completed"
    }
  ];

  const stats = [
    { label: "This Week", value: `₹${weeklyEarnings.toFixed(0)}`, trend: "+12%" },
    { label: "Orders", value: "47", trend: "+8%" },
    { label: "Avg/Order", value: "₹18", trend: "+3%" }
  ];

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
                  {showBalance ? `₹${balance.toLocaleString()}` : "₹••••••"}
                </h1>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-300" />
                  <span className="text-green-300 text-sm font-medium">+18% from last week</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-white text-blue-700 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Withdraw
                </button>
                <button className="flex-1 bg-white/20 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-colors backdrop-blur">
                  <RefreshCw className="w-4 h-4" />
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
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {transactions.map((txn) => (
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
                      {txn.type === "credit" ? "+" : ""}₹{Math.abs(txn.amount).toFixed(0)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-slate-500 capitalize">{txn.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-slate-900 text-sm">Bank Transfer</p>
                <p className="text-xs text-slate-600">Free • 1-2 days</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
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
    </div>
  );
}