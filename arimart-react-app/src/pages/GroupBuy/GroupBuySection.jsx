import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Tag, Calendar, Sparkles } from "lucide-react";
import { fetchGroupById, fetchGroupMembers, fetchGroupReferCodeById, joinGroup, resetGroupState } from "../../Store/groupBuySlice";

export const GroupBuySection = ({ userId, product }) => {
  const dispatch = useDispatch();
  const {
    isJoining,
    joinSuccess,
    error,
    groupMembers,
    isLoadingMembers,
    currentGroup
  } = useSelector(state => state.group);

  const [hasJoined, setHasJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [referCode, setReferCode] = useState(null);

  // Fetch members
  useEffect(() => {
    if (product?.gid && userId) {
      dispatch(fetchGroupMembers(product.gid));
    }
  }, [product?.gid, userId, dispatch]);

  // Fetch group details
  useEffect(() => {
    if (product?.gid) {
      dispatch(fetchGroupById(product.gid));
    }
  }, [product?.gid, dispatch]);

  // Update joined state
  useEffect(() => {
    if (groupMembers && userId) {
      const userInGroup = groupMembers.some(
        member => member.userid === userId || member.Userid === userId
      );
      setHasJoined(userInGroup);
    }
  }, [groupMembers, userId]);

  // Countdown timer
  useEffect(() => {
    if (!currentGroup?.eventSend1) return;

    const endTime = new Date(currentGroup.eventSend1).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [currentGroup?.eventSend1]);

  // Handle Join
  const handleJoinGroupBuy = () => {
    if (!userId) {
      toast.error("Please login to join group buy");
      return;
    }

    if (!product?.gid) {
      toast.error("Group ID not found");
      return;
    }

    if (hasJoined) {
      toast.info("You have already joined this group buy");
      return;
    }

    const joinData = {
      userid: userId,
      groupid: product.gid,
      pid: product.pid,
      pdid: product.pdid,
    };

    dispatch(joinGroup(joinData));
  };

  useEffect(() => {
    if (joinSuccess) {
      toast.success("You've joined the group buy!");
      setHasJoined(true);
      if (product?.gid) {
        dispatch(fetchGroupMembers(product.gid));
      }
      dispatch(resetGroupState());
    }
    if (error) {
      toast.error(error);
      dispatch(resetGroupState());
    }
  }, [joinSuccess, error, product?.gid, dispatch]);


  useEffect(() => {
    if (product?.gid) {
      dispatch(fetchGroupReferCodeById(product.gid))
        .unwrap()
        .then((data) => {
          setReferCode(data?.refercode);
        })
        .catch(() => {
          toast.error("Failed to load referral code");
        });
    }
  }, [product?.gid, dispatch]);

  const shareUrl = referCode
    ? `${window.location.origin}/groupbuy/join/${referCode}`
    : "";



  if (!product?.gid || !product?.gprice || !product?.gqty) return null;

  const regularPrice = product.netprice || product.price || 0;
  const groupPrice = product.gprice || 0;
  const discountPercentage =
    regularPrice > 0 ? Math.round((1 - groupPrice / regularPrice) * 100) : 0;

  const currentMembers = groupMembers?.length || 0;
  const requiredMembers = product.gqty || 5;
  const isGroupBuyActive = !!timeLeft;

  return (
    <div className="border p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-purple-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-1.5 text-sm">
            <Users className="w-4 h-4" /> Group Buy
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Join {product.gqty}+ buyers for {discountPercentage}% off
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 line-through">₹{regularPrice}</span>
          <span className="text-purple-600 font-bold">₹{groupPrice}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{currentMembers}/{requiredMembers} joined</span>
          {isLoadingMembers && <span>Loading...</span>}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
            style={{ width: `${Math.min((currentMembers / requiredMembers) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Countdown */}
      {isGroupBuyActive && (
        <motion.div
          className="flex items-center mx-auto justify-between bg-white/80 dark:bg-gray-800/80 p-2 rounded-lg mb-3 border border-purple-100 dark:border-gray-700 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <span className="text-xs text-gray-600 dark:text-gray-300">Ends in:</span>
          </div>
          <div className="flex gap-1 font-mono text-sm font-medium">
            {timeLeft.days > 0 && (
              <motion.span
                className="px-1 text-purple-600 dark:text-purple-300"
                key={`days-${timeLeft.days}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {timeLeft.days}d
              </motion.span>
            )}
            <motion.span
              className="px-1 text-purple-600 dark:text-purple-300"
              key={`hours-${timeLeft.hours}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {String(timeLeft.hours).padStart(2, '0')}
            </motion.span>
            <span className="text-purple-400">:</span>
            <motion.span
              className="px-1 text-purple-600 dark:text-purple-300"
              key={`mins-${timeLeft.minutes}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {String(timeLeft.minutes).padStart(2, '0')}
            </motion.span>
            <span className="text-purple-400">:</span>
            <motion.span
              className="px-1 text-purple-600 dark:text-purple-300"
              key={`secs-${timeLeft.seconds}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {String(timeLeft.seconds).padStart(2, '0')}
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <div className="flex justify-center mx-auto max-w-sm">
        {!isGroupBuyActive ? (
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
            Group buy ended
          </div>
        ) : hasJoined ? (
          <motion.div
            className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full"
            whileHover={{ scale: 1.02 }}
          >
            <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Joined!</span>
          </motion.div>
        ) : (
          <motion.button
            onClick={handleJoinGroupBuy}
            disabled={isJoining}
            className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full w-full shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isJoining ? 'Joining...' : 'Join Group Buy'}
          </motion.button>
        )}
      </div>

      {/* Referral Section - Only shows when expanded */}
      {hasJoined && referCode && (
        <motion.div
          className="mt-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Your referral code:</p>
          <div className="font-mono bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 p-2 rounded text-center text-sm mb-2">
            {referCode}
          </div>
          <a
            href={shareUrl}
            className="text-xs text-blue-600 dark:text-blue-400 underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share link
          </a>
        </motion.div>
      )}
    </div>
  );
};