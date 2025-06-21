import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoreHorizontal, ChevronRight } from "lucide-react";
import onboarding1 from '../../assets/images/onboarding-screen/onboarding-1.png';
import onboarding2 from '../../assets/images/onboarding-screen/onboarding-2.png';
import onboarding3 from '../../assets/images/onboarding-screen/onboarding-3.png';
import { Link } from "react-router-dom";

const onboardingSlides = [
  {
    image: onboarding1,
    title: "Arimart",
    description: "We help small businesses grow through word-of-mouth recommendations from happy customers"
  },
  {
    image: onboarding2,
    title: "Discover Local Favorites",
    description: "Find hidden gems in your neighborhood recommended by people you trust"
  },
  {
    image: onboarding3,
    title: "Earn Rewards",
    description: "Get exclusive perks for sharing your favorite spots with friends"
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

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + onboardingSlides.length) % onboardingSlides.length);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 flex flex-col justify-between overflow-hidden">
      {/* Top nav */}
      <div className="flex justify-between items-center p-6">
        <button 
          onClick={prevSlide}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          Skip
        </button>
      </div>

      {/* Carousel content */}
      <div className="flex-1 flex flex-col items-center px-6 text-center overflow-hidden">
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
            <div className="relative mb-8 w-full max-w-md mx-auto h-[300px]">
              <motion.img
                src={onboardingSlides[currentSlide].image}
                alt="Onboarding illustration"
                className="w-full h-full object-cover"
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
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === currentSlide ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <Link to="/auth" className="px-6 pb-8 flex flex-col gap-4">
        <motion.button
          onClick={nextSlide}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-md mx-auto py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        > Continue with Mobile
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
      </Link>
    </div>
  );
};

export default Onboarding;