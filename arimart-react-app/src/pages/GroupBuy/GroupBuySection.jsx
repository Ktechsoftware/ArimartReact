import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Tag } from "lucide-react";
import { fetchGroupMembers, joinGroup, resetGroupState } from "../../Store/groupBuySlice";

export const GroupBuySection = ({ userId, product }) => {
  const dispatch = useDispatch();
  const { 
    isJoining, 
    joinSuccess, 
    error, 
    groupMembers, 
    isLoadingMembers 
  } = useSelector(state => state.group);

  const [timeLeft, setTimeLeft] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);

  // Check if user has already joined this group
  useEffect(() => {
    if (product?.gid && userId) {
      dispatch(fetchGroupMembers(product.gid));
    }
  }, [product?.gid, userId, dispatch]);

  // Check if current user is in group members
  useEffect(() => {
    if (groupMembers && userId) {
      const userInGroup = groupMembers.some(member => 
        member.userid === userId || member.Userid === userId
      );
      setHasJoined(userInGroup);
    }
  }, [groupMembers, userId]);

  // Countdown timer
  useEffect(() => {
    if (!product?.eventSend1) return;

    const endTime = new Date(product.eventSend1).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [product?.eventSend1]);

  const handleJoinGroupBuy = () => {
    if (!userId) {
      toast.error('Please login to join group buy');
      return;
    }

    if (!product?.gid) {
      toast.error('Group ID not found');
      return;
    }

    const joinData = {
      userid: userId,
      groupid: product.gid,
      pid: product.pid,
      pdid: product.pdid
    };

    dispatch(joinGroup(joinData));
  };

  useEffect(() => {
    if (joinSuccess) {
      toast.success("You've joined the group buy!");
      setHasJoined(true);
      // Refresh group members
      if (product?.gid) {
        dispatch(fetchGroupMembers(product.gid));
      }
      dispatch(resetGroupState());
    }
    if (error) {
      toast.error(error);
    }
  }, [joinSuccess, error, product?.gid, dispatch]);

  // Don't show if no group data
  if (!product?.gid || !product?.gprice || !product?.gqty) {
    return null;
  }

  // Calculate discount percentage
  const regularPrice = product.netprice || product.price || 0;
  const groupPrice = product.gprice || 0;
  const discountPercentage = regularPrice > 0 ? 
    Math.round((1 - groupPrice / regularPrice) * 100) : 0;

  // Check if group buy is still active
  const isGroupBuyActive = timeLeft !== null;
  const currentMembers = groupMembers?.length || 0;
  const requiredMembers = product.gqty || 5;

  return (
    <motion.div
      className="border p-4 rounded-md mt-6 bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-700"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" /> Group Buy Discount
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Join a group of {requiredMembers}+ buyers and get {discountPercentage}% discount! 
              Only ₹{groupPrice} per item.
            </p>
          </div>
          
          {/* Price comparison */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 line-through">₹{regularPrice}</span>
            <span className="text-purple-600 font-bold text-lg">₹{groupPrice}</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
              {discountPercentage}% OFF
            </span>
          </div>
        </div>

        {/* Progress and countdown */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Members progress */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentMembers}/{requiredMembers} members joined
              </span>
              {isLoadingMembers && (
                <span className="text-xs text-gray-500">Loading...</span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((currentMembers / requiredMembers) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Countdown */}
          {isGroupBuyActive && timeLeft && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-gray-600 dark:text-gray-400">Ends in:</span>
              <span className="font-mono font-bold text-purple-600">
                {timeLeft.days > 0 && `${timeLeft.days}d `}
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          {!isGroupBuyActive ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Tag className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Group buy has ended</span>
            </div>
          ) : hasJoined ? (
            <div className="text-center text-green-600 dark:text-green-400">
              <Users className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">You've joined this group!</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleJoinGroupBuy}
              disabled={isJoining}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium px-6 py-2 rounded-md shadow transition-all"
            >
              {isJoining ? "Joining..." : "Join Group Buy"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};