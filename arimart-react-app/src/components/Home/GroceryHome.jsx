import { Bell, SlidersHorizontal, Search, User } from "lucide-react";
import MainPage from "../MainPage";
import HotDealsCarousel from "./HotDealsCarousel";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FilterSheet from "../Explore/FilterSheet";
import ProductCard from "../Products/ProductCard";
import SearchItems from "../Explore/SearchItems";
import logo from "../../assets/images/logo.png";
import 'react-loading-skeleton/dist/skeleton.css';
import Intro from "./Intro";
import DesktopProducts from "../Products/DesktopProducts";
import HomepageGrid from "./HomepageGrid";
import HorizontalCategoryBar from "../category/HorizontalCategoryBar";
import { DeliveryInfo } from "../ui/DeliveryInfo";
import DealAlert from "../GroupBuying/DealAlert";
import DProductCard from "../Products/DProductcards";
import EcommerceHomepage from "./EcommerceHomepage";
import DynamicSlideCarousel from "../CarouselComponent";

export default function GroceryHome() {
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <HomepageGrid />
      <SearchItems />
      <DeliveryInfo />
      <HorizontalCategoryBar />
      {loading ? (
        <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between mb-6 animate-pulse">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-orange-300 rounded w-1/3"></div>
          </div>
          <div className="w-20 h-20 bg-gray-300 rounded-lg ml-4"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="m-3 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <DynamicSlideCarousel />
        </motion.div>
      )}

      <MainPage />
      {/* <DealAlert/> */}
      <HotDealsCarousel />
      <div className="mx-3 relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 p-6 shadow-lg">
        {/* Animated background elements */}
        <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-white/10"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </motion.div>
            <span className="text-sm font-semibold text-white/90">Trusted Shopping, Every Time.</span>
          </div>

          <motion.h3
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-1 text-2xl font-bold text-white"
          >
            <img src={logo} className="w-64 mx-auto bg-white/80 rounded-xl"/>
          </motion.h3>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4 text-white/80"
          >
            Limited time offer. Shop now before it's gone!
          </motion.p>

          {/* Floating animated elements */}
          <motion.div
            animate={{
              y: [0, -5, 0],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute right-6 top-6 text-4xl font-bold text-white/20"
          >
            %
          </motion.div>
        </div>
      </div>
      <EcommerceHomepage />
      <FilterSheet isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
}
