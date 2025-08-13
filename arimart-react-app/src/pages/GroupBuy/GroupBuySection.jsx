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

export const GroupBuySection = ({ userId, product, type = "", onGroupReady }) => {
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

  useEffect(() => {
    if (gid && referCodeData?.refercode && onGroupReady) {
      onGroupReady({
        gid,
        refercode: referCodeData.refercode,
        isGroupOwner
      });
    }
  }, [gid, referCodeData?.refercode, isGroupOwner, onGroupReady]);

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
    const referCode = referCodeData?.refercode;
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
      <div className="flex items-start gap-3">
        {/* Vendor Image with Name Below */}
        <div className="flex flex-col items-center">
          <div className="p-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-sm mb-1">
            {currentGroup?.image1 ? (
              <img
                src={"https://apiari.kuldeepchaurasia.in/uploads/" + currentGroup.image1}
                alt="Group"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Users className="w-5 h-5 text-white" />
            )}
          </div>
          <p className="text-xs font-medium text-gray-800 dark:text-white text-center max-w-[60px] truncate">
            {currentGroup?.vendorName || "Group"}
          </p>
        </div>

        {/* Main Content - Progress and Timer */}
        <div className="flex-1 min-w-0">
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div className="flex gap-1 text-xs font-medium text-purple-800 dark:text-purple-200">
              {isGroupBuyActive && timeLeft.days > 0 ? (
                <>
                  <span>{timeLeft.days}d</span>
                  <span>{timeLeft.hours}h</span>
                  <span>{timeLeft.minutes}m</span>
                </>
              ) : isGroupBuyActive ? (
                <>
                  <span>{timeLeft.hours}h</span>
                  <span>{timeLeft.minutes}m</span>
                  <span>{timeLeft.seconds}s</span>
                </>
              ) : (
                <span>Ended</span>
              )}
            </div>
            <div className="text-xs bg-green-100 text-green-800 px-1 rounded">
              {discountPercentage}% OFF
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min((currentMembers / requiredMembers) * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {currentMembers}/{requiredMembers}
            </span>
          </div>
          {remainingMembers > 0 && (
            <p className="text-xs text-orange-500 dark:text-orange-400">
              {remainingMembers} more needed
            </p>
          )}
        </div>

        {/* Price & Join Button */}
        <div className="flex flex-col items-end justify-between h-full">
         <div className="text-right">
  <span className="text-xs text-gray-600 dark:text-gray-300">Get at </span>
  <span className="text-lg font-bold text-green-700 dark:text-green-400">₹{groupPrice}</span>
</div>
          <button
            onClick={handleJoinToOrder}
            className="px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-md whitespace-nowrap mt-2"
          >
            {type == "joined" ? "View" : "Join to order"}
          </button>
        </div>
      </div>
    </div>
  );
};
