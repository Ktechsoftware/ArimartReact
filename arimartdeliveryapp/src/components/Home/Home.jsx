import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  IndianRupee,
  Play,
  Square,
  Award,
  Timer,
  Flame
} from 'lucide-react';
import { useAuth } from "../../hooks/useAuth";

// Earnings actions and selectors
import {
  fetchEarningSummary,
  selectTodayEarnings,
  selectWeeklyEarnings,
  selectMonthlyEarnings,
  selectTotalEarnings,
  selectTodayDeliveries,
  selectDailyProgress,
  selectWeeklyProgress,
  selectMonthlyProgress,
  selectDailyGoal,
  selectIsEarningsLoading,
  selectEarningsError
} from '../../Store/earningsSlice';

// Shifts actions and selectors
import {
  startShift,
  endShift,
  fetchShiftStats,
  updateCurrentShiftDuration,
  selectIsOnline,
  selectCurrentShiftDuration,
  selectCurrentShiftEarnings,
  selectCurrentShiftDeliveries,
  selectTodayLoginHours,
  selectIsStartingShift,
  selectIsEndingShift,
  selectShiftsError,
  selectAvailableIncentives
} from '../../Store/shiftsSlice';

// Incentives actions and selectors
import {
  fetchAvailableIncentives,
  updateTodayDeliveries,
  selectCurrentIncentiveTarget,
  selectIncentiveProgress,
  selectTodayIncentiveDeliveries,
  selectIncentiveNotifications,
  selectHasNewIncentive,
  selectCurrentStreak,
  markNotificationsRead
} from '../../Store/incentivesSlice';

// Delivery actions and selectors
import {
  fetchActiveDeliveries,
  selectActiveDeliveries,
  selectDeliveryStats,
  selectIsLoading as selectDeliveryLoading
} from '../../Store/deliveryOrderSlice'
import { Link } from 'react-router-dom';

export const ArimartHome = () => {
  const dispatch = useDispatch();
  const { user, userId } = useAuth();
  
  // Local state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState(null);

  // Redux selectors
  // Earnings
  const todayEarnings = useSelector(selectTodayEarnings);
  const weeklyEarnings = useSelector(selectWeeklyEarnings);
  const monthlyEarnings = useSelector(selectMonthlyEarnings);
  const todayDeliveries = useSelector(selectTodayDeliveries);
  const dailyProgress = useSelector(selectDailyProgress);
  const dailyGoal = useSelector(selectDailyGoal);
  const isEarningsLoading = useSelector(selectIsEarningsLoading);
  
  // Shifts
  const isOnline = useSelector(selectIsOnline);
  const currentShiftDuration = useSelector(selectCurrentShiftDuration);
  const currentShiftEarnings = useSelector(selectCurrentShiftEarnings);
  const currentShiftDeliveries = useSelector(selectCurrentShiftDeliveries);
  const todayLoginHours = useSelector(selectTodayLoginHours);
  const isStartingShift = useSelector(selectIsStartingShift);
  const isEndingShift = useSelector(selectIsEndingShift);
  const availableIncentives = useSelector(selectAvailableIncentives);
  
  // Incentives
  const currentIncentiveTarget = useSelector(selectCurrentIncentiveTarget);
  const incentiveProgress = useSelector(selectIncentiveProgress);
  const incentiveDeliveries = useSelector(selectTodayIncentiveDeliveries);
  const incentiveNotifications = useSelector(selectIncentiveNotifications);
  const hasNewIncentive = useSelector(selectHasNewIncentive);
  const currentStreak = useSelector(selectCurrentStreak);
  
  // Deliveries
  const activeDeliveries = useSelector(selectActiveDeliveries);
  const deliveryStats = useSelector(selectDeliveryStats);
  const isDeliveryLoading = useSelector(selectDeliveryLoading);

  // Effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update shift duration if online
      if (isOnline) {
        dispatch(updateCurrentShiftDuration());
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOnline, dispatch]);

  // Fetch initial data
  useEffect(() => {
    if (userId) {
      // Fetch earnings summary
      dispatch(fetchEarningSummary({ partnerId: userId }));
      
      // Fetch shift stats
      dispatch(fetchShiftStats(userId));
      
      // Fetch available incentives
      dispatch(fetchAvailableIncentives(userId));
      
      // Fetch active deliveries
      dispatch(fetchActiveDeliveries(userId));
    }
  }, [userId, dispatch]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Handle shift toggle
  const handleShiftToggle = useCallback(async () => {
    if (!userLocation) {
      alert("Location is required to start/end shift");
      return;
    }

    try {
      if (isOnline) {
        // End shift
        await dispatch(endShift({
          partnerId: userId,
          endLatitude: userLocation.latitude,
          endLongitude: userLocation.longitude
        })).unwrap();
      } else {
        // Start shift
        await dispatch(startShift({
          partnerId: userId,
          startLatitude: userLocation.latitude,
          startLongitude: userLocation.longitude
        })).unwrap();
      }
    } catch (error) {
      console.error("Shift toggle error:", error);
      alert("Failed to toggle shift. Please try again.");
    }
  }, [isOnline, userId, userLocation, dispatch]);

  // Handle notification click
  const handleNotificationClick = useCallback(() => {
    if (hasNewIncentive) {
      dispatch(markNotificationsRead());
    }
  }, [hasNewIncentive, dispatch]);

  // Animation variants
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
                {user?.name || 'Delivery Partner'}
              </motion.p>
            </div>
          </div>
          
          {/* Notifications */}
          <motion.button
            onClick={handleNotificationClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {hasNewIncentive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs">
                  {incentiveNotifications.length}
                </span>
              </motion.div>
            )}
          </motion.button>
        </div>
      </motion.header>

      <motion.div 
        className="px-4 py-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Online Status Card */}
        <motion.div 
          variants={itemVariants}
          className={`rounded-3xl p-6 text-white shadow-xl transition-all duration-300 ${
            isOnline 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                animate={isOnline ? pulseVariants : {}}
              >
                {isOnline ? <Zap className="w-6 h-6" /> : <Timer className="w-6 h-6" />}
              </motion.div>
              <div>
                <h2 className="text-xl font-bold">
                  Status: {isOnline ? 'Online' : 'Offline'}
                </h2>
                <p className={`${isOnline ? 'text-green-100' : 'text-gray-100'}`}>
                  {isOnline ? 'Ready for deliveries' : 'Start your shift'}
                </p>
                {isOnline && (
                  <p className="text-sm opacity-75">
                    Duration: {currentShiftDuration}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShiftToggle}
              disabled={isStartingShift || isEndingShift}
              className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full"
            >
              {isStartingShift || isEndingShift ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isOnline ? (
                <Square className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">
                {isStartingShift ? 'Starting...' : 
                 isEndingShift ? 'Ending...' : 
                 isOnline ? 'End Shift' : 'Start Shift'}
              </span>
            </motion.button>
          </div>
          
          <motion.div 
            className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isOnline ? 'text-green-100' : 'text-gray-100'}`}>
                  {isOnline ? 'Current Shift Earnings' : 'Today\'s Earnings'}
                </p>
                <motion.p 
                  className="text-3xl font-bold"
                  key={isOnline ? currentShiftEarnings : todayEarnings}
                  initial={{ scale: 1.2, color: "#fbbf24" }}
                  animate={{ scale: 1, color: "#ffffff" }}
                  transition={{ duration: 0.3 }}
                >
                  ₹{isOnline ? currentShiftEarnings : todayEarnings}
                </motion.p>
              </div>
              <motion.div 
                className="text-right"
                whileHover={{ scale: 1.1 }}
              >
                <TrendingUp className="w-8 h-8 ml-auto mb-1" />
                <p className="text-xs opacity-75">
                  {isOnline ? `${currentShiftDeliveries} orders` : `${todayDeliveries} today`}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Active Orders Alert */}
        <AnimatePresence>
          {activeDeliveries.length > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg"
            >
              <Link to='/orders' className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Package className="w-5 h-5" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {activeDeliveries.length} active delivery orders!
                  </p>
                  <p className="text-orange-100 text-sm">Tap to view details</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Incentive Progress */}
        {currentIncentiveTarget && (
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Target className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold flex items-center space-x-2">
                      <span>Daily Incentive</span>
                      <Award className="w-5 h-5" />
                    </h3>
                    {currentStreak > 0 && (
                      <div className="flex items-center space-x-1 text-yellow-100 text-sm">
                        <Flame className="w-4 h-4" />
                        <span>{currentStreak} day streak!</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{currentIncentiveTarget.incentiveAmount}</p>
                  <p className="text-yellow-100 text-sm">Target Reward</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-yellow-100 text-sm">
                  Deliver {currentIncentiveTarget.ordersNeeded} more orders to earn ₹{currentIncentiveTarget.incentiveAmount}
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <motion.p 
                      className="text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
                    >
                      {incentiveDeliveries}
                    </motion.p>
                    <p className="text-yellow-100 text-xs">Current</p>
                  </div>
                  <div className="flex-1 h-3 bg-yellow-300 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${currentIncentiveTarget.progressPercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{currentIncentiveTarget.minOrders}</p>
                    <p className="text-yellow-100 text-xs">Target</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-yellow-100">
                    {Math.round(currentIncentiveTarget.progressPercentage)}% Complete
                  </span>
                  <span className="font-bold">
                    {currentIncentiveTarget.ordersNeeded} orders to go!
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
              <p className="font-semibold">View Routes</p>
              <p className="text-blue-100 text-sm">Navigate deliveries</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg"
            >
              <Gift className="w-8 h-8 mb-3" />
              <p className="font-semibold">Refer Friends</p>
              <p className="text-purple-100 text-sm">Earn ₹100 bonus</p>
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
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <IndianRupee className="w-8 h-8 text-white" />
                </motion.div>
                <motion.p 
                  className="text-2xl font-bold text-gray-800"
                  key={todayEarnings}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  ₹{todayEarnings}
                </motion.p>
                <p className="text-gray-600 text-sm">Earnings</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <motion.div 
                    className="bg-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(dailyProgress, 100)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Goal: ₹{dailyGoal}
                </p>
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
                  key={todayLoginHours}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {todayLoginHours}
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
                  key={todayDeliveries}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {todayDeliveries}
                </motion.p>
                <p className="text-gray-600 text-sm">Deliveries</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {isOnline && currentShiftDeliveries > 0 && (
              <motion.div 
                className="p-4 border-b border-gray-100 flex items-center justify-between"
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Current shift: {currentShiftDeliveries} deliveries
                    </p>
                    <p className="text-gray-600 text-sm">Duration: {currentShiftDuration}</p>
                  </div>
                </div>
                <motion.p 
                  className="text-green-600 font-bold"
                  initial={{ scale: 1.2, color: "#fbbf24" }}
                  animate={{ scale: 1, color: "#059669" }}
                  transition={{ duration: 0.3 }}
                >
                  +₹{currentShiftEarnings}
                </motion.p>
              </motion.div>
            )}
            
            <motion.div 
              className="p-4 flex items-center justify-between"
              whileHover={{ backgroundColor: "#f9fafb" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start your streak today'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {currentStreak > 0 ? 'Keep it up!' : 'Earn incentives daily'}
                  </p>
                </div>
              </div>
              {currentStreak > 0 && (
                <div className="flex items-center space-x-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <p className="text-orange-600 font-bold">{currentStreak}</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Loading States */}
        {(isEarningsLoading || isDeliveryLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-8"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">Loading data...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};