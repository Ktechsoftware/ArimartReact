import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Plus, Gift, Coffee, Film, Pill, Zap, Clock, Scissors } from "lucide-react";

const promoData = [
  {
    category: "Food and drinks",
    brand: "Starbucks",
    promoCode: "FreeCoffee24",
    discount: "100%",
    expiry: "03 Jan 2025",
    qrValue: "FreeCoffee24",
    icon: <Coffee className="w-5 h-5" />,
    color: "bg-green-100 dark:bg-green-900/50",
  },
  {
    category: "Entertainments",
    brand: "NETFLIX",
    promoCode: "HSMsfm125W",
    discount: "20%",
    expiry: "17 Dec 2025",
    qrValue: "HSMsfm125W",
    icon: <Film className="w-5 h-5" />,
    color: "bg-red-100 dark:bg-red-900/50",
  },
  {
    category: "Pharmacies",
    brand: "HealthPlus",
    promoCode: "HealthPlus10",
    discount: "10%",
    expiry: "12 Feb 2025",
    qrValue: "HealthPlus10",
    icon: <Pill className="w-5 h-5" />,
    color: "bg-blue-100 dark:bg-blue-900/50",
  },
];

const giftCards = [
  {
    brand: "Amazon",
    balance: "$50.00",
    code: "AMZN-XK5F-9P2R",
    expiry: "15 Aug 2025",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-yellow-100 dark:bg-yellow-900/50",
  },
  {
    brand: "Uber Eats",
    balance: "$25.00",
    code: "UBER-EATS-2024",
    expiry: "30 Nov 2025",
    icon: <Gift className="w-5 h-5" />,
    color: "bg-purple-100 dark:bg-purple-900/50",
  },
];

const PromoCard = ({ promo }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 ${promo.color} p-5 my-3 shadow-sm hover:shadow-md transition-shadow`}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-2 rounded-lg ${promo.color.replace('100', '200').replace('900/50', '800')}`}>
            {promo.icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{promo.brand}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Discount: {promo.discount}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <div className="relative group">
            <button className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium flex items-center gap-1">
              {promo.promoCode}
              <Scissors className="w-4 h-4" />
            </button>
            <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Click to copy
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
          <QRCodeSVG 
            value={promo.qrValue} 
            size={80} 
            bgColor="transparent"
            fgColor="currentColor"
            className="text-gray-800 dark:text-gray-200"
          />
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Exp: {promo.expiry}</span>
        </div>
      </div>
    </div>
    
    {/* Ticket perforation effect */}
    <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      ))}
    </div>
  </motion.div>
);

const GiftCard = ({ card }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 ${card.color} p-5 my-3 shadow-sm hover:shadow-md transition-shadow`}
  >
    <div className="absolute top-0 right-0 px-3 py-1 bg-black text-white text-xs font-bold rounded-bl-lg">
      GIFT CARD
    </div>
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-2 rounded-lg ${card.color.replace('100', '200').replace('900/50', '800')}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.brand}</p>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{card.balance}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">REDEMPTION CODE</p>
          <div className="relative group">
            <button className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-mono font-medium flex items-center gap-2">
              {card.code}
              <Scissors className="w-4 h-4" />
            </button>
            <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Click to copy
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
      <Clock className="w-3 h-3" />
      <span>Exp: {card.expiry}</span>
    </div>
  </motion.div>
);

const PromoCodes = () => {
  return (
    <div className="max-w-md mx-auto p-4 text-gray-800 dark:text-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-xl font-bold">My Vouchers</h2>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Gift className="w-4 h-4" /> Gift Cards
        </h3>
        {giftCards.map((card, index) => (
          <GiftCard key={`gift-${index}`} card={card} />
        ))}
      </motion.section>

      {promoData.map((promo, index) => (
        <motion.section 
          key={`promo-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + (index * 0.1) }}
        >
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-6 mb-3 flex items-center gap-2">
            {promo.icon} {promo.category}
          </h3>
          <PromoCard promo={promo} />
        </motion.section>
      ))}
    </div>
  );
};

export default PromoCodes;