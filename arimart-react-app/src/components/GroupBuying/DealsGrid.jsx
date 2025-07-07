import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { joinGroup, fetchGroupMembers, resetGroupState } from "../../Store/groupBuySlice";

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date().getTime();
    const target = new Date(endTime).getTime();

    const diff = target - now;
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    if (!endTime) return;

    const timer = setInterval(() => {
      const updated = getTimeLeft();
      setTimeLeft(updated);

      if (!updated) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) {
    return (
      <div className="text-xs text-red-500 font-medium">
        Deal Ended
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-xs">
      {timeLeft.days > 0 && (
        <div className="bg-gray-700 text-white dark:bg-gray-700 px-2 py-1 rounded">
          {String(timeLeft.days).padStart(2, '0')}d
        </div>
      )}
      <div className="bg-gray-700 text-white dark:bg-gray-700 px-2 py-1 rounded">
        {String(timeLeft.hours).padStart(2, '0')}h
      </div>
      <div className="bg-gray-700 text-white dark:bg-gray-700 px-2 py-1 rounded">
        {String(timeLeft.minutes).padStart(2, '0')}m
      </div>
      <div className="bg-gray-700 text-white dark:bg-gray-700 px-2 py-1 rounded">
        {String(timeLeft.seconds).padStart(2, '0')}s
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

const DealsGrid = ({ deals, joinedDeals, onJoin, groupMembers }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleJoinClick = (deal) => {
    if (joinedDeals.includes(deal.Gid)) return;
    setSelectedDeal(deal);
    setShowConfirm(true);
  };

  const confirmJoin = () => {
    if (selectedDeal) {
      onJoin(selectedDeal);
      toast.success(`You have joined the deal: ${selectedDeal.productName}`);
      setShowConfirm(false);
    }
  };
console.log(deals)
  
   const generateProductLink = () => {
    const marketParam = deals.categoryName;
    const subcategoryParam = deals.subcategoryName || deals.name;
    return ``;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {deals.map((deal) => {
          const joinedCount = groupMembers?.filter((m) => m.groupid === deal.Gid).length || 0;
          return (
            <motion.div
              key={deal.Gid}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/category/${encodeURIComponent(deal.categoryName)}/${encodeURIComponent(deal.subcategoryName)}/product/${deal.pid}`} className="relative">
                <img 
                  src={"http://localhost:5015/Uploads/" + deal.image} 
                  alt={deal.productName} 
                  className="w-full h-48 object-cover" 
                />
                {deal.categoryName && (
                  <motion.div
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                      deal.categoryName === 'HOT' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-yellow-400 text-gray-900'
                    }`}
                  >
                    {deal.categoryName}
                  </motion.div>
                )}
              </Link>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{deal.productName}</h3>
                </div>

<CountdownTimer endTime={deal.eventSend1} />
                <div className="mt-2">
                  <ProgressBar
                    current={joinedCount}
                    max={deal.gqty}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {deal.gqty - joinedCount} more needed
                  </p>
                </div>

                <div className="flex items-end mt-4">
                  <div className="flex-1">
                    <span className="text-gray-400 line-through mr-2">₹{deal.totalprice}0</span>
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ₹{deal.gprice}0
                    </span>
                  </div>
                  <button
                    onClick={() => handleJoinClick(deal)}
                    className={`px-4 py-2 rounded-full font-medium ${
                      joinedDeals.includes(deal.Gid) 
                        ? 'bg-green-200 text-green-800'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {joinedDeals.includes(deal.Gid) ? 'Joined!' : 'Join Now'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Confirm Modal */}
      {showConfirm && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Join this deal?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              By joining <b>{selectedDeal.productName}</b>, you agree to buy this product via <b>Cash on Delivery</b>. <br />
              You also accept our <Link to="/term&condition" className="underline text-blue-500">Terms & Conditions</Link>.
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

export default DealsGrid;