import { motion,AnimatePresence  } from 'framer-motion'
import HomepageFeaturedProducts from './FeaturedProductUI/HomepageFeaturedProducts'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../Store/categoriesSlice';

import { Tag, Clock,ChevronLeft, ChevronRight} from 'lucide-react';
import * as categoryIcons from "lucide-react";
import { useEffect, useState } from 'react';
const EcommerceHomepage = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 12; // 6 per row × 2 rows

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleCategories = categories.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  const CategoryCard = ({ category }) => {
  const IconComponent = categoryIcons[category.iconLabel] || Tag;

  return (
    <Link to={`/category/${category.categoryName}/${category.id}`}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm flex flex-col items-center cursor-pointer w-full"
    >
      <motion.div 
        className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3"
        whileHover={{ rotate: 15 }}
      >
        <IconComponent className="w-6 h-6 text-purple-600 dark:text-purple-300" />
      </motion.div>
      <h3 className="font-medium dark:text-white text-center">
        {category.categoryName}
      </h3>
    </Link>
  );
};



  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Categories */}
    <section className="hidden md:block py-12 container mx-auto px-6 relative">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold dark:text-white">Shop by Category</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="grid grid-rows-2 gap-y-6 absolute inset-0"
          >
            {/* First Row */}
            <div className="flex gap-4">
              {visibleCategories.slice(0, 6).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>

            {/* Second Row */}
            <div className="flex gap-4">
              {visibleCategories.slice(6, 12).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>

      {/* Featured Products */}
      <HomepageFeaturedProducts />

      {/* Deal of the Day */}
      <section className="py-12 container mx-auto px-6">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="animate-pulse" />
                <span className="font-semibold">Deal of the Day</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Smart Home Bundle</h2>
              <p className="mb-6">Get 40% off on our best-selling smart home products</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">30</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold"
              >
                Shop Now
              </motion.button>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <motion.img
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                src="/smart-home-bundle.png"
                alt="Smart Home Bundle"
                className="h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EcommerceHomepage