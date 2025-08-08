import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const  SplashScreen = ({ onComplete, appName = "AriMart" }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after initial delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Complete splash after animation
    const completeTimer = setTimeout(() => {
      onComplete && onComplete();
    }, 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const logoVariants = {
    hidden: { 
      scale: 0.3, 
      opacity: 0,
      rotate: -180 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 1.2
      }
    }
  };

  const textVariants = {
    hidden: { 
      y: 30, 
      opacity: 0 
    },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-white rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-white rounded-full blur-lg"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Container */}
        <motion.div
          className="mb-8 relative"
          variants={logoVariants}
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
        >
          <motion.div
            className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center"
            variants={pulseVariants}
            animate="pulse"
          >
            {/* Replace this with your actual logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <div className="text-white text-3xl font-bold">
                {appName.charAt(0).toUpperCase()}
              </div>
            </div>
          </motion.div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-white rounded-3xl blur-xl opacity-30 -z-10"></div>
        </motion.div>

        {/* App Name */}
        <motion.div
          className="text-center"
          variants={textVariants}
          initial="hidden"
          animate={showContent ? "visible" : "hidden"}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            {appName}
          </h1>
          <p className="text-green-100 text-lg font-medium opacity-90">
            Your Smart Shopping Companion
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          className="mt-12 flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;