import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { HeroBanner } from "./HeroBanner";
import { TabBar } from "./TabBar";
import { DealsGrid } from "./DealsGrid";

export const GroupBuyPage = () => {
    const [activeTab, setActiveTab] = useState("group-buys");
    const [joinedDeals, setJoinedDeals] = useState([]);
    
    // Mock data
   const deals = {
  "group-buys": [
    {
      id: "gb1",
      title: "Organic Coffee Bundle",
      originalPrice: 120,
      groupPrice: 79,
      required: 50,
      joined: 32,
      endTime: Date.now() + 86400000, // 24 hours from now
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5",
      tag: "GROUP BUY",
      category: "Groceries"
    },
    {
      id: "gb2",
      title: "Wireless Earbuds Pro",
      originalPrice: 199,
      groupPrice: 129,
      required: 100,
      joined: 87,
      endTime: Date.now() + 172800000, // 48 hours
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      tag: "POPULAR",
      category: "Electronics"
    }
  ],
  "hot-deals": [
    {
      id: "hd1",
      title: "Blender 2000W",
      originalPrice: 89,
      groupPrice: 49,
      required: 20,
      joined: 18,
      endTime: Date.now() + 3600000, // 1 hour
      image: "https://images.unsplash.com/photo-1563213126-a4273aed2016",
      tag: "HOT",
      category: "Appliances",
      discount: "45% OFF"
    },
    {
      id: "hd2",
      title: "Yoga Mat (Premium)",
      originalPrice: 65,
      groupPrice: 29,
      required: 30,
      joined: 27,
      endTime: Date.now() + 7200000, // 2 hours
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
      tag: "FLASH",
      category: "Fitness",
      discount: "55% OFF"
    }
  ],
  "today-deals": [
    {
      id: "td1",
      title: "Cotton T-Shirt Pack",
      originalPrice: 45,
      groupPrice: 29,
      required: 40,
      joined: 22,
      endTime: Date.now() + 43200000, // 12 hours
      image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9",
      tag: "LIMITED",
      category: "Fashion",
      discount: "35% OFF"
    },
    {
      id: "td2",
      title: "Smart Watch Series 5",
      originalPrice: 159,
      groupPrice: 99,
      required: 50,
      joined: 41,
      endTime: Date.now() + 21600000, // 6 hours
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      tag: "DEAL",
      category: "Electronics",
      discount: "38% OFF"
    }
  ]
};
    const handleJoin = (dealId) => {
        if (!joinedDeals.includes(dealId)) {
            setJoinedDeals([...joinedDeals, dealId]);
        }
    }
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <HeroBanner/>
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
                        <DealsGrid
                            deals={deals[activeTab]}
                            joinedDeals={joinedDeals}
                            onJoin={handleJoin}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};