import { Wallet, ArrowDownCircle, ArrowUpCircle, Plus, Wallet2 } from "lucide-react";

export const WalletPage = () => {
  const balance = 1250.75;
  const transactions = [
    {
      id: 1,
      type: "credit",
      title: "Referral Bonus",
      amount: "+₹75",
      date: "Jul 29, 2025",
    },
    {
      id: 2,
      type: "debit",
      title: "Order #11251 Payout",
      amount: "-₹300",
      date: "Jul 28, 2025",
    },
    {
      id: 3,
      type: "credit",
      title: "Order #11250 Payout",
      amount: "+₹250",
      date: "Jul 27, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Wallet Card */}
      <div className="bg-gradient-to-r from-pink-500 to-red-400 text-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Wallet</h2>
          <Wallet2 className="w-6 h-6" />
        </div>
        <p className="text-sm">Current Balance</p>
        <h1 className="text-3xl font-bold mt-1">₹{balance.toFixed(2)}</h1>
        <div className="mt-4 flex gap-4">
          <button className="bg-white text-pink-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add Money
          </button>
          <button className="border border-white text-white px-4 py-2 rounded-lg text-sm font-medium">
            Withdraw
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <h3 className="text-md font-semibold text-gray-700 mb-2">Recent Transactions</h3>
      <div className="bg-white rounded-xl shadow-sm divide-y">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {txn.type === "credit" ? (
                <ArrowDownCircle className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowUpCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-800">{txn.title}</p>
                <p className="text-xs text-gray-500">{txn.date}</p>
              </div>
            </div>
            <p
              className={`text-sm font-semibold ${
                txn.type === "credit" ? "text-green-600" : "text-red-500"
              }`}
            >
              {txn.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
