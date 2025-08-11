import { Bell, SlidersHorizontal, Search, User } from "lucide-react";
import MainPage from "../MainPage";
import HotDealsCarousel from "./HotDealsCarousel";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FilterSheet from "../Explore/FilterSheet";
import ProductCard from "../Products/ProductCard";
import SearchItems from "../Explore/SearchItems";
import Categories from "../category/Categories";
import Skeleton from 'react-loading-skeleton';
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
      <EcommerceHomepage />
      <FilterSheet isOpen={showFilter} onClose={() => setShowFilter(false)} />
      <div className="flex mx-auto">
        <img src="https://m.media-amazon.com/images/G/31/img18/Fresh/Oct20/UNREC/1500x150_strip.jpg" alt="Special Offer" className="w-full mx-auto object-cover rounded-lg" />
      </div>
    </div>
  );
}
