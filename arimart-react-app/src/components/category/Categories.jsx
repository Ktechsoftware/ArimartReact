import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchSubcategories, fetchChildSubcategories } from '../../Store/categoriesSlice'

const categories = [
  {
    label: "Fresh Vegetables",
    image: "https://w7.pngwing.com/pngs/596/791/png-transparent-vegetables-on-beige-wicker-basket-x-o-produce-inc-organic-food-vegetable-cooking-fresh-fruits-and-vegetables-natural-foods-leaf-vegetable-food-thumbnail.png", // Transparent vegetables
    color: "bg-gradient-to-br from-green-50 to-green-200 dark:from-green-900 dark:to-green-600",
  },
  {
    label: "Fresh Fruits",
    image: "https://www.pngall.com/wp-content/uploads/5/Fruits-PNG-File.png", // Transparent fruits
    color: "bg-gradient-to-br from-red-50 to-red-200 dark:from-red-900 dark:to-red-600",
  },
  {
    label: "Dairy & Eggs",
    image: "https://www.pngmart.com/files/5/Eggs-PNG-Photos.png", // Transparent eggs & dairy
    color: "bg-gradient-to-br from-yellow-50 to-yellow-200 dark:from-yellow-900 dark:to-yellow-600",
  },
  {
    label: "Rice & Dals",
    image: "https://www.pngall.com/wp-content/uploads/2016/05/Rice-Free-Download-PNG.png", // Transparent rice
    color: "bg-gradient-to-br from-indigo-50 to-indigo-200 dark:from-indigo-900 dark:to-indigo-600",
  },
  {
    label: "Masalas",
    image: "https://www.pngmart.com/files/22/Spices-PNG-Pic.png", // Transparent spice mix
    color: "bg-gradient-to-br from-orange-50 to-orange-200 dark:from-orange-900 dark:to-orange-600",
  },
  {
    label: "Oils & Ghee",
    image: "https://www.pngmart.com/files/3/Oil-PNG-HD.png", // Transparent oil bottle
    color: "bg-gradient-to-br from-amber-50 to-amber-200 dark:from-amber-900 dark:to-amber-600",
  },
  {
    label: "Snacks",
    image: "https://www.pngmart.com/files/3/Chips-PNG-File.png", // Transparent chips/snacks
    color: "bg-gradient-to-br from-purple-50 to-purple-200 dark:from-purple-900 dark:to-purple-600",
  },
  {
    label: "Beverages",
    image: "https://www.pngmart.com/files/22/Cold-Drink-PNG-Photos.png", // Transparent soda bottle
    color: "bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-900 dark:to-blue-600",
  },
];


export default function Categories() {
  const { market, subcategory, id } = useParams();
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(true);
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
                    src={subcat.image || "https://via.placeholder.com/80"} // fallback image
                    alt={subcat.name}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                  />
                </motion.div>
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
                  {subcat.name}
                </span>
              </motion.div>
            ))}

          </motion.div>
        </div>
      )}
    </div>

  );
}