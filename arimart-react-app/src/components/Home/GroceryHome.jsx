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

const categories = [
  { label: "Vegetable", color: "bg-purple-100", icon: "🥦" },
  { label: "Coffee & Drinks", color: "bg-pink-100", icon: "☕" },
  { label: "Milk & Dairy", color: "bg-yellow-100", icon: "🥛" },
];

const offers = [
  {
    name: "Fresh Carrot",
    img: "https://via.placeholder.com/80x80?text=Carrot",
    rating: 5,
    weight: "1kg, Priceg",
    price: "$4.99",
    bg: "bg-purple-100",
  },
  {
    name: "Fresh Salmon",
    img: "https://via.placeholder.com/80x80?text=Salmon",
    rating: 5,
    weight: "1kg, Priceg",
    price: "$4.99",
    bg: "bg-orange-100",
  },
];

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
      <HomepageGrid/>
      <Intro />
      <SearchItems />
      <DeliveryInfo/>
      <HorizontalCategoryBar/>
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
        <div className="m-3 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-900 dark:to-green-600 p-4 rounded-xl flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">Get Fresh Grocery</p>
            <p className="text-sm dark:text-gray-300">in your Door</p>
            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm mt-1 block">
              49% Discount
            </span>
          </div>
          <img
            src="https://via.placeholder.com/100x100?text=Grocery+Guy"
            alt="promo"
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>
      )}
      <div className="m-3 bg-gradient-to-br from-green-50 to-green-200 dark:from-green-900 dark:to-green-600 p-4 rounded-xl flex items-center justify-between mb-6">
          <img
            src="https://m.media-amazon.com/images/G/31/img24/Fresh/April/Pc_6.jpg"
            alt="promo"
          />
        </div>
      <MainPage />
      <DealAlert/>
      <HotDealsCarousel />

      <Categories />
      <div className="relative overflow-hidden py-4 px-3 sm:px-6 md:px-8">

        {/* Special Offers */}
        <h2 className="text-xl md:text-3xl font-bold text-base mb-2">Special Offers</h2>
        {/* <ProductCard/> */}
        <DesktopProducts/>
      </div>
      <FilterSheet isOpen={showFilter} onClose={() => setShowFilter(false)} />
      <div className="flex mx-auto">
        <img src="https://m.media-amazon.com/images/G/31/img18/Fresh/Oct20/UNREC/1500x150_strip.jpg" alt="Special Offer" className="w-full mx-auto object-cover rounded-lg" />
      </div>
    </div>
  );
}
