import React from 'react';
import { motion } from 'framer-motion';

const HeroBanner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative h-64 md:h-96 overflow-hidden"
  >
    {/* Background Image with Blur Effect */}
    <div className="absolute inset-0">
      <img
        src="https://img.freepik.com/premium-vector/mega-sale-web-promotions-template-3d-podium-gradient-background-flash-sales-retail-ads-ecommerce_871757-4032.jpg"
        className="w-full h-full object-cover blur-sm brightness-75"
        alt="Mega Sale"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
    </div>

    {/* Content */}
    <motion.div
      animate={{ y: [-10, 0, -10] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute bottom-8 left-8 text-white"
    >
      <motion.span
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-block bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1 rounded-full text-sm font-medium shadow-lg mb-3"
      >
        🔥 LIMITED TIME OFFER
      </motion.span>

      <h1 className="text-4xl md:text-6xl font-bold mt-2 text-shadow-lg">
        GROUP BUY MADNESS
      </h1>

      <p className="text-xl mt-2 text-white/90">
        Unlock massive discounts with friends!
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4 bg-white text-orange-600 px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
      >
        Shop Now
      </motion.button>
    </motion.div>
  </motion.div>
);

export default HeroBanner;