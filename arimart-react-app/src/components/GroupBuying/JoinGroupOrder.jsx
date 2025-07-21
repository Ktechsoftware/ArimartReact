import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    UserPlus,
    Info, ShoppingCart,
    Minus,
    Plus,
    CheckCircle,
    ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    fetchGroupById,
    fetchGroupMembers,
    leaveGroup,
    joinGroup,
    resetGroupState,
    fetchMyJoinedGroups
} from '../../Store/groupBuySlice';
import { useCart } from '../../context/CartContext';

const JoinGroupOrder = () => {
    const navigate = useNavigate();
    const { groupid, grouprefercode } = useParams();
    const userData = useSelector((state) => state.auth.userData);
    const { addToCart, setCurrentGroup, isItemInCart } = useCart();
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(null);
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(userData?.id);
    const [quantity, setQuantity] = useState(1); // Added quantity state

    const {
        groupsById,
        membersByGid,
        myJoinedGroups,
        isLoadingMembers,
        error,
        isLeaving,
        isJoining,
        leaveSuccess,
        joinSuccess
    } = useSelector(state => state.group);

    const group = groupsById?.[groupid];
    const groupMembers = membersByGid?.[groupid] || [];

    // Check if user is in THIS specific group
    const isUserInCurrentGroup = groupMembers?.some(member =>
        member.userid === currentUserId || member.userId === currentUserId
    );

    // Check if user is in ANY group for the same product
    const userJoinedGroupForProduct = myJoinedGroups?.find(joinedGroup =>
        joinedGroup.productId === group?.productId &&
        (joinedGroup.Gid === groupid || joinedGroup.gid === groupid)
    );

    // Check if user is in a DIFFERENT group for the same product
    const userInDifferentGroup = myJoinedGroups?.find(joinedGroup => {
        const joinedGroupId = joinedGroup.Gid || joinedGroup.gid;
        const isCurrentUser = joinedGroup.userId === currentUserId || joinedGroup.userid === currentUserId;

        return (
            joinedGroup.productId === group?.productId &&
            joinedGroupId !== groupid &&
            isCurrentUser
        );
    });

    // First, set the group context when user joins the group
    useEffect(() => {
        if (isUserInCurrentGroup && groupid) {
            setCurrentGroup(groupid);
        }
    }, [isUserInCurrentGroup, groupid]);

    // Fetch group details, members, and user's joined groups
    useEffect(() => {
        if (groupid && currentUserId) {
            dispatch(fetchGroupById(groupid));
            dispatch(fetchGroupMembers(groupid));
            dispatch(fetchMyJoinedGroups(currentUserId));
        }

        return () => {
            dispatch(resetGroupState());
        };
    }, [groupid, currentUserId, dispatch]);

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

        if (userInDifferentGroup) {
            toast.error("You are already in another group for this product");
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

    // Handle quantity change
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };
    // console.log(group)
    const isProductInCart = group?.pdid ? isItemInCart(group.pdid, groupid) : false;
    // Handle add to cart
    const handleAddToCart = () => {
        if (quantity < 1) {
            toast.error("Please select a valid quantity");
            return;
        }

        setCurrentGroup(groupid);
        const cartItem = {
            pdid: group.pdid,
            productName: group.productName,
            name: group.productName,
            netprice: group.gprice,
            price: group.gprice,
            image: group.image,
            categoryName: group.categoryName || '',
            subcategoryName: group.subcategoryName || '',
        };

        addToCart(cartItem, quantity, groupid);
        toast.success(`${quantity} item(s) added to cart!`);
    };

    // Handle go to cart
    const handleGoToCart = () => {
        navigate('/cart');
    };

    // Handle join success
    useEffect(() => {
        if (joinSuccess) {
            toast.success("Successfully joined the group buy!");
            // Refresh group members and user's joined groups
            dispatch(fetchGroupMembers(groupid));
            dispatch(fetchMyJoinedGroups(currentUserId));
            dispatch(resetGroupState());
        }
    }, [joinSuccess, dispatch, groupid, currentUserId]);

    // Handle leave success
    useEffect(() => {
        if (leaveSuccess) {
            toast.success("You've left the group buy");
            // Refresh group members and user's joined groups
            dispatch(fetchGroupMembers(groupid));
            dispatch(fetchMyJoinedGroups(currentUserId));
            dispatch(resetGroupState());
        }
    }, [leaveSuccess, dispatch, groupid, currentUserId]);

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

    // Render user status based on membership
    const renderUserStatus = () => {
        if (userInDifferentGroup) {
            return (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <Info className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-orange-800 dark:text-orange-400">
                                You're in another group
                            </h4>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                You're already part of a different group for this product. You can only join one group per product.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (isUserInCurrentGroup) {
            return (
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
                                {currentMembers >= requiredMembers
                                    ? "Group is complete! You can now add this item to your cart."
                                    : `Waiting for ${membersNeeded} more member${membersNeeded > 1 ? 's' : ''} to complete the group.`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
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
                            Click the join button to participate in this group buy and get the discounted price
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Render action buttons based on user status
    const renderActionButtons = () => {
        if (userInDifferentGroup) {
            return (
                <div className="pt-4 space-y-3">
                    <motion.button
                        disabled={true}
                        className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                    >
                        Already in another group
                    </motion.button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        You can only join one group per product
                    </p>
                </div>
            );
        } else if (isUserInCurrentGroup) {
            return (
                <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-4">
                    {isProductInCart ? (
                        // Enhanced "Go to Cart" button with clear messaging
                        <div className="w-full flex flex-col gap-2">
                            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-50 dark:bg-emerald-900/20 rounded-lg border border-green-200 dark:border-emerald-800">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-emerald-400" />
                                <span className="text-sm font-medium text-green-700 dark:text-emerald-200">
                                    This item is already in your Group Cart
                                </span>
                            </div>

                            <motion.button
                                onClick={handleGoToCart}
                                className="w-full py-3 rounded-lg font-medium shadow-sm transition-all duration-200 
                    bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="whitespace-nowrap">Go to Group Cart</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </motion.button>
                        </div>
                    ) : (
                        // Original controls when product is not in cart
                        <>
                            {/* Quantity Controller + Add to Cart */}
                            <div className="flex items-stretch flex-1 gap-2">
                                {/* Quantity Controller - Stacked on small screens */}
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button
                                        className="px-3 py-2 sm:px-2.5 sm:py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 sm:px-3 sm:py-1.5 text-sm font-medium text-gray-900 dark:text-white min-w-[2.5rem] text-center border-x border-gray-200 dark:border-gray-700">
                                        {quantity}
                                    </span>
                                    <button
                                        className="px-3 py-2 sm:px-2.5 sm:py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Add to Cart Button - Full width on mobile */}
                                <motion.button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-3 sm:py-2.5 rounded-lg font-medium shadow-sm transition-all duration-200 
                        bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700
                        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-center gap-1.5">
                                        <ShoppingBag className="w-4 h-4" />
                                        <span className="whitespace-nowrap">Add to Group Cart</span>
                                    </div>
                                </motion.button>
                            </div>

                            {/* Leave Group Button - Full width on mobile */}
                            <motion.button
                                onClick={handleLeaveGroup}
                                disabled={isLeaving}
                                className="py-3 sm:py-2.5 px-4 border border-red-500/50 text-red-600 dark:text-red-400 
                     hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg font-medium 
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLeaving ? (
                                    <div className="flex items-center justify-center gap-1.5">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                                        <span>Leaving...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-1.5">
                                        <LogOut className="w-4 h-4" />
                                        <span>Leave Group</span>
                                    </div>
                                )}
                            </motion.button>
                        </>
                    )}
                </div>
            );
        } else {
            return (
                <div className="pt-4 space-y-3">
                    <motion.button
                        onClick={handleJoinGroup}
                        disabled={isJoining || !timeLeft}
                        className={`w-full py-3 rounded-lg font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2
                                ${!timeLeft
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                </div>
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-xl max-w-md md:max-w-full">
                {/* Header with group code */}
                <div className="px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800 flex items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Group Buy</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-xs font-medium mr-2 text-gray-500 dark:text-gray-400">Code:</span>
                        <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap">
                            {grouprefercode}
                        </span>
                    </div>
                </div>

                {/* Product info */}
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 mx-auto xs:mx-0">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={group.image ? `https://apiari.kuldeepchaurasia.in/Uploads/${group.image}` : '/placeholder-product.jpg'}
                                    alt={group.productName}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                            <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
                                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-base xs:text-lg">
                                    {group.productName}
                                </h3>
                                <span className={`self-start xs:self-auto px-2 py-1 rounded-full text-xs font-bold ${timeLeft ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                                    {timeLeft ? 'ACTIVE' : 'ENDED'}
                                </span>
                            </div>

                            {/* Price Information */}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <span className="text-sm xs:text-base line-through text-gray-500 dark:text-gray-400">
                                    ₹{regularPrice}
                                </span>
                                <span className="text-lg xs:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                                    ₹{groupPrice}
                                </span>
                                <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs xs:text-sm font-semibold whitespace-nowrap">
                                    {discountPercentage}% OFF
                                </span>
                            </div>

                            {/* Action Buttons - Will take full width on mobile */}
                            <div className="mt-4">
                                {renderActionButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Rest of the component remains the same... */}
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
                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>

                            <div className="text-center py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-blue-700 dark:text-blue-400 font-medium">
                                    {membersNeeded > 0
                                        ? `${membersNeeded} more ${membersNeeded === 1 ? 'member' : 'members'} needed to unlock the deal!`
                                        : 'Group is complete! Deal unlocked! 🎉'
                                    }
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
                            {renderUserStatus()}
                        </div>
                    </div>

                    {/* Referral Section - Only show if user is in THIS group */}
                    {isUserInCurrentGroup && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-purple-600" />
                                Invite Friends & Earn Rewards
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Group Referral Code
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
                                                        {member.userName || `Member ${index + 1}`}
                                                        {(member.userid === currentUserId || member.userId === currentUserId) && (
                                                            <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-2 py-1 rounded-full">
                                                                You
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Joined {new Date(member.addedDate).toLocaleDateString()}
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
                <div className="mb-20 md:mb-0 space-y-6">

                    {/* Mobile padding bottom to prevent content from being hidden behind sticky buttons */}
                    <div className="md:hidden md:h-32"></div>
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
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Minimum {requiredMembers} members required to unlock the group price
                                </p>
                            </motion.li>
                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Group buy expires on {new Date(group.eventSend1).toLocaleDateString()}
                                </p>
                            </motion.li>
                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    You can only join one group per product
                                </p>
                            </motion.li>
                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Payment is processed only when group is complete
                                </p>
                            </motion.li>
                            <motion.li
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    You can leave the group before it completes
                                </p>
                            </motion.li>
                        </ul>
                    </div>

                    {/* Group Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-purple-600" />
                            Group Details
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Regular Price</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{regularPrice}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Group Price</span>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">₹{groupPrice}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">You Save</span>
                                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                    ₹{regularPrice - groupPrice} ({discountPercentage}%)
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Required Members</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{requiredMembers}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Expires On
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {new Date(group.eventSend1).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* Warning for expired groups */}
                    {!timeLeft && (
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-red-800 dark:text-red-400">
                                        Group Buy Expired
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        This group buy has ended. You can no longer join this group.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JoinGroupOrder;