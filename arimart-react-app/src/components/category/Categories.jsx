import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchSubcategories, fetchChildSubcategories } from '../../Store/categoriesSlice'

export default function Categories() {
  const { market, subcategory, id } = useParams();
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);
  
  // Random grocery images fallback
  const groceryImages = [
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center", // Bananas
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=center", // Apples
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=150&h=150&fit=crop&crop=center", // Tomatoes
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150&h=150&fit=crop&crop=center", // Carrots
    "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=150&h=150&fit=crop&crop=center", // Broccoli
    "https://images.unsplash.com/photo-1563115298-e9585e7943d4?w=150&h=150&fit=crop&crop=center", // Oranges
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=150&h=150&fit=crop&crop=center", // Potatoes
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=center", // Mixed fruits
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=150&h=150&fit=crop&crop=center", // Cooking ingredients
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&h=150&fit=crop&crop=center", // Milk/dairy
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=150&h=150&fit=crop&crop=center", // Bread
    "https://images.unsplash.com/photo-1544716503-6d8f4682d6db?w=150&h=150&fit=crop&crop=center", // Rice/grains
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=150&h=150&fit=crop&crop=center", // Leafy greens
    "https://images.unsplash.com/photo-1564393047592-a4b1ce7e2f2f?w=150&h=150&fit=crop&crop=center", // Ghee/oil
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=150&h=150&fit=crop&crop=center", // Spices
  ];

  const getRandomGroceryImage = () => {
    return groceryImages[Math.floor(Math.random() * groceryImages.length)];
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);
  
  const dispatch = useDispatch();
  const { categories, subcategories, childSubcategories } = useSelector((state) => state.category);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Once categories are loaded, pick the one matching the `market` param
  useEffect(() => {
    if (categories.length > 0) {
      const matchedCategory = categories.find(
        (cat) =>
          cat.label === market
      );

      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
        dispatch(fetchSubcategories(matchedCategory.id));
      }
    }
  }, [categories, market, dispatch]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    dispatch(fetchSubcategories(category.id));
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    dispatch(fetchChildSubcategories(subcategory.id));
  };

  const handleImageError = (e) => {
    e.target.src = getRandomGroceryImage();
  };

  console.log(categories, subcategories)
  
  return (
    <div className="px-4 relative">
      <h2 className="font-bold text-xl md:text-3xl mb-6 text-gray-800 dark:text-gray-200">
        Shop Groceries
      </h2>

      {loading ? (
        <div className="flex overflow-x-auto pb-6 scrollbar-hide gap-4 px-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-28 h-36 md:w-32 md:h-40 bg-gray-100 dark:bg-gray-800 rounded-xl flex flex-col items-center justify-center p-4 animate-pulse">
              <div className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="relative group">
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({
                  left: -300,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollBy({
                  left: 300,
                  behavior: "smooth",
                });
              }
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          <motion.div
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 scrollbar-hide gap-4 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {subcategories.map((subcat, i) => (
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
                className="flex-shrink-0 w-28 h-36 md:w-32 md:h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-600 rounded-xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all hover:border hover:border-gray-200 dark:hover:border-gray-600"
                onClick={() => handleSubcategoryClick(subcat)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 md:w-20 md:h-20 mb-4 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={subcat.image || getRandomGroceryImage()}
                    alt={subcat.subcategoryName}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </motion.div>
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                  {subcat.subcategoryName}
                </span>
              </motion.div>
            ))}

          </motion.div>
        </div>
      )}
    </div>
  );
}