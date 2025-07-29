import React, { useState } from 'react';
import { CheckCircle, CreditCard, Send, ScanLine, RefreshCcw, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArimartPay() {
    const [activeTab, setActiveTab] = useState('send');
    const [cardFlip, setCardFlip] = useState(false);

    return (
        <div className="bg-gradient-to-br from-[#fdf8f5] to-[#fff5f0] min-h-screen p-4 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-white">
            
                {/* Super Pay Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                    <h2 className="text-lg font-semibold mb-2">Total Cashback Earned</h2>
                    <div className="flex justify-between items-center mb-3">
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">₹7069</p>
                        <motion.a
                            whileHover={{ x: 2 }}
                            href="#"
                            className="text-blue-600 text-sm flex items-center"
                        >
                            View All <span className="ml-1">→</span>
                        </motion.a>
                    </div>

                    <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div>
                            <p className="text-sm text-gray-500">Super Pay Balance</p>
                            <p className="font-semibold text-lg">₹481</p>
                        </div>
                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div>
                            <p className="text-sm text-gray-500">Super Pay UPI</p>
                            <p className="font-semibold text-lg">9488312800@apl</p>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-black text-white rounded-xl p-4 flex justify-between items-center mb-6 shadow-lg cursor-pointer"
                    >
                        <div>
                            <p className="text-sm font-semibold">Add Money To Super Pay Balance</p>
                            <p className="text-xs text-gray-300">& Earn 1% Back Every Time</p>
                        </div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        >
                            <RefreshCcw className="w-5 h-5" />
                        </motion.div>
                    </motion.div>

                    <div className="grid grid-cols-4 gap-3 text-center">
                        {['send', 'scan', 'request', 'history'].map((tab) => (
                            <motion.div
                                key={tab}
                                whileHover={{ y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab)}
                                className={`flex flex-col items-center p-2 rounded-xl cursor-pointer transition-colors ${activeTab === tab ? 'bg-amber-100 dark:bg-amber-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                            >
                                {tab === 'send' && <Send className="w-6 h-6 mb-1 text-amber-600" />}
                                {tab === 'scan' && <ScanLine className="w-6 h-6 mb-1 text-amber-600" />}
                                {tab === 'request' && <RefreshCcw className="w-6 h-6 mb-1 text-amber-600" />}
                                {tab === 'history' && <History className="w-6 h-6 mb-1 text-amber-600" />}
                                <p className="text-xs font-medium capitalize">{tab}</p>
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="indicator"
                                        className="w-1 h-1 bg-amber-500 rounded-full mt-1"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {activeTab === 'send' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 overflow-hidden"
                            >
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    <p className="text-sm">Send money to any UPI ID or bank account</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            {/* Grid container for large screens */}
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 lg:gap-6">
                {/* Left column (top on mobile) */}
                <div className="space-y-6">

                    {/* Payment Success Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6 border border-gray-100 dark:border-gray-700"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="bg-gradient-to-r from-orange-100 to-amber-100 text-amber-500 rounded-full p-3 shadow-inner">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                        </motion.div>
                        <h2 className="text-xl font-semibold text-center">Payment Successful</h2>
                        <p className="text-sm text-center text-gray-500 mt-1">
                            Your payment of <strong className="text-amber-600">$500</strong> has been successfully completed.
                        </p>
                        <div className="mt-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <h3 className="text-sm font-medium mb-2">Payment method</h3>
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-xl border border-gray-200 dark:border-gray-600"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-1 rounded-lg shadow-sm">
                                        <img src="/amazon-pay-logo.png" alt="Amazon Pay" className="w-8 h-8 rounded" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Amazon Pay</p>
                                        <p className="text-xs text-gray-500">•••• •••• 3463 2387</p>
                                    </div>
                                </div>
                                <span className="text-amber-500 animate-pulse">●</span>
                            </motion.div>
                            <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
                                <span className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    Successful
                                </span>
                                <span>Feb 20, 2025 at 7pm</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
                {/* Card Payment Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6 border border-gray-100 dark:border-gray-700"
                >
                    <h2 className="text-lg font-semibold mb-3">Amazon Total Price</h2>
                    <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">$2,280.00</div>

                    <motion.div
                        animate={{ rotateY: cardFlip ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        onClick={() => setCardFlip(!cardFlip)}
                        className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-orange-300 dark:to-amber-300 p-5 rounded-2xl mb-4 shadow-md cursor-pointer h-48"
                    >
                        {!cardFlip ? (
                            <motion.div initial={{ opacity: 1 }} animate={{ opacity: cardFlip ? 0 : 1 }}>
                                <div className="flex justify-between items-center">
                                    <img src="/amazon-pay-logo.png" alt="Amazon Pay" className="w-12" />
                                    <CreditCard className="w-8 h-8 text-blue-600" />
                                </div>
                                <p className="mt-6 text-lg tracking-widest">•••• •••• •••• 2387</p>
                                <div className="flex justify-between mt-6">
                                    <div>
                                        <p className="text-xs text-gray-600">CARD HOLDER</p>
                                        <p className="text-sm font-medium">Evil A Evan</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">EXPIRES</p>
                                        <p className="text-sm font-medium">05/28</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, rotateY: 180 }}
                                animate={{ opacity: cardFlip ? 1 : 0 }}
                                className="absolute inset-0 p-5 flex flex-col justify-center items-center"
                            >
                                <div className="w-full h-8 bg-gray-800 mb-6 rounded"></div>
                                <div className="w-3/4 h-8 bg-gray-200 rounded flex items-center justify-end pr-2 mb-4">
                                    <span className="text-xs font-bold">CVV</span>
                                </div>
                                <div className="flex justify-between w-full">
                                    <img src="/amazon-pay-logo.png" alt="Amazon Pay" className="w-12 opacity-70" />
                                    <div className="text-xs text-gray-600">
                                        <p>SECURITY CODE</p>
                                        <p>ON BACK</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl flex items-center justify-between border border-gray-200 dark:border-gray-600">
                            <div>
                                <p className="text-sm font-medium">Amazon Pay</p>
                                <p className="text-xs text-gray-500">•••• •••• 3463 2387</p>
                            </div>
                            <span className="text-amber-500 animate-pulse">●</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                    className="p-3 rounded-xl border w-full focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }}>
                                <input
                                    type="password"
                                    placeholder="CVV"
                                    className="p-3 rounded-xl border w-full focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
                                <input
                                    type="text"
                                    placeholder="Cardholder Name"
                                    className="p-3 rounded-xl border w-full focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </motion.div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                        >
                            Pay $2,280.00
                        </motion.button>
                    </div>
                </motion.div>
</div>
        </div>
    );
}