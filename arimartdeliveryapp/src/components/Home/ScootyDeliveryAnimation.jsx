import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ScootyDeliveryAnimation = ({ orderId, deliveryAddress, onDeliveryComplete }) => {
  const controls = useAnimation();
  const [isDelivered, setIsDelivered] = useState(false);
  const scootyRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Animation sequence
  useEffect(() => {
    const sequence = async () => {
      // Start the scooty
      await controls.start({
        x: [0, 200, 400, 600],
        y: [0, -20, 0, -10],
        rotate: [0, -5, 5, 0],
        transition: { duration: 4, ease: "easeInOut" }
      });
      
      // Delivery point reached
      setIsDelivered(true);
      setProgress(100);
      if (onDeliveryComplete) onDeliveryComplete();
      
      // Pause at delivery point
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return journey
      await controls.start({
        x: [600, 400, 200, 0],
        y: [-10, 0, -20, 0],
        rotate: [0, 5, -5, 0],
        transition: { duration: 4, ease: "easeInOut" }
      });
    };

    sequence();

    // Progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [controls, onDeliveryComplete]);

  return (
    <div className="relative h-64 bg-blue-50 rounded-xl overflow-hidden p-4">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-700">
        {/* Road markings */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-400 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/4 h-1 w-8 bg-yellow-400 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-2/4 h-1 w-8 bg-yellow-400 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-3/4 h-1 w-8 bg-yellow-400 transform -translate-y-1/2"></div>
      </div>

      {/* Delivery point marker */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute right-8 bottom-20"
      >
        <div className="relative">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs">PIN</span>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow whitespace-nowrap">
            {deliveryAddress || "Delivery Point"}
          </div>
        </div>
      </motion.div>

      {/* Scooty with package */}
      <motion.div
        ref={scootyRef}
        animate={controls}
        className="absolute bottom-16 left-4 z-10"
      >
        <div className="relative">
          {/* Scooty body */}
          <div className="w-16 h-8 bg-red-500 rounded-lg relative">
            {/* Handlebar */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-4 border-2 border-gray-800 rounded-full"></div>
            {/* Front wheel */}
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-700"></div>
            {/* Back wheel */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gray-900 rounded-full border-2 border-gray-700"></div>
            
            {/* Delivery package */}
            <motion.div
              animate={{
                y: [0, -5, 0, -3],
                transition: { 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }
              }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-yellow-400 rounded-sm flex items-center justify-center"
            >
              <span className="text-xs font-bold text-gray-800">#{orderId}</span>
            </motion.div>
          </div>
          
          {/* Rider (simple representation) */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-8 bg-blue-500 rounded-t-full"></div>
            <div className="w-6 h-6 bg-pink-200 rounded-full ml-1"></div>
          </div>
        </div>
      </motion.div>

      {/* Delivery status */}
      <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-gray-800">Order #{orderId || "12345"}</h3>
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
            {isDelivered ? "Delivered!" : "On the way"}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-green-500 h-2.5 rounded-full" 
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Restaurant</span>
          <span>Your Location</span>
        </div>
      </div>

      {/* Delivery complete popup */}
      {isDelivered && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-xl z-20 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-800">Order Delivered!</h3>
          <p className="text-gray-600 mt-1">Your order #{orderId} has arrived</p>
          <button 
            onClick={() => setIsDelivered(false)}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Got it!
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ScootyDeliveryAnimation;