import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const diff = endTime - Date.now();
        return {
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60)
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center space-x-1">
            <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
        </div>
    );
};

const ProgressBar = ({ current, max }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <motion.div
            className="h-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${(current / max) * 100}%` }}
            transition={{ duration: 1 }}
        />
    </div>
);
export const DealsGrid = ({ deals, joinedDeals, onJoin }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleJoinClick = (deal) => {
    if (joinedDeals.includes(deal.id)) return;
    setSelectedDeal(deal);
    setShowConfirm(true);
  };

  const confirmJoin = () => {
    if (selectedDeal) {
      onJoin(selectedDeal.id);
      toast.success(`You have joined the deal: ${selectedDeal.title}, Go to my orders to see it.`);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <motion.div
            key={deal.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img src={deal.image} className="w-full h-48 object-cover" />
              {deal.tag && (
                <motion.div
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${deal.tag === 'HOT' ? 'bg-red-500 text-white' : 'bg-yellow-400 text-gray-900'}`}
                >
                  {deal.tag}
                </motion.div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{deal.title}</h3>
                <CountdownTimer endTime={deal.endTime} />
              </div>

              <div className="mt-2">
                <ProgressBar
                  current={deal.joined}
                  max={deal.required}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {deal.required - deal.joined} more needed
                </p>
              </div>

              <div className="flex items-end mt-4">
                <div className="flex-1">
                  <span className="text-gray-400 line-through mr-2">₹{deal.originalPrice}0</span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{deal.groupPrice}0
                  </span>
                </div>
                <button
                  onClick={() => handleJoinClick(deal)}
                  className={`px-4 py-2 rounded-full font-medium ${joinedDeals.includes(deal.id)
                    ? 'bg-green-200 text-green-800'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                >
                  {joinedDeals.includes(deal.id) ? 'Joined!' : 'Join Now'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Confirm Modal */}
      {showConfirm && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Join this deal?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              By joining <b>{selectedDeal.title}</b>, you agree to buy this product via <b>Cash on Delivery</b>. <br />
              You also accept our <span className="underline"><Link to="/term&condition" className="underline text-blue-500">Terms & Conditions</Link></span>.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white"
                onClick={confirmJoin}
              >
                Accept & Join
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
