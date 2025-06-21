import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  {
    label: "Fresh Vegetables",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/5/14/43e3c412-4ca9-4894-82ba-24b69da80aa6_06c0d2a9-804c-4bf1-8725-7ebd234e144a",
    color: "bg-green-50",
  },
  {
    label: "Fresh Fruits",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/PC_Mweb/Burger.png",
    color: "bg-red-50",
  },
  {
    label: "Dairy & Eggs",
    image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_112,h_112,c_fill/dairy_zjvq8f",
    color: "bg-yellow-50",
  },
  {
    label: "Rice & Dals",
    image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_112,h_112,c_fill/rice_dal_axkq5e",
    color: "bg-indigo-50",
  },
  {
    label: "Masalas",
    image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_112,h_112,c_fill/masalas_qxqjjy",
    color: "bg-orange-50",
  },
  {
    label: "Oils & Ghee",
    image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_112,h_112,c_fill/oils_ghee_ujd9jz",
    color: "bg-amber-50",
  },
  {
    label: "Snacks",
    image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_112,h_112,c_fill/snacks_biscuits_ghvq8e",
    color: "bg-purple-50",
  },
  {
    label: "Beverages",
    image: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_112,h_112,c_fill/beverages_hrnz0m",
    color: "bg-blue-50",
  },
];

export default function Categories() {
  const scrollRef = useRef(null);

  return (
    <div className="max-w-6xl mx-auto px-4 relative">
      <h2 className="font-bold text-xl md:text-3xl mb-6 text-gray-800">
        Shop Groceries
      </h2>
      
      <div className="relative group">
        <button 
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ 
                left: -300, 
                behavior: "smooth" 
              });
            }
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <button 
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ 
                left: 300, 
                behavior: "smooth" 
              });
            }
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        <motion.div
          ref={scrollRef}
          className="flex overflow-x-auto pb-6 scrollbar-hide gap-4 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              className={`flex-shrink-0 w-28 h-36 md:w-32 md:h-40 ${cat.color} rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all hover:border hover:border-gray-200`}
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full bg-white flex items-center justify-center overflow-hidden"
              >
                <img 
                  src={cat.image} 
                  alt={cat.label} 
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                />
              </motion.div>
              <span className="text-xs md:text-sm font-medium text-gray-700 text-center">
                {cat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}