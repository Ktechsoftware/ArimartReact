import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchUserAnalytics } from '../../Store/analyticsSlice';
import {
    ShoppingBag,
    Users,
    Heart,
    Share2,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    ArrowRightCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GeneralOverview = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth?.userData?.id);
    const { data, loading } = useSelector((state) => state.analytics);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserAnalytics(userId));
        }
    }, [dispatch, userId]);

    const stats = [
        {
            title: 'Orders made',
            icon: <ShoppingBag className="w-8 h-8 text-indigo-500 mb-2" />,
            key: 'orders',
            link : "/orders"
        },
        {
            title: 'Group Buy Joined',
            icon: <Users className="w-8 h-8 text-purple-500 mb-2" />,
            key: 'groupBuyJoined',
            link : "/group-buying?tab=my-joined"
        },
        {
            title: 'Favorite products added',
            icon: <Heart className="w-8 h-8 text-pink-500 mb-2" />,
            key: 'favorites',
            link : "/wishlist"
        },
        {
            title: 'Total Referral',
            icon: <Share2 className="w-8 h-8 text-green-500 mb-2" />,
            key: 'referrals',
            link : '/home/referandearn'
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-6 border-y border-gray-200 py-6 dark:border-gray-700 md:py-8 lg:grid-cols-4 xl:gap-16">
            {stats.map((stat) => {
                const metric = data?.[stat.key] || {};
                const value = metric?.value ?? 0;
                const change = metric?.change ?? 0;
                const previous = metric?.previous ?? 0;
                const isPositive = change >= 0;

                return (
                    <div key={stat.key}>
                        {stat.icon}
                        <h3 className="mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.title}</h3>

                        {/* Value and change */}
                        <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                            {loading ? <Skeleton width={30} /> : value}
                            <span
                                className={`ms-2 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${isPositive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}
                            >
                                {loading ? (
                                    <Skeleton width={40} height={14} />
                                ) : (
                                    <>
                                        {isPositive ? (
                                            <ArrowUpRight className="w-3.5 h-3.5 me-1" />
                                        ) : (
                                            <ArrowDownRight className="w-3.5 h-3.5 me-1" />
                                        )}
                                        {Math.abs(change)}%
                                    </>
                                )}
                            </span>
                        </span>

                        {/* Previous value */}
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                            <Info className="w-4 h-4 me-1.5" />
                            {loading ? <Skeleton width={80} /> : `vs ${previous} last 3 months`}
                        </p>
                        <Link to={stat.link} className="mt-3 inline-flex items-center text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                            View details <ArrowRightCircle className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default GeneralOverview;
