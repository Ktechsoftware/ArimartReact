import React from 'react';
import { motion } from 'framer-motion';
const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "group_buys", label: "All Group Buys" },
    { id: "group_joined", label: "My joined Groups" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-[8]">
      <div className="container mx-auto flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-medium relative ${activeTab === tab.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-1 bg-primary-500"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
export default TabBar;