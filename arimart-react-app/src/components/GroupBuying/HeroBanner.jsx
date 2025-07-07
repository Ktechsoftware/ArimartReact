import React from 'react';
import { motion } from 'framer-motion';
const HeroBanner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative h-64 md:h-96 overflow-hidden"
  >
    <img 
      src="https://img.freepik.com/premium-vector/mega-sale-web-promotions-template-3d-podium-gradient-background-flash-sales-retail-ads-ecommerce_871757-4032.jpg" 
      className="w-full h-full object-cover"
      alt="Mega Sale"
    />
    
    <motion.div
      animate={{ y: [-10, 0, -10] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute bottom-8 left-8 text-white"
    >
      <span className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
        🔥 LIMITED TIME OFFER
      </span>
      <h1 className="text-4xl md:text-6xl font-bold mt-2">GROUP BUY MADNESS</h1>
      <p className="text-xl mt-2">Unlock massive discounts with friends!</p>
    </motion.div>
  </motion.div>
);
export default HeroBanner;