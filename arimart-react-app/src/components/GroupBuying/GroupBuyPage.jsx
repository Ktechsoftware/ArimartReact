import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import HeroBanner from './HeroBanner';
import TabBar from './TabBar';
import { fetchCurrentRunningGroups } from '../../Store/groupBuySlice';
import { fetchProductById } from '../../Store/productsSlice';
import { GroupBuySection } from '../../pages/GroupBuy/GroupBuySection'

export const GroupBuyPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('all');

  // --- Redux selectors ---
  const {
    currentRunningGroups = [],
    isLoading: groupsLoading = false,
    error: groupsError = null,
  } = useSelector((state) => state.group);

  const products = useSelector((state) => state.products.items || []);
  const productLoading = useSelector((state) => state.products.loading);

  const userData = useSelector((state) => state.auth.userData);

  // --- Fetch all current running groups on mount ---
  useEffect(() => {
    dispatch(fetchCurrentRunningGroups());
  }, [dispatch]);

  // --- Fetch product data for each running group (if not already loaded) ---
  useEffect(() => {
    currentRunningGroups.forEach(group => {
      const productId = group.pid || group.Pid;
      if (productId && !products.some(p => String(p.id) === String(productId))) {
        dispatch(fetchProductById(productId));
      }
    });
    // eslint-disable-next-line
  }, [currentRunningGroups, products, dispatch]);

  // Compose {group, product} for each running group
  const runningGroupsWithProduct = useMemo(() => {
    return currentRunningGroups.map(group => {
      const productId = group.pid || group.Pid;
      // Find product in products array
      const product = products.find(p => String(p.id) === String(productId));
      // Compose a product object with group info
      // The GroupBuySection expects a "product" prop with group info (gid, gprice, etc) merged in
      const mergedProduct = product
        ? {
            ...product,
            gid: group.gid || group.Gid || group.id,
            gprice: group.gprice || group.Gprice,
            gqty: group.gqty || group.Gqty,
            pdid: group.pdid || group.Pdid || product.pdid,
            // add any additional group fields if needed
          }
        : undefined;
      return { group, product: mergedProduct };
    });
  }, [currentRunningGroups, products]);

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
            {groupsLoading || productLoading ? (
              <div className="text-center py-20 text-gray-500">Loading group deals...</div>
            ) : groupsError ? (
              <div className="text-center text-red-500 py-20">{groupsError}</div>
            ) : runningGroupsWithProduct.length === 0 ? (
              <div className="text-center text-gray-500 py-20">No current running group buys found.</div>
            ) : (
              runningGroupsWithProduct.map(({ group, product }, index) =>
                product ? (
                  <motion.div
                    key={group.gid || group.Gid || group.id || index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="mt-6"
                  >
                  <GroupBuyuSection
                      userId={userData?.userId || userData?.id}
                      product={product}
                    />
                  </motion.div>
                ) : null // only render if product is available
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};