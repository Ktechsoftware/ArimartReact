import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  'https://m.media-amazon.com/images/G/31/img24/Fresh/kmargso/New/upsell_Fresh-toned-milk_PC._SX1500_QL85_FMpng_.png',
  'https://m.media-amazon.com/images/G/31/img18/Fresh/Sep21/CatStore/FV_1500X300.jpg',
  'https://m.media-amazon.com/images/G/31/img24/Fresh/kmargso/New/upsell_Nutrition-for-everyday-wellness_PC._SX1500_QL85_FMpng_.png',
];

export default function DynamicSlideCarousel() {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(([prev]) => {
        const next = (prev + 1) % slides.length;
        return [next, next > prev ? 1 : -1];
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
    }),
    center: {
      x: 0,
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.5,
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.5,
      },
    }),
  };

  return (
    <div class="relative w-full h-32 sm:h-72 md:h-96 rounded-xl overflow-hidden">
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-32 md:h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlide([idx, idx > currentSlide ? 1 : -1])}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'bg-white w-6' : 'bg-white/40 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
