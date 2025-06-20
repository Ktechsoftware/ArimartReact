import { motion, useAnimation } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const products = [
  {
    id: 1,
    name: "Organic Avocado",
    rating: 4.8,
    img: "https://via.placeholder.com/150?text=Avocado",
    price: "$5.99",
    bg: "bg-green-50 dark:bg-green-900/30"
  },
  {
    id: 2,
    name: "Fresh Salmon",
    rating: 4.6,
    img: "https://via.placeholder.com/150?text=Salmon",
    price: "$12.99",
    bg: "bg-blue-50 dark:bg-blue-900/30"
  },
  {
    id: 3,
    name: "Organic Strawberries",
    rating: 4.9,
    img: "https://via.placeholder.com/150?text=Strawberry",
    price: "$4.49",
    bg: "bg-red-50 dark:bg-red-900/30"
  },
  {
    id: 4,
    name: "Artisan Bread",
    rating: 4.7,
    img: "https://via.placeholder.com/150?text=Bread",
    price: "$3.99",
    bg: "bg-amber-50 dark:bg-amber-900/30"
  },
  {
    id: 5,
    name: "Greek Yogurt",
    rating: 4.5,
    img: "https://via.placeholder.com/150?text=Yogurt",
    price: "$2.99",
    bg: "bg-purple-50 dark:bg-purple-900/30"
  }
];

export default function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const controls = useAnimation();

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (autoSlide) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoSlide, currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 50) {
      prevSlide();
    } else if (info.offset.x < -50) {
      nextSlide();
    }
  };

  return (
    <div className="relative overflow-hidden py-4 px-3 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Today's Hot Deals 🔥</h2>
        <button className="flex items-center text-blue-500 dark:text-blue-400 text-sm">
          View All <ChevronRight className="ml-1 w-3 h-3" />
        </button>
      </div>

      <motion.div 
        className="relative h-64 sm:h-72 md:h-80"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setAutoSlide(false)}
        onMouseLeave={() => setAutoSlide(true)}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className={`absolute inset-0 ${product.bg} p-4 sm:p-5 rounded-xl shadow-sm mx-2 flex flex-col`}
            animate={{
              x: `${(index - currentIndex) * 100}%`,
              opacity: index === currentIndex ? 1 : 0.7,
              scale: index === currentIndex ? 1 : 0.95
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs sm:text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
                ★ {product.rating}
              </span>
              {index === currentIndex && (
                <span className="text-xs sm:text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                  HOT
                </span>
              )}
            </div>

            <div className="flex-grow flex items-center justify-center">
              <img 
                src={product.img} 
                alt={product.name} 
                className="h-28 sm:h-32 md:h-36 object-contain"
              />
            </div>

            <div className="text-center mt-auto">
              <h3 className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{product.name}</h3>
              <p className="text-md sm:text-lg font-bold text-green-600 dark:text-green-400 mt-1">
                {product.price}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-between mt-4 px-2">
        <button 
          onClick={prevSlide}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
          aria-label="Previous product"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        
        <div className="flex items-center gap-1">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'bg-orange-500 w-4' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={nextSlide}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md"
          aria-label="Next product"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
