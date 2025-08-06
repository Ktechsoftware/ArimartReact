import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const DealAlertModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(0);
  const LOCAL_STORAGE_KEY = "deal_modal_shown";
  const HIDE_ON_PATHS = ['/auth', '/onboard'];

  // Don't show on certain paths
  const shouldHide = HIDE_ON_PATHS.some(path => location.pathname.startsWith(path));
  if (shouldHide) return null;
  
  const deals = [
    {
      id: 1,
      title: "MEGA SALE",
      subtitle: "Up to 70% OFF",
      discount: "50%",
      product: "Electronics",
      endTime: Date.now() + 86400000,
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-600",
      image: "https://img.freepik.com/premium-vector/mega-sale-web-promotions-template-3d-podium-gradient-background-flash-sales-retail-ads-ecommerce_871757-4032.jpg"
    },
    {
      id: 2,
      title: "FLASH DEAL",
      subtitle: "Limited Stock",
      discount: "60%",
      product: "Home Appliances",
      endTime: Date.now() + 43200000,
      bgColor: "bg-gradient-to-r from-amber-500 to-red-600",
      image: "https://img.freepik.com/free-vector/gradient-flash-sale-background_23-2149005484.jpg"
    }
  ];

  useEffect(() => {
    const alreadyShown = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentDeal((prev) => (prev + 1) % deals.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    setIsOpen(false);
  };

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
      <div className="flex gap-2 mt-4">
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${deals[currentDeal].bgColor} relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl text-white`}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="p-8 flex-1">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block bg-black bg-opacity-20 px-3 py-1 rounded-full text-sm mb-4"
                >
                  🔥 {deals[currentDeal].title}
                </motion.span>
                <h2 className="text-3xl font-bold">{deals[currentDeal].subtitle}</h2>
                <p className="text-xl mt-2">{deals[currentDeal].discount} OFF</p>
                <CountdownTimer endTime={deals[currentDeal].endTime} />
                <button className="mt-6 bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                  SHOP NOW →
                </button>
              </div>
              <div className="flex-1">
                <img
                  src={deals[currentDeal].image}
                  alt="Deal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
