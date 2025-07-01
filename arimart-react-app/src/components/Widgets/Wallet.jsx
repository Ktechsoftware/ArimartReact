import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeftRight, ArrowDown, ChevronRight, Share2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletBalance } from '../../Store/walletSlice';
import { useEffect } from 'react';


export default function Wallet() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData.userId) {
      dispatch(fetchWalletBalance(userData.userId));
    }
  }, [userData]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto min-h-screen p-4"
    >
      {/* Wallet Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            <img
              src="https://via.placeholder.com/32"
              alt="profile"
              className="w-10 h-10 rounded-full border-2 border-green-400 dark:border-green-500"
            />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">mywallet.arimart</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Personal Wallet</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
        >
          <Share2 size={14} /> Share
        </motion.button>
      </motion.div>
      {/* Wallet Balance */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-500 dark:to-green-600 p-6 rounded-2xl shadow-lg mb-6"
      >
        <p className="text-sm text-gray-600 dark:text-white/90">Total balance</p>
        <motion.h2
          className="text-4xl font-bold tracking-tight text-green-800 mt-1"
          whileHover={{ scale: 1.01 }}
        >
          ₹{userData.walletBalance || "0.00"}
        </motion.h2>
        <p className="text-xs text-right text-gray-600 mt-2 dark:text-white/80">Updated just now</p>
      </motion.div>

      {/* Wallet Actions */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { icon: <ArrowUpRight size={20} />, label: "Send" },
          { icon: <ArrowLeftRight size={20} />, label: "Convert" },
          { icon: <ArrowDown size={20} />, label: "Deposit" }
        ].map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 dark:text-green-400 mb-2">
              {action.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Assets List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-1">My Assets</h3>

        {/* Cashback Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Cashback Balance</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Can be used on next order</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-500 dark:text-green-400">₹520.00</span>
            <ChevronRight className="text-gray-400" size={18} />
          </div>
        </motion.div>

        {/* Grocery Wallet Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-lg">🛒</span>
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Grocery Wallet</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Main balance for shopping</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-500 dark:text-blue-400">₹20.43</span>
            <ChevronRight className="text-gray-400" size={18} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}