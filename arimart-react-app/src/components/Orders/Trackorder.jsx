import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { trackOrder } from '../../Store/orderSlice';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fetchGroupStatus } from '../../Store/groupBuySlice';

const stages = [
    { key: "Placed", field: "AddedDate", desc: "Order placed" },
    { key: "Assigned", field: "DassignidTime", desc: "Order assigned to delivery" },
    { key: "Picked Up", field: "DvendorpickupTime", desc: "Order picked up by vendor" },
    { key: "Shipped", field: "ShipOrderidTime", desc: "Order shipped" },
    { key: "Delivered", field: "DdeliverredidTime", desc: "Order delivered" },
];

const Trackorder = () => {
    const { trackId } = useParams();
    const dispatch = useDispatch();
    // Get tracking data from Redux - now expecting an array
    const { track: trackingData, loading, error } = useSelector(state => state.order);
    const groupState = useSelector((state) => state.group);
    const { statusByGid = {} } = groupState || {};
    console.log(statusByGid)


    // Transform tracking data to products array
    // Transform tracking data to products array
    const products = trackingData[0]?.items?.map(item => ({
        id: item.id, // Using the item's own ID (20092)
        name: item.productDetails?.name || 'Unknown Product',
        groupid: item.groupid,
        image: item.productDetails?.image,
        description: item.productDetails?.description,
        price: item.deliveryprice, // Using deliveryprice (29)
        quantity: item.qty, // Using qty (1)
        category: item.category?.name, // "Mobiles & Tablets"
        subcategory: item.subCategory?.name, // "Power Banks"
        childCategory: item.childCategory?.name, // "Business Laptops"
        orderid: item.id, // 20092
        pdid: item.pdid, // 13
        productId: item.productDetails?.id, // 9
        // Tracking information
        trackingInfo: {
            status: item.status, // "Placed"
            dassignidTime: item.dassignidTime,
            dvendorpickupTime: item.dvendorpickupTime,
            shipOrderidTime: item.shipOrderidTime,
            ddeliverredidTime: item.ddeliverredidTime,
            addedDate: trackingData[0].orderDate // "2025-07-12T12:06:11.027"
        },

        // Order-level information
        orderInfo: {
            trackId: trackingData[0].trackId, // "ORD-20250712120611026-09E519"
            overallStatus: trackingData[0].overallStatus, // "Placed"
            totalAmount: trackingData[0].totalAmount, // 29
            totalItems: trackingData[0].totalItems // 1
        }
    })) || [];

    const appliedPromo = trackingData[0]?.appliedPromo;
    useEffect(() => {
        const uniqueGroupIds = [...new Set(products.map(p => p.groupid).filter(Boolean))];
        uniqueGroupIds.forEach(groupid => {
            if (!statusByGid[groupid]) {
                dispatch(fetchGroupStatus(groupid));
            }
        });
    }, [products, dispatch, statusByGid]);

    useEffect(() => {
        if (trackId) {
            dispatch(trackOrder(trackId))
                .unwrap()
                .catch(() => toast.error("Failed to fetch tracking data"));
        }
    }, [trackId, dispatch]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!trackingData || trackingData.length === 0) return <div className="p-10 text-center">No tracking data found.</div>;


    const getGroupStatusText = (groupId) => {
        const groupStatus = statusByGid[groupId];
        if (!groupStatus) return "Loading...";

        if (groupStatus.status === 'complete') {
            return "Group Complete";
        } else if (groupStatus.status === 'pending') {
            const remaining = groupStatus.remainingMembers;
            return `${remaining} members pending`;
        }
        return groupStatus.status;
    };


    let overridePlacedStatus = false;
    if (products[0]?.groupid) {
        const groupStatus = statusByGid[products[0].groupid];
        if (groupStatus?.status === 'pending') {
            overridePlacedStatus = true;
        }
    }
    // Use the first item's tracking info for the timeline (assuming all items in same order have same tracking)
    const firstItemTrackingInfo = products[0]?.trackingInfo;

    const currentTrack = {
        Placed: overridePlacedStatus ? null : (firstItemTrackingInfo?.status || firstItemTrackingInfo?.addedDate),
        Assigned: firstItemTrackingInfo?.dassignidTime,
        "Picked Up": firstItemTrackingInfo?.dvendorpickupTime,
        Shipped: firstItemTrackingInfo?.shipOrderidTime,
        Delivered: firstItemTrackingInfo?.ddeliverredidTime
    };

    // Tracking timeline
    const timeline = stages.map((stage, i) => {
        const time = currentTrack[stage.key];
        return {
            ...stage,
            time: time ? new Date(time).toLocaleString() : null,
            completed: !!time,
        };
    });

    // Calculate total amount
    const totalAmount = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                    Track the delivery of order #{trackId}
                </h2>
                <div className='flex justify-between gap-3'>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {products.length} item{products.length > 1 ? 's' : ''} in this order
                    </p>
                    <Link to='/orders'
                        whileHover={{ scale: 1.02 }}
                        className='flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium w-fit bg-orange-200'
                    >Go to My Order <ArrowRight className='w-4 h-4' />
                    </Link>
                </div>
                {/* Order Product Details */}
                <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
                    <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
                        <AnimatePresence>
                            {products.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-6 text-gray-500"
                                >
                                    No product details available.
                                </motion.div>
                            ) : (
                                products.map((item, index) => (
                                    <motion.div
                                        key={`${item.id}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="space-y-4 p-6"
                                    >
                                        {/* Product Header */}
                                        <motion.div
                                            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
                                            whileHover={{ scale: 1.005 }}
                                        >
                                            <motion.div
                                                className="h-14 w-14 shrink-0 overflow-hidden rounded-lg"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                <img
                                                    className="h-full w-full object-cover"
                                                    src={item.image ? `http://localhost:5015/Uploads/${item.image}` : '/placeholder-image.jpg'}
                                                    alt={item.name || 'Product'}
                                                    loading="lazy"
                                                />
                                            </motion.div>

                                            <div className="flex-1 min-w-0">
                                                <motion.h3
                                                    className="font-medium text-gray-900 dark:text-white text-lg line-clamp-2"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                >
                                                    {item.name || 'Product Name'}
                                                </motion.h3>
                                                {item.groupid && (
                                                    <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                                                        Group: {getGroupStatusText(item.groupid)}
                                                    </span>
                                                )}

                                                <motion.div
                                                    className="flex items-center gap-2 mt-1 flex-wrap"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {item.category && (
                                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                                            {item.category}
                                                        </span>
                                                    )}
                                                    {item.category && item.subcategory && (
                                                        <span className="text-gray-400">›</span>
                                                    )}
                                                    {item.subcategory && (
                                                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                                                            {item.subcategory}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </motion.div>

                                        {/* Product Details */}
                                        <motion.div
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="flex-1">
                                                {item.description && (
                                                    <motion.p
                                                        className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3"
                                                        whileHover={{ scale: 1.01 }}
                                                    >
                                                        {item.description}
                                                    </motion.p>
                                                )}
                                                <motion.p
                                                    className="text-xs mt-2 text-gray-400 dark:text-gray-500"
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">Item ID:</span> {item.orderid}
                                                </motion.p>
                                            </div>

                                            <motion.div
                                                className="flex items-center justify-end gap-4"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <span className="text-base font-medium text-gray-900 dark:text-white">
                                                    ×{item.quantity}
                                                </span>
                                                <motion.span
                                                    className="text-xl font-bold text-gray-900 dark:text-white"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                </motion.span>
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>

                        {/* Order Summary */}
                        <motion.div
                            className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.div
                                className="flex items-center justify-between gap-4"
                                whileHover={{ scale: 1.01 }}
                            >
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    <div className='flex items-center gap-2'>
                                    <span>Subtotal ({products.length} item{products.length > 1 ? 's' : ''})</span>
                                    {appliedPromo && (
                                        <motion.div
                                            className="flex items-center justify-between gap-4 py-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Applied Code
                                                </span>
                                                <motion.span
                                                    className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200"
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    {appliedPromo.code}
                                                </motion.span>
                                            </div>
                                        </motion.div>
                                    )}
                                    </div>
                                </span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                    ₹{totalAmount.toLocaleString()}
                                </span>
                            </motion.div>

                            <motion.div
                                className="flex items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                                whileHover={{ scale: 1.01 }}
                            >
                                <motion.span
                                    className="text-lg font-bold text-gray-900 dark:text-white"
                                    initial={{ x: -10 }}
                                    animate={{ x: 0 }}
                                >
                                    Total
                                </motion.span>
                                <motion.span
                                    className="text-lg font-bold text-gray-900 dark:text-white"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                >
                                    ₹{totalAmount.toLocaleString()}
                                </motion.span>
                            </motion.div>

                            {/* Progress bar for order completion */}
                            <motion.div
                                className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                            >
                                <motion.div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${(timeline.filter(s => s.completed).length / stages.length) * 100}%`
                                    }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="mt-6 grow sm:mt-8 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order Tracking</h3>

                            {/* Animated Progress Line */}
                            <div className="relative ms-3">
                                <motion.div
                                    className="absolute left-[11px] top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700 origin-top"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-full bg-green-500 dark:bg-green-400 origin-top"
                                        initial={{ scaleY: 0 }}
                                        animate={{
                                            scaleY: timeline.filter(s => s.completed).length / stages.length
                                        }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 1,
                                            type: "spring",
                                            damping: 10
                                        }}
                                    />
                                </motion.div>

                                <ol className="relative ms-3 border-s-0">
                                    {timeline.map((stage, idx) => {
                                        const isCurrent = stage.completed &&
                                            (idx === timeline.length - 1 || !timeline[idx + 1].completed);

                                        return (
                                            <motion.li
                                                key={stage.key}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{
                                                    opacity: 1,
                                                    x: 0,
                                                    transition: {
                                                        delay: idx * 0.15,
                                                        type: "spring",
                                                        stiffness: 100
                                                    }
                                                }}
                                                className={`mb-10 ms-6 ${stage.completed ? "text-green-700 dark:text-green-500" : "text-gray-500 dark:text-gray-400"}`}
                                            >
                                                {/* Animated Marker */}
                                                <motion.span
                                                    className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full
                  ${stage.completed ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-700"}
                  ring-8 ring-white dark:ring-gray-800`}
                                                    animate={{
                                                        scale: isCurrent ? [1, 1.1, 1] : 1,
                                                        boxShadow: isCurrent ? "0 0 0 4px rgba(74, 222, 128, 0.5)" : "none"
                                                    }}
                                                    transition={{
                                                        scale: isCurrent ? {
                                                            repeat: Infinity,
                                                            duration: 1.5,
                                                            ease: "easeInOut"
                                                        } : {},
                                                        boxShadow: { duration: 0.3 }
                                                    }}
                                                >
                                                    {stage.completed ? (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 500,
                                                                damping: 15
                                                            }}
                                                        >
                                                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="12" r="10" fill="currentColor" />
                                                                {isCurrent && (
                                                                    <motion.circle
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="6"
                                                                        fill="white"
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ delay: 0.3 }}
                                                                    />
                                                                )}
                                                            </svg>
                                                        </motion.div>
                                                    ) : (
                                                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" fill="currentColor" />
                                                        </svg>
                                                    )}
                                                </motion.span>

                                                {/* Stage Content */}
                                                <motion.div
                                                    className={`p-3 rounded-lg transition-all duration-300 ${isCurrent ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="mb-0.5 text-base font-semibold">{stage.key}</h4>
                                                        {isCurrent && (
                                                            <motion.span
                                                                className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.5 }}
                                                            >
                                                                Current
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm">{stage.desc}</p>
                                                    <div className="text-xs mt-1">
                                                        {stage.time ? (
                                                            <motion.span
                                                                className="text-green-600 dark:text-green-400"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.4 }}
                                                            >
                                                                {stage.time}
                                                            </motion.span>
                                                        ) : (
                                                            <span className="italic text-gray-400">Pending  </span>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </motion.li>
                                        );
                                    })}
                                </ol>
                            </div>

                            <div className="gap-4 sticky bottom-5 md:flex sm:items-center">
                                <motion.button
                                    type="button"
                                    className="w-full rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel the order
                                </motion.button>
                                {/* <motion.a
                                    href="#"
                                    className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 sm:mt-0"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Order details
                                </motion.a> */}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Trackorder