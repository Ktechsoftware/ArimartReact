import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import logo from '../assets/images/logo.png';
import onboardingImage from '../assets/images/onboarding-screen/onboarding-1.png';

const slides = [
  {
    title: 'Delivery in 30 Min',
    description: 'Get your groceries delivered to your doorstep quickly.',
    image: onboardingImage,
  },
  {
    title: 'Browse all the category',
    description: 'Explore all grocery categories with ease.',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Amazing discount & offers',
    description: 'Save more with our special deals and coupons.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
  },
];

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAppName, setShowAppName] = useState(true);

  // Auto carousel effect
  useEffect(() => {
    if (showAppName) {
      const timer = setTimeout(() => {
        setShowAppName(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, showAppName]);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* App Name Intro Screen */}
      <AnimatePresence>
        {showAppName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 z-20 backdrop-blur-lg"
          >
            <motion.h1 
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="text-4xl font-bold text-white"
            >
              <img src={logo} alt="Arimart Logo" className="mb-2" />
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <Link to="/home" className="absolute top-6 right-6 z-50 cursor-pointer">
        <div
          className="text-white dark:text-gray-200 font-medium text-sm hover:underline backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
        >
          Skip
        </div>
      </Link>

      {/* Carousel Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="absolute inset-0 flex flex-col justify-end z-10 pb-16 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              {slides[currentIndex].title}
            </h2>
            <p className="text-gray-200 mb-8 max-w-md mx-auto">
              {slides[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>

          <motion.button
            onClick={handleGetStarted}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto bg-white text-blue-600 font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </motion.button>
      </div>
    </div>
  );
};

export default OnboardingScreen;