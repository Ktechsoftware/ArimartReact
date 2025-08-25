import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete, appName = "AriMart Delivery Partner" }) => {
  const [showContent, setShowContent] = useState(false);
  const [scooterPosition, setScooterPosition] = useState(-100);

  useEffect(() => {
    // Show content after initial delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    // Animate scooter
    const scooterInterval = setInterval(() => {
      setScooterPosition(prev => {
        if (prev >= 100) return -100;
        return prev + 2;
      });
    }, 50);

    // Complete splash after animation
    const completeTimer = setTimeout(() => {
      onComplete && onComplete();
    }, 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
      clearInterval(scooterInterval);
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-green-500 to-green-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-white rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-white rounded-full blur-lg"></div>
      </div>

      {/* Road for scooter */}
      <div className="absolute bottom-0 w-full h-16 bg-gray-800 opacity-80"></div>
      <div className="absolute bottom-8 w-full h-1 bg-yellow-300 opacity-90">
        <div className="absolute w-20 h-1 bg-yellow-300 opacity-90 dash-animation"></div>
      </div>

      {/* Scooter Animation */}
      <motion.div 
        className="absolute bottom-16 z-20 scooter-container"
        style={{ left: `${scooterPosition}%` }}
        transition={{ type: "linear" }}
      >
        {/* Scooter body */}
        <div className="relative w-16 h-8 bg-red-500 rounded-lg">
          {/* Handlebar */}
          <div className="absolute -top-4 left-4 w-8 h-6 bg-gray-800 rounded-t-full">
            <div className="absolute -left-2 top-2 w-6 h-1 bg-gray-800 rounded-full"></div>
            <div className="absolute -right-2 top-2 w-6 h-1 bg-gray-800 rounded-full"></div>
          </div>
          
          {/* Delivery person */}
          <div className="absolute -top-10 left-5 w-6 h-10">
            {/* Head */}
            <div className="absolute top-0 left-1 w-4 h-4 bg-yellow-200 rounded-full"></div>
            {/* Body */}
            <div className="absolute top-4 w-6 h-6 bg-blue-500 rounded-sm"></div>
            {/* Arms */}
            <div className="absolute top-4 -left-2 w-2 h-6 bg-blue-500 rounded-full"></div>
            <div className="absolute top-4 right-0 w-2 h-4 bg-blue-500 rounded-full"></div>
          </div>
          
          {/* Delivery box */}
          <div className="absolute -top-6 -right-2 w-6 h-5 bg-brown-600 rounded-sm">
            <div className="absolute top-0.5 left-1 w-4 h-0.5 bg-brown-800"></div>
          </div>
        </div>
        
        {/* Front wheel */}
        <div className="absolute bottom-0 left-4 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
        </div>
        
        {/* Back wheel */}
        <div className="absolute bottom-0 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
        </div>
      </motion.div>

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
            Your Route to Earnings, Our Way to Service
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

      <style jsx>{`
        .dash-animation {
          animation: dash-move 1s linear infinite;
        }
        
        @keyframes dash-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(40px); }
        }
        
        .scooter-container {
          transition: left 0.1s linear;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;