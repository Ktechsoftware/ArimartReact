import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoreHorizontal, ChevronRight } from "lucide-react";
import onboarding1 from '../../assets/images/onboarding-screen/onboarding-1.png';
import onboarding2 from '../../assets/images/onboarding-screen/onboarding-2.png';
import onboarding3 from '../../assets/images/onboarding-screen/onboarding-3.png';
import { Link, useNavigate } from "react-router-dom";
import { Preferences } from '@capacitor/preferences';

const onboardingSlides = [
  {
    image: 'https://img.freepik.com/free-vector/safe-food-delivery-concept_23-2148559600.jpg',
    title: "Convenient & Fast Delivery",
    description: "Order on Arimart & get it delivered by 4 hours"
  },
  {
    image: 'https://img.freepik.com/free-vector/flat-world-vegetarian-day-background_23-2149623819.jpg',
    title: "Healthy & Fresh",
    description: "Hygienically managed from farmland to your doorstep delivery, farm to your door in less than 12 hours"
  },
  {
    image: 'https://img.freepik.com/free-vector/people-shopping-with-bags_24908-56774.jpg',
    title: "Purchase Together, Save More Together",
    description: "Purchase together in group with your friends & get up to 80% off, extra discount!"
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const handleContinue = async () => {
    await Preferences.set({ key: 'hasOnboarded', value: 'true' });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 flex flex-col justify-between overflow-hidden">
      {/* Top nav */}
      <div className="flex justify-between items-center p-6">
        <Link to='/'
        className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          Skip
        </Link>
      </div>

      {/* Carousel content */}
      <div className="flex-1 flex flex-col items-center text-center overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: 10 * direction }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", damping: 30 }}
            className="w-full flex flex-col items-center"
          >
            {/* Illustration */}
            <div className="relative mb-8 w-full max-w-md mx-auto">
              <motion.img
                src={onboardingSlides[currentSlide].image}
                alt="Onboarding illustration"
                className="w-full h-full"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              />
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full blur-2xl opacity-30 -z-10"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              />
            </div>

            {/* Text */}
            <motion.h1
              className="text-2xl font-bold mb-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {onboardingSlides[currentSlide].title}
            </motion.h1>
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {onboardingSlides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex gap-2 mb-8">
          {onboardingSlides.map((_, index) => (
            <motion.div
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`w-2 h-2 rounded-full cursor-pointer ${index === currentSlide ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-8 flex flex-col gap-4">
        <motion.button
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-md mx-auto py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          Get Started
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        <motion.p
          className="text-xs text-center text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Already a Arimart Member?{" "}
          <span className="text-purple-600 dark:text-purple-400 font-medium hover:underline cursor-pointer">
            Log in
          </span>
        </motion.p>
      </div>
    </div>
  );
};

export default Onboarding;