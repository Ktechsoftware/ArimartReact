import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopOrdersByUser } from '../../Store/Tops/topOrdersSlice';
import { Link } from 'react-router-dom';

const RecentOrders = ({ userId }) => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.topOrders);

  useEffect(() => {
    if (userId) dispatch(fetchTopOrdersByUser(userId));
  }, [dispatch, userId]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  if (!orders?.length) {
    return <div className="text-center text-gray-500 p-4">No recent orders.</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Recent orders
      </h3>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {orders.map((order, index) => (
            <div
              key={order.trackId}
              className={`grid grid-cols-12 items-center gap-4 ${index < orders.length - 1 ? 'border-b' : ''} border-gray-200 py-3 dark:border-gray-700`}
            >
              {/* Order ID - Wider column */}
              <div className="col-span-4 sm:col-span-5 md:col-span-4">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</div>
                <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  <Link 
                    to={"/orders/track/" + order.trackId} 
                    className="hover:text-primary-600 hover:underline dark:hover:text-primary-400"
                  >
                    {order.trackId}
                  </Link>
                </div>
              </div>

              {/* Date */}
              <div className="col-span-3 sm:col-span-2 md:col-span-2">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(order.orderDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {/* Price */}
              <div className="col-span-2 sm:col-span-2">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  ₹{order.totalAmount}
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2 sm:col-span-2">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                <div
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'Completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                >
                  {order.status}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 text-right">
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  title="Actions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;