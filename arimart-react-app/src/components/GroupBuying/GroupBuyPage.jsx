import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import HeroBanner from './HeroBanner';
import TabBar from './TabBar';
import DealsGrid from './DealsGrid';
import { fetchAllGroups, fetchGroupMembers } from '../../Store/groupBuySlice';

export const GroupBuyPage = () => {
 const dispatch = useDispatch();
const { allGroups, isLoading, error, groupMembers } = useSelector((state) => state.group);

const [activeTab, setActiveTab] = useState('all');
const [joinedDeals, setJoinedDeals] = useState([]);

useEffect(() => {
  dispatch(fetchAllGroups());
}, [dispatch]);

// Fetch members when allGroups is loaded
useEffect(() => {
  if (allGroups.length > 0) {
    allGroups.forEach(group => {
      if (group.Gid) { // Only fetch if Gid exists
        dispatch(fetchGroupMembers(group.Gid));
      }
    });
  }
}, [allGroups, dispatch]);

const handleJoin = async (group) => {
  if (!group?.Gid) return;
  
  try {
    await dispatch(joinGroup(group.Gid)).unwrap();
    setJoinedDeals(prev => [...prev, group.Gid]);
    dispatch(fetchGroupMembers(group.Gid)); // Refresh members
    toast.success(`Joined ${group.productName} successfully!`);
  } catch (err) {
    toast.error(err.message || "Failed to join group");
  }
};

const deals = {
  all: allGroups,
  joined: allGroups.filter(g => joinedDeals.includes(g.Gid)),
  expiringSoon: [...allGroups]
    .filter(g => new Date(g.EndTime) > new Date())
    .sort((a, b) => new Date(a.EndTime) - new Date(b.EndTime))
    .slice(0, 5),
};

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <HeroBanner />

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="text-center py-20 text-gray-500">Loading group deals...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-20">{error}</div>
            ) : (
              <DealsGrid
                deals={deals[activeTab]}
                joinedDeals={joinedDeals}
                onJoin={handleJoin}
                groupMembers={groupMembers}
              />

            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
