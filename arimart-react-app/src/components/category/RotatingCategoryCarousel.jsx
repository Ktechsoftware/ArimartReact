import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { name: "Meats", icon: "🥩" },
  { name: "Veggies", icon: "🥦" },
  { name: "Fruits", icon: "🍊" },
  { name: "Breads", icon: "🥖" },
];

export default function CategoryCarousel() {
  const [index, setIndex] = useState(0);

  // Auto rotate every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-6 bg-white dark:bg-gray-900 text-center rounded-t-3xl shadow-lg">

      {/* Hemisphere Carousel */}
      <div className="relative w-full">
        {categories.map((item, i) => {
          // Calculate position in hemisphere arc
          const position = i - index;
          const distance = Math.abs(position);
          const angle = position * 30; // degrees
          
          return (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: `${angle * 3}px`,
                y: `${Math.abs(angle) * 0.5}px`,
                opacity: distance === 0 ? 1 : 0.6,
                scale: distance === 0 ? 1.2 : 0.9,
                zIndex: distance === 0 ? 10 : 1
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 20
              }}
              className={`absolute left-1/2 -translate-x-1/2 flex flex-col items-center ${
                distance === 0 ? "cursor-default" : "cursor-pointer"
              }`}
              onClick={() => setIndex(i)}
            >
              <motion.div
                className={`p-4 rounded-full text-3xl shadow-md ${
                  distance === 0 
                    ? "bg-green-600 dark:bg-green-700 text-white" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.div>
              <AnimatePresence>
                {distance === 0 && (
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    className="mt-2 text-sm font-medium text-green-800 dark:text-green-300"
                  >
                    {item.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Indicator Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {categories.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: i === index ? 1.2 : 0.8,
              backgroundColor: i === index ? "#059669" : "#D1FAE5"
            }}
            transition={{ type: "spring", stiffness: 500 }}
            className="w-2 h-2 rounded-full bg-green-200 dark:bg-green-800"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}