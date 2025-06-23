import { motion } from "framer-motion";
import { Share2, Copy, PlayCircle, ChevronRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ReferAndEarn() {
  const referralCode = "1575YOG81";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!"); // Fixed typo in "Referral"
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    toast.error("Failed to copy referral code");
    console.error("Failed to copy: ", err);
  }
};

  const steps = [
    {
      id: 1,
      text: "Share your reference code with your friend to install Arimart",
    },
    {
      id: 2,
      text: "Ask your friend to enter the code after login",
    },
    {
      id: 3,
      text: "Enjoy your ₹35 reward in your wallet instantly!",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto min-h-screen p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Refer & Earn ₹35
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Share this code or link with your friend. Once they install and enter your code, you'll receive ₹35!
        </p>
      </motion.div>

      {/* Referral Card */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="max-w-md mx-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-lg mb-8 relative overflow-hidden"
      >
        <div className="inset-0 bg-gradient-to-r from-transparent via-green-500/10 dark:via-green-400/10 to-transparent opacity-30" />
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
          Your Referral Code
        </p>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="text-3xl font-bold tracking-widest bg-gray-100 dark:bg-gray-800 p-4 rounded-xl inline-block mb-6"
        >
          {referralCode}
        </motion.div>
        
        <div className="flex justify-center gap-4">
          <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
      disabled={copied}
    >
      <Copy size={18} />
      {copied ? 'Copied!' : 'Copy Code'}
    </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
          >
            <Share2 size={18} />
            Share Link
          </motion.button>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          How It Works
          <ChevronRight className="ml-1 w-5 h-5 text-gray-400" />
        </h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tutorial */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm flex items-center justify-between mb-8 cursor-pointer"
      >
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">Need Help?</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Watch our video tutorial
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-green-500 dark:text-green-400"
        >
          <PlayCircle size={36} />
        </motion.div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Total Installed
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Total Earned
          </p>
          <p className="text-2xl font-bold text-green-500 dark:text-green-400">
            ₹0
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}   