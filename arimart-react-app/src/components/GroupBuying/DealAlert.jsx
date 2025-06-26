import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const DealAlert = () => {
  const [currentDeal, setCurrentDeal] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Mock deals data
  const deals = [
    {
      id: 1,
      title: "MEGA SALE",
      subtitle: "Up to 70% OFF",
      discount: "50%",
      product: "Electronics",
      endTime: Date.now() + 86400000, // 24 hours from now
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-600",
      image: "https://img.freepik.com/premium-vector/mega-sale-web-promotions-template-3d-podium-gradient-background-flash-sales-retail-ads-ecommerce_871757-4032.jpg"
    },
    {
      id: 2,
      title: "FLASH DEAL",
      subtitle: "Limited Stock",
      discount: "60%",
      product: "Home Appliances",
      endTime: Date.now() + 43200000, // 12 hours
      bgColor: "bg-gradient-to-r from-amber-500 to-red-600",
      image: "https://img.freepik.com/free-vector/gradient-flash-sale-background_23-2149005484.jpg"
    }
  ];

  // Auto-rotate deals every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentDeal((prev) => (prev + 1) % deals.length);
        setIsVisible(true);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
      const diff = endTime - Date.now();
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="flex gap-2">
        <div className="bg-black bg-opacity-30 text-white px-2 py-1 rounded">
          {timeLeft.hours}h
        </div>
        <div className="bg-black bg-opacity-30 text-white px-2 py-1 rounded">
          {timeLeft.minutes}m
        </div>
        <div className="bg-black bg-opacity-30 text-white px-2 py-1 rounded">
          {timeLeft.seconds}s
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-xl shadow-xl max-w-7xl mx-auto">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={deals[currentDeal].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className={`${deals[currentDeal].bgColor} text-white p-6 m-4`}
          >
            <div className="flex flex-col md:flex-row items-center">
              {/* Text Content */}
              <div className="flex-1 mb-4 md:mb-1">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <span className="bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    🔥 {deals[currentDeal].title}
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  {deals[currentDeal].subtitle}
                </h2>
                <p className="text-xl mt-1">
                  {deals[currentDeal].discount} OFF {deals[currentDeal].product}
                </p>
                <div className="mt-4">
                  <CountdownTimer endTime={deals[currentDeal].endTime} />
                </div>
                <button className="mt-6 bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition">
                  SHOP NOW →
                </button>
              </div>

              {/* Banner Image */}
              <div className="flex-1">
                <motion.img
                  src={deals[currentDeal].image}
                  alt="Deal Banner"
                  className="w-full h-48 md:h-64 object-contain"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Floating elements for visual interest */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full w-16 h-16"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DealAlert;