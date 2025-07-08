import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    Clock,
    Users,
    Tag,
    Share2,
    Copy,
    User,
    ChevronRight,
    AlertCircle,
    ShoppingBag,
    Gift,
    ShieldCheck,
    Calendar,
    LogOut,
    UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    fetchGroupById,
    fetchGroupMembers,
    leaveGroup,
    joinGroup,
    resetGroupState
} from '../../Store/groupBuySlice';
import { useCart } from '../../context/CartContext';

const JoinGroupOrder = () => {
    const { groupid, grouprefercode } = useParams();
    const userData = useSelector((state) => state.auth.userData);
    const { addToGroupCart } = useCart();
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(null);
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(userData?.id);

    const {
        groupsById,
        groupMembers,
        isLoadingMembers,
        error,
        isLeaving,
        isJoining,
        leaveSuccess,
        joinSuccess
    } = useSelector(state => state.group);

    const group = groupsById?.[groupid];
    // console.log(group)
    const isUserMember = groupMembers?.some(member =>
        member.userid === currentUserId || member.userId === currentUserId
    );
    // console.log(isUserMember)
    // console.log(groupMembers)
    // console.log(currentUserId)

    // Fetch group details and members
    useEffect(() => {
        if (groupid) {
            dispatch(fetchGroupById(groupid));
            dispatch(fetchGroupMembers(groupid));
        }

        return () => {
            dispatch(resetGroupState());
        };
    }, [groupid, dispatch]);

    // Countdown timer
    useEffect(() => {
        if (!group?.eventSend1) return;

        const endTime = new Date(group.eventSend1).getTime();

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
    }, [group?.eventSend1]);

    // Handle join group
    const handleJoinGroup = () => {
        if (!timeLeft) {
            toast.error("This group buy has ended");
            return;
        }

        const joinData = {
            groupId: groupid,
            userId: currentUserId,
            referralCode: grouprefercode
        };

        dispatch(joinGroup(joinData));
    };

    // Handle leave group
    const handleLeaveGroup = () => {
        if (window.confirm("Are you sure you want to leave this group buy?")) {
            dispatch(leaveGroup({ groupId: groupid, userId: currentUserId }));
        }
    };

    // Handle join success
    useEffect(() => {
        if (joinSuccess) {
            toast.success("Successfully joined the group buy!");
            // Refresh group members to show updated list
            dispatch(fetchGroupMembers(groupid));
            dispatch(resetGroupState());
        }
    }, [joinSuccess, dispatch, groupid]);

    // Handle leave success
    useEffect(() => {
        if (leaveSuccess) {
            toast.success("You've left the group buy");
            // Refresh group members to show updated list
            dispatch(fetchGroupMembers(groupid));
            dispatch(resetGroupState());
        }
    }, [leaveSuccess, dispatch, groupid]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(resetGroupState());
        }
    }, [error, dispatch]);

    if (!group) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const currentMembers = groupMembers?.length || 0;
    const requiredMembers = group.gqty || 5;
    const progressPercentage = Math.min((currentMembers / requiredMembers) * 100, 100);
    const membersNeeded = Math.max(requiredMembers - currentMembers, 0);

    const regularPrice = group.netprice || group.price || 0;
    const groupPrice = group.gprice || 0;
    const discountPercentage = regularPrice > 0
        ? Math.round((1 - groupPrice / regularPrice) * 100)
        : 0;

    const shareUrl = grouprefercode
        ? `${window.location.origin}/groupbuy/join/${grouprefercode}`
        : "";

    const copyReferralCode = () => {
        navigator.clipboard.writeText(grouprefercode);
        setCopiedCode(true);
        toast.success("Referral code copied!");
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const copyShareUrl = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedUrl(true);
        toast.success("Share link copied!");
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="md:max-w-96 max-w-72 mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-lg sticky top-28 z-[5px] mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid items-center grid-cols-12 gap-4 p-1">
                    <div className="col-span-2">
                        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            <img
                                src={group.image ? `http://localhost:5015/uploads/${group.image}` : '/placeholder-product.jpg'}
                                alt={group.productName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="col-span-8 flex flex-col justify-center">
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-md font-bold text-gray-900 dark:text-white truncate">
                                {group.productName}
                            </h1>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                                {discountPercentage}% OFF
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                                ₹{regularPrice}
                            </span>
                            <span className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                ₹{groupPrice}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 flex items-center">
                                <ShoppingBag className="w-3 h-3 mr-1" />
                                Group Buy
                            </span>
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="col-span-2 flex items-center justify-end">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${timeLeft ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {timeLeft ? 'Active' : 'Ended'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Group Buy Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Group Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            Group Progress
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {currentMembers} of {requiredMembers} members joined
                                </span>
                                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                    {progressPercentage.toFixed(0)}%
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="text-center py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-blue-700 dark:text-blue-400 font-medium">
                                    {membersNeeded} more {membersNeeded === 1 ? 'member' : 'members'} needed to unlock the deal!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    {timeLeft && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-600" />
                                Time Remaining
                            </h2>

                            <div className="flex justify-center gap-4">
                                {timeLeft.days > 0 && (
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                            {timeLeft.days}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">DAYS</div>
                                    </div>
                                )}
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                        {String(timeLeft.hours).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">HOURS</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                        {String(timeLeft.minutes).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">MINUTES</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                        {String(timeLeft.seconds).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">SECONDS</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Status Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600" />
                            Your Status
                        </h2>

                        <div className="space-y-4">
                            {isUserMember ? (
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-green-800 dark:text-green-400">
                                                You're part of this group!
                                            </h4>
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                You'll be notified when the group buy is complete
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                            <UserPlus className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-blue-800 dark:text-blue-400">
                                                Join this group buy
                                            </h4>
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                Click the join button to participate in this group buy
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Referral Section - Only show if user is a member */}
                    {isUserMember && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-purple-600" />
                                Invite Friends & Earn Rewards
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Your Referral Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={grouprefercode || ''}
                                            readOnly
                                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-mono font-semibold text-purple-600 dark:text-purple-400"
                                        />
                                        <motion.button
                                            onClick={copyReferralCode}
                                            className="px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copiedCode ? 'Copied!' : 'Copy'}
                                        </motion.button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Shareable Link
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={shareUrl}
                                            readOnly
                                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm truncate"
                                        />
                                        <motion.button
                                            onClick={copyShareUrl}
                                            className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            <Share2 className="w-4 h-4" />
                                            {copiedUrl ? 'Copied!' : 'Share'}
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Pro Tip
                                    </h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        Share your referral link with friends. When they join using your link and make a purchase,
                                        you'll earn special rewards!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Group Members */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            Group Members ({currentMembers})
                        </h2>

                        <div className="space-y-3">
                            {isLoadingMembers ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                </div>
                            ) : groupMembers?.length > 0 ? (
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {groupMembers.map((member, index) => (
                                        <motion.li
                                            key={member.userid || index}
                                            className="py-3 flex items-center justify-between"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {member.username || `Member ${index + 1}`}
                                                        {(member.userid === currentUserId || member.userId === currentUserId) && (
                                                            <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-2 py-1 rounded-full">
                                                                You
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No members found in this group yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Rules & Actions */}
                <div className="space-y-6">
                    {/* Group Rules */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-purple-600" />
                            Group Buy Rules
                        </h2>

                        <ul className="space-y-3">
                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="mt-1 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">1</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    The deal will only be activated when we reach {requiredMembers} members.
                                </p>
                            </motion.li>

                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="mt-1 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">2</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    If the group doesn't reach the required members before the deadline,
                                    the group buy will be canceled and no charges will be made.
                                </p>
                            </motion.li>

                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="mt-1 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">3</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    You can invite friends to join this group using your referral code.
                                </p>
                            </motion.li>

                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="mt-1 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">4</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Once the group is successful, orders will be processed and shipped together.
                                </p>
                            </motion.li>

                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="mt-1 w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">5</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    You can leave the group anytime before the deadline if you change your mind.
                                </p>
                            </motion.li>
                        </ul>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-purple-600" />
                            Order Summary
                        </h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Product Price</span>
                                <span className="font-medium">₹{groupPrice}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Discount</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                    -₹{regularPrice - groupPrice}
                                </span>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                        ₹{groupPrice}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                {/* Join or Cart Button */}
                                {isUserMember ? (
                                    <motion.button
                                        onClick={() => addToGroupCart({
                                            id: group.productId,
                                            name: group.productName,
                                            price: group.gprice,
                                            image: group.image,
                                            groupId: groupid
                                        }, groupid, 1)}
                                        disabled={currentMembers < requiredMembers}
                                        className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-200
    ${currentMembers >= requiredMembers
                                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        whileHover={currentMembers >= requiredMembers ? { scale: 1.02 } : {}}
                                        whileTap={currentMembers >= requiredMembers ? { scale: 0.98 } : {}}
                                    >
                                        {currentMembers >= requiredMembers ? 'Add to Group Cart' : 'Waiting for more members'}
                                    </motion.button>


                                ) : (
                                    <motion.button
                                        onClick={handleJoinGroup}
                                        disabled={isJoining || !timeLeft}
                                        className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2
                                            ${!timeLeft
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                                            }`}
                                        whileHover={timeLeft ? { scale: 1.02 } : {}}
                                        whileTap={timeLeft ? { scale: 0.98 } : {}}
                                    >
                                        {isJoining ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                Joining...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5" />
                                                {timeLeft ? 'Join Group Buy' : 'Group Buy Ended'}
                                            </>
                                        )}
                                    </motion.button>
                                )}

                                {/* Leave Group Button - Only show if user is a member */}
                                {isUserMember && (
                                    <motion.button
                                        onClick={handleLeaveGroup}
                                        disabled={isLeaving}
                                        className="w-full py-3 border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isLeaving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
                                                Leaving...
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="w-5 h-5" />
                                                Leave Group
                                            </>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Safety & Security */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-purple-600" />
                            Safety & Security
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Secure Payments</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        All transactions are protected with bank-level encryption
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Money Back Guarantee</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Full refund if group buy doesn't reach minimum members
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                    <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white">Quality Assured</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        All products are verified and quality tested
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            Have questions about this group buy? Our support team is here to help!
                        </p>
                        <motion.button
                            className="w-full py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-purple-200 dark:border-purple-700"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Contact Support
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGroupOrder;