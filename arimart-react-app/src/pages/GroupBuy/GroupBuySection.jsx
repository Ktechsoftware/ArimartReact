// Enhanced GroupBuySection with GID-specific state management
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Users, Clock, Tag, Calendar, Sparkles, User, ShoppingCart, UserPlus, ChevronDown, ChevronUp, Loader, Copy, Share2, MessageCircle } from "lucide-react";
import {
  fetchGroupById,
  fetchGroupMembers,
  fetchGroupReferCodeById,
  fetchMyJoinedGroups,
} from "../../Store/groupBuySlice";

export const GroupBuySection = ({ userId, product, type = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [CopiedCode, setCopiedCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const gid = product?.gid;
  // console.log(userId, gid)

  // ✅ ENHANCED: Get GID-specific data from Redux store
  const {
    membersByGid,
    referCodesByGid,
    loadingStatesByGid,
    myJoinedGroups,
  } = useSelector(state => state.group);

  // ✅ ENHANCED: Get specific group data
  const currentGroup = useSelector(state => state.group.groupsById?.[gid]);
  const groupMembers = membersByGid[gid] || [];
  const referCodeData = referCodesByGid[gid];
  const loadingStates = loadingStatesByGid[gid] || {};

  // Local state
  const [hasJoined, setHasJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasJoinedOtherGroupForProduct, setHasJoinedOtherGroupForProduct] = useState(false);
  const [isGroupOwner, setIsGroupOwner] = useState(false);
  const [newMemberJoined, setNewMemberJoined] = useState(false);
  const [previousMemberCount, setPreviousMemberCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ ENHANCED: Fetch data only when gid is available
  useEffect(() => {
    if (!gid) return;

    // Fetch group details
    dispatch(fetchGroupById(gid));

    // Fetch group members
    dispatch(fetchGroupMembers(gid));

    // Fetch referral code
    dispatch(fetchGroupReferCodeById(gid));
  }, [gid, dispatch]);

  // Fetch user's joined groups
  useEffect(() => {
    if (userId) {
      dispatch(fetchMyJoinedGroups(userId));
    }
  }, [userId, dispatch]);

  // Check if current user is the group owner
  useEffect(() => {
    if (currentGroup && userId) {
      const isOwner = currentGroup.cuserid === userId || currentGroup.cuserid === userId;
      setIsGroupOwner(isOwner);
    }
  }, [currentGroup, userId]);

  // console.log(currentGroup)

  // Check if user has joined other groups for the same product
  useEffect(() => {
    if (myJoinedGroups && gid && product?.pid && product?.pdid) {
      const otherGroupJoinedForProduct = myJoinedGroups.some(
        group =>
          group.Gid !== gid &&  // Different group
          group.pid === product.pid &&
          group.pdid === product.pdid
      );

      // Only set hasJoinedOtherGroupForProduct if user hasn't joined current group
      if (!hasJoined) {
        setHasJoinedOtherGroupForProduct(otherGroupJoinedForProduct);
      } else {
        // If user has joined current group, don't show "joined other group"
        setHasJoinedOtherGroupForProduct(false);
      }
    }
  }, [myJoinedGroups, gid, product?.pid, product?.pdid, hasJoined]);

  // ✅ ENHANCED: Check membership and detect new members for this specific group
  useEffect(() => {
    if (groupMembers && userId) {
      const userInGroup = groupMembers.some(
        member => member.userId === userId || member.userId === userId
      );
      if (groupMembers.length > previousMemberCount && previousMemberCount > 0) {
        setNewMemberJoined(true);
        setTimeout(() => setNewMemberJoined(false), 6000);
      }

      setPreviousMemberCount(groupMembers.length);
      setHasJoined(userInGroup);
    }
  }, [groupMembers, userId, previousMemberCount]);

  // console.log(groupMembers)

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

  // Handle navigation to group buy page
  const handleJoinToOrder = () => {
    if (!userId) {
      toast.error("Please login to join group buy");
      return;
    }

    if (!gid) {
      toast.error("Group ID not found");
      return;
    }

    // Get referral code for this specific group
    const referCode = referCodeData?.refercode;

    // Navigate to group buy page
    navigate(`/group/join/${gid}${referCode ? `/${referCode}` : ''}`);
  };

  const copyToClipboard = async (text, type = 'code') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
      toast.success("Group code copied..")
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareGroup = async (groupCode, productName, gid, navigate) => {
    const url = `${window.location.origin}/group/join/${gid}/${groupCode}`;
    const shareText = `🛒 Join Group Order\nProduct: ${productName}\nCode: ${groupCode}\n${url}`;

    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: 'Join Group Order',
          text: shareText,
          url: url,
          dialogTitle: 'Share with friends',
        });
        navigate(`/group/join/${gid}/${groupCode}`);
      } else if (navigator.share) {
        await navigator.share({
          text: shareText,
          url: url,
        });
        navigate(`/group/join/${gid}/${groupCode}`);
      } else {
        copyToClipboard(shareText, 'share');
        navigate(`/group/join/${gid}/${groupCode}`);
      }
    } catch (error) {
      console.log('Share failed or cancelled:', error);
    }
  };
  // Enhanced version with price information
  const shareToWhatsApp = (groupCode, productName, gid, regularPrice, groupPrice) => {
    const discountPercentage = Math.round(((regularPrice - groupPrice) / regularPrice) * 100);
    const shareUrl = `${window.location.origin}/group/join/${gid}/${groupCode}`;

    const whatsappMessage = `Hii, Join my group on Arimart to get up to ${discountPercentage}% extra discount! My group expires in 24 hrs - HURRY!!*

*Product:* ${productName}
*Regular Price:* ₹${regularPrice}
*Group Price:* ₹${groupPrice} (Save ₹${regularPrice - groupPrice}!)
*Group Code:* ${groupCode}

Click to join:
${shareUrl}`;

    const encoded = encodeURIComponent(whatsappMessage);
    const link = `https://wa.me/?text=${encoded}`;
    window.open(link, '_blank');
  };


  // ✅ ENHANCED: Early return if no gid or essential product data
  // ✅ ENHANCED: Early return if no gid or essential product data
  if (!gid || !product?.gprice || !product?.gqty) return null;

  const regularPrice = product.netprice || product.price || 0;
  const groupPrice = product.gprice || 0;
  const discountPercentage =
    regularPrice > 0 ? Math.round((1 - groupPrice / regularPrice) * 100) : 0;

  const currentMembers = groupMembers?.length || 0;
  const requiredMembers = product.gqty || 5;
  const remainingMembers = Math.max(0, requiredMembers - currentMembers);
  const isGroupBuyActive = !!timeLeft;
  
  if (!isGroupBuyActive) return null;

  return (
    <div className="border border-purple-200 dark:border-purple-700 p-3 rounded-lg bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-sm max-w-4xl mx-auto">

      {/* Debug Info - Remove in production */}
      <div className="flex items-center justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
        Group Code: {referCodeData?.refercode} | Members: {currentMembers}
        {type == "joined" ?
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                const groupCode = `${referCodeData?.refercode}`;
                copyToClipboard(groupCode, 'code');
              }}
              className="text-xs px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy <span className="hidden sm:inline">Code</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                const groupCode = `${referCodeData?.refercode}`;
                shareGroup(groupCode, product.productname || 'Product', gid);
              }}
              className="text-xs px-2 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center gap-1"
            >
              <Share2 className="w-3 h-3" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                const groupCode = `${referCodeData?.refercode}`;
                shareToWhatsApp(
                  groupCode,
                  product.productName || 'Product',
                  gid,
                  product.price,
                  product.gprice
                );
              }}
              className="text-xs px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline">WhatsApp</span>
            </motion.button>

          </div>
          : ""}
      </div>

      {/* Main Content - Always Visible */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

        {/* Left Section: Vendor Info & Progress */}
        <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
          <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-sm">
            {currentGroup?.image1 ? (
              <img
                src={"https://apiari.kuldeepchaurasia.in/uploads/" + currentGroup.image1}
                alt="Group"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <Users className="w-4 h-4 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate flex items-center gap-1">
                {currentGroup?.vendorName ? (
                  currentGroup.vendorName
                ) : (
                  <Loader className="w-4 h-4 animate-spin text-gray-500" />
                )}
              </h3>
              {isGroupOwner && (
                <span className="text-xs bg-yellow-400 text-yellow-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  You
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
        {/* Center Section: Timer or End Message */}
        {(!isMobile || expanded) && (
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
              {isGroupBuyActive && timeLeft.days > 0 ? (
                <>
                  <span>{timeLeft.days}d</span>
                  <span>{timeLeft.hours}h</span>
                  <span>{timeLeft.minutes}m</span>
                  <span>{timeLeft.seconds}s</span>
                </>
              ) : isGroupBuyActive ? (
                <>
                  <span>{timeLeft.hours}h</span>
                  <span>{timeLeft.minutes}m</span>
                  <span>{timeLeft.seconds}s</span>
                </>
              ) : (
                <span>Group Buy End</span>
              )}
            </div>
          </motion.div>
        )}


        {/* Right Section: Join Button */}
        <div className="flex md:flex-col md:items-end items-center gap-2">
          <div className="text-xs text-gray-600 dark:text-gray-300 text-right">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-green-600" />
              <span className="line-through text-gray-400">₹{regularPrice}</span>
              <span className="font-bold text-green-700 dark:text-green-400">₹{groupPrice}</span>
              <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">
                {discountPercentage}% OFF
              </span>
            </div>
          </div>
          <button
            onClick={handleJoinToOrder}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-all shadow-md"
          >
            <ShoppingCart className="w-4 h-4" /> {type == "joined" ? "view Detail" : "Join to order"}
          </button>
        </div>
      </div>

      {/* Toggle Expand/Collapse (for mobile) */}
      {isMobile && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="text-xs text-purple-700 dark:text-purple-300 hover:underline flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
