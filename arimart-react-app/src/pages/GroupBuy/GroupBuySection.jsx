// Enhanced GroupBuySection with responsive design and "See More" functionality
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, Tag, Calendar, Sparkles, User, ShoppingCart, UserPlus, ChevronDown, ChevronUp } from "lucide-react";
import {
  fetchGroupById,
  fetchGroupMembers,
  fetchGroupReferCodeById,
  fetchMyJoinedGroups,
} from "../../Store/groupBuySlice";

export const GroupBuySection = ({ userId, product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {
    groupMembers,
    myJoinedGroups,
  } = useSelector(state => state.group);

  const currentGroup = useSelector(state => state.group.groupsById?.[product.gid]);

  const [hasJoined, setHasJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [referCode, setReferCode] = useState(null);
  const [hasJoinedOtherGroupForProduct, setHasJoinedOtherGroupForProduct] = useState(false);
  const [isGroupOwner, setIsGroupOwner] = useState(false);
  const [newMemberJoined, setNewMemberJoined] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user's joined groups
  useEffect(() => {
    if (userId) {
      dispatch(fetchMyJoinedGroups(userId));
    }
  }, [userId, dispatch]);

  // Check if current user is the group owner
  useEffect(() => {
    if (currentGroup && userId) {
      const isOwner = currentGroup.userid === userId || currentGroup.Userid === userId;
      setIsGroupOwner(isOwner);
    }
  }, [currentGroup, userId]);

  // Check if user has joined other groups for the same product
  useEffect(() => {
    if (myJoinedGroups && product?.gid && product?.pid && product?.pdid) {
      const otherGroupJoinedForProduct = myJoinedGroups.some(
        group =>
          group.Gid !== product.gid &&
          group.pid === product.pid &&
          group.pdid === product.pdid
      );
      setHasJoinedOtherGroupForProduct(otherGroupJoinedForProduct);
    }
  }, [myJoinedGroups, product?.gid, product?.pid, product?.pdid]);

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

  // Update joined state and trigger animation for new members
  useEffect(() => {
    if (groupMembers && userId) {
      const userInGroup = groupMembers.some(
        member => member.userid === userId || member.Userid === userId
      );
      
      // Check if member count increased to trigger animation
      const previousMemberCount = hasJoined ? currentMembers : 0;
      if (groupMembers.length > previousMemberCount) {
        setNewMemberJoined(true);
        setTimeout(() => setNewMemberJoined(false), 2000);
      }
      
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

  // Fetch referral code
  useEffect(() => {
    if (product?.gid) {
      dispatch(fetchGroupReferCodeById(product.gid))
        .unwrap()
        .then((data) => {
          setReferCode(data?.refercode);
        })
        .catch(() => {
          // Silent fail for referral code
        });
    }
  }, [product?.gid, dispatch]);

  // Handle navigation to group buy page
  const handleJoinToOrder = () => {
    if (!userId) {
      toast.error("Please login to join group buy");
      return;
    }

    if (!product?.gid) {
      toast.error("Group ID not found");
      return;
    }

    // Navigate to group buy page
    navigate(`/group/join/${product.gid}${referCode ? `/ref=${referCode}` : ''}`);
  };

  if (!product?.gid || !product?.gprice || !product?.gqty) return null;

  const regularPrice = product.netprice || product.price || 0;
  const groupPrice = product.gprice || 0;
  const discountPercentage =
    regularPrice > 0 ? Math.round((1 - groupPrice / regularPrice) * 100) : 0;

  const currentMembers = groupMembers?.length || 0;
  const requiredMembers = product.gqty || 5;
  const remainingMembers = Math.max(0, requiredMembers - currentMembers);
  const isGroupBuyActive = !!timeLeft;

  return (
    <div className="border border-purple-200 dark:border-purple-700 p-3 rounded-lg bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-sm max-w-4xl mx-auto">
      
      {/* Main Content - Always Visible */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Section: Vendor Info & Progress */}
        <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
          <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-sm">
            {currentGroup?.image1 ? (
              <img
                src={"http://localhost:5015/uploads/" + currentGroup.image1}
                alt="Group"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <Users className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                {currentGroup?.vendorName || "Loading..."}
              </h3>
              {isGroupOwner && (
                <span className="text-xs bg-yellow-400 text-yellow-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Owner
                </span>
              )}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3 text-yellow-500" />
              </motion.div>
            </div>
            
            {/* Progress Bar with Member Info */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden min-w-[100px]">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min((currentMembers / requiredMembers) * 100, 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((currentMembers / requiredMembers) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                <span>{currentMembers}/{requiredMembers}</span>
                {remainingMembers > 0 && (
                  <motion.span 
                    className="text-orange-500 font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ({remainingMembers} needed)
                  </motion.span>
                )}
              </div>
            </div>
            
            {/* New Member Join Animation */}
            {newMemberJoined && (
              <motion.div
                className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <UserPlus className="w-3 h-3" />
                <span>New member joined!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Center Section: Timer with Calendar Animation - Hidden on mobile when collapsed */}
        {(!isMobile || expanded) && isGroupBuyActive && (
          <motion.div 
            className="flex items-center gap-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-lg border border-purple-200 dark:border-purple-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Calendar className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <div className="flex gap-1 text-xs font-medium text-purple-800 dark:text-purple-200">
              {timeLeft.days > 0 && (
                <motion.span
                  key={timeLeft.days}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {timeLeft.days}d
                </motion.span>
              )}
              <motion.span
                key={timeLeft.hours}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {String(timeLeft.hours).padStart(2, '0')}h
              </motion.span>
              <motion.span
                key={timeLeft.minutes}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {String(timeLeft.minutes).padStart(2, '0')}m
              </motion.span>
              <motion.span
                key={timeLeft.seconds}
                initial={{ opacity: 0.5, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
                className="text-red-500 font-bold"
              >
                {String(timeLeft.seconds).padStart(2, '0')}s
              </motion.span>
            </div>
          </motion.div>
        )}
        
        {/* Show "Ended" badge when timer expires - Hidden on mobile when collapsed */}
        {(!isMobile || expanded) && !isGroupBuyActive && (
          <motion.div 
            className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg border border-red-200 dark:border-red-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Calendar className="w-3 h-3 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-800 dark:text-red-200">
              Ended
            </span>
          </motion.div>
        )}

        {/* Right Section: Pricing, Members & Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-normal mt-2 md:mt-0">
          
          {/* Member Avatars with Animation - Hidden on mobile when collapsed */}
          {(!isMobile || expanded) && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {groupMembers?.slice(0, 3).map((member, index) => (
                  <motion.div
                    key={member.userid || index}
                    className="w-5 h-5 rounded-full border border-white dark:border-gray-800 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center shadow-sm"
                    initial={{ opacity: 0, x: 5, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <User className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                ))}
                {currentMembers > 3 && (
                  <motion.div 
                    className="w-5 h-5 rounded-full border border-white dark:border-gray-800 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold text-xs shadow-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    +{currentMembers - 3}
                  </motion.div>
                )}
              </div>
              
              {/* Empty slots animation for remaining members */}
              {remainingMembers > 0 && (
                <div className="flex -space-x-1 ml-1">
                  {Array.from({ length: Math.min(remainingMembers, 2) }).map((_, index) => (
                    <motion.div
                      key={`empty-${index}`}
                      className="w-5 h-5 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ 
                        delay: index * 0.2,
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <UserPlus className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 line-through">₹{regularPrice}</span>
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                ₹{groupPrice}
              </span>
            </div>
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold">
              {discountPercentage}% OFF
            </span>
          </div>

          {/* Join to Order Button with Enhanced Animation */}
          <motion.button
            onClick={handleJoinToOrder}
            disabled={!isGroupBuyActive}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              !isGroupBuyActive
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
            }`}
            whileHover={{ 
              scale: !isGroupBuyActive ? 1 : 1.05,
              boxShadow: !isGroupBuyActive ? "none" : "0 4px 20px rgba(168, 85, 247, 0.4)"
            }}
            whileTap={{ scale: !isGroupBuyActive ? 1 : 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              animate={!isGroupBuyActive ? {} : { 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.div>
            {!isGroupBuyActive ? "Ended" : "Join to Order"}
          </motion.button>
        </div>
      </div>

      {/* See More/Less Button for Mobile */}
      {isMobile && (
        <div className="flex justify-center mt-2">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Show Details</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Expanded Details Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-800 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Time Remaining</p>
                  <p className="text-sm font-medium">
                    {isGroupBuyActive 
                      ? `${timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}${timeLeft.hours}h ${timeLeft.minutes}m`
                      : 'Group Buy Ended'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your Savings</p>
                  <p className="text-sm font-medium">₹{regularPrice - groupPrice} ({discountPercentage}%)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Members Joined</p>
                  <p className="text-sm font-medium">
                    {currentMembers} / {requiredMembers} ({remainingMembers > 0 ? `${remainingMembers} needed` : 'Goal reached!'})
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your Status</p>
                  <p className="text-sm font-medium">
                    {hasJoined ? 'Joined' : hasJoinedOtherGroupForProduct ? 'Joined another group' : 'Not joined'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};