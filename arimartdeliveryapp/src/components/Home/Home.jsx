import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  User, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Package, 
  DollarSign, 
  Target, 
  Users, 
  MapPin, 
  Zap,
  ChevronRight,
  Star,
  Gift,
  Menu,
  Home,
  BarChart3,
  Settings,
  IndianRupee
} from 'lucide-react';

export const ArimartHome = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [earnings, setEarnings] = useState(157.34);
  const [activeOrders, setActiveOrders] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const pulseVariants = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-lg rounded-b-3xl px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-lg font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Good Morning! 👋
              </motion.h1>
              <motion.p 
                className="text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Muhammad Omar Malik
              </motion.p>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.div 
        className="px-2 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Online Status Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                animate={isOnline ? pulseVariants : {}}
              >
                <Zap className="w-6 h-6" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">Status: Online</h2>
                <p className="text-green-100">Ready for deliveries</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOnline(!isOnline)}
              className={`w-16 h-8 rounded-full ${isOnline ? 'bg-white' : 'bg-gray-400'} relative transition-colors duration-300`}
            >
              <motion.div
                className={`w-6 h-6 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-600'} absolute top-1 transition-all duration-300`}
                animate={{ x: isOnline ? 36 : 4 }}
              />
            </motion.button>
          </div>
          
          <motion.div 
            className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Your Earnings</p>
                <motion.p 
                  className="text-3xl font-bold"
                  key={earnings}
                  initial={{ scale: 1.2, color: "#fbbf24" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  transition={{ duration: 0.3 }}
                >
                  ₹{earnings}
                </motion.p>
              </div>
              <motion.div 
                className="text-right"
                whileHover={{ scale: 1.1 }}
              >
                <TrendingUp className="w-8 h-8 ml-auto mb-1" />
                <p className="text-xs text-green-100">+12.5%</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Active Orders Alert */}
        <AnimatePresence>
          {activeOrders > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Package className="w-5 h-5" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-semibold">{activeOrders} delivery orders found!</p>
                  <p className="text-orange-100 text-sm">Tap to view details</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg"
            >
              <MapPin className="w-8 h-8 mb-3" />
              <p className="font-semibold">Start Shift</p>
              <p className="text-blue-100 text-sm">Begin earning</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg"
            >
              <Gift className="w-8 h-8 mb-3" />
              <p className="font-semibold">Refer Friends</p>
              <p className="text-purple-100 text-sm">Earn ₹39 bonus</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Progress Stats */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Progress</h3>
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <div className="grid grid-cols-3 gap-6">
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <IndianRupee className="w-8 h-8 text-white" />
                </motion.div>
                <motion.p 
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  487
                </motion.p>
                <p className="text-gray-600 text-sm">Earnings</p>
              </motion.div>

              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock className="w-8 h-8 text-white" />
                </motion.div>
                <motion.p 
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  2:45
                </motion.p>
                <p className="text-gray-600 text-sm">Login Hours</p>
              </motion.div>

              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Package className="w-8 h-8 text-white" />
                </motion.div>
                <motion.p 
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  24
                </motion.p>
                <p className="text-gray-600 text-sm">Orders</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Daily Incentive */}
        <motion.div variants={itemVariants}>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Daily Incentive 🎯</h3>
                <p className="text-yellow-100 text-sm mb-3">Deliver 27 more orders to get ₹839 incentive</p>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <motion.p 
                      className="text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      487
                    </motion.p>
                    <p className="text-yellow-100 text-xs">Current</p>
                  </div>
                  <div className="flex-1 h-2 bg-yellow-300 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "64%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">839</p>
                    <p className="text-yellow-100 text-xs">Target</p>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="w-12 h-12" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <motion.div 
              className="p-4 border-b border-gray-100 flex items-center justify-between"
              whileHover={{ backgroundColor: "#f9fafb" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">5 batch deliveries</p>
                  <p className="text-gray-600 text-sm">{currentTime.toLocaleTimeString()}</p>
                </div>
              </div>
              <motion.p 
                className="text-green-600 font-bold"
                initial={{ scale: 1.2, color: "#fbbf24" }}
                animate={{ scale: 1, color: "#059669" }}
                transition={{ duration: 0.3 }}
              >
                +₹79.90
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="p-4 flex items-center justify-between"
              whileHover={{ backgroundColor: "#f9fafb" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Daily bonus earned</p>
                  <p className="text-gray-600 text-sm">Yesterday</p>
                </div>
              </div>
              <p className="text-blue-600 font-bold">+₹25.00</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};