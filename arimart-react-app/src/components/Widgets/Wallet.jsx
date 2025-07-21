import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeftRight, ArrowDown, ChevronRight, Share2, GroupIcon, UserCheck, UserCheck2Icon, Wallet2Icon, UserCircle2Icon, Loader } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { combineSlices } from "@reduxjs/toolkit";
import { fetchWalletBalance } from "../../Store/walletSlice";


export default function Wallet() {
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const { balance, walletAmount, referAmount, loading } = useSelector(state => state.wallet);
  useEffect(() => {
    if (userData.id) {
      dispatch(fetchWalletBalance(userData.id));
    }
  }, [userData, dispatch]);

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
            <UserCircle2Icon className="w-7 h-7" />
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
          {loading ? (
            <span className="inline-flex items-center justify-center h-6 align-middle">
              <Loader className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-300" />
            </span>
          ) : (
            `₹${balance || "0.00"}`
          )}
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
              <UserCheck2Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Referal Balance</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Can be used on next order</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-500 dark:text-green-400">₹
              {loading ? (
                <span className="inline-flex items-center justify-center h-6 align-middle">
                  <Loader className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-300" />
                </span>
              ) : (
                referAmount || "0.00"
              )}</span>
            <ChevronRight className="text-gray-400" size={18} />
          </div>
        </motion.div>
        {/* Cashback Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <Wallet2Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Wallet Balance</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Can be used on next order</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-500 dark:text-green-400">₹
              {loading ? (
                <span className="inline-flex items-center justify-center h-6 align-middle">
                  <Loader className="w-6 h-6 animate-spin text-gray-500 dark:text-gray-300" />
                </span>
              ) : (
                walletAmount || "0.00"
              )}</span>
            <ChevronRight className="text-gray-400" size={18} />
          </div>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-sm shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">Wallet Terms</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Use only on Arimart platform</li>
            <li>Non-transferable & non-refundable</li>
            <li>Refunds go to wallet if prepaid</li>
            <li>Promos may expire if unused</li>
            <li>Max cap applies (₹10,000)</li>
            <li>KYC may be required for full use</li>
            <li>Inactive wallets may be paused</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}