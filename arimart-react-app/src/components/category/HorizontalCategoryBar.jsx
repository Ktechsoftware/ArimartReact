import React, { useEffect } from "react";
import { ChevronRight } from "lucide-react";

import {
  LayoutGrid,
  Shirt,
  Store,
  User2,
  ShoppingBag,
  Candy,
  Apple,
  Heart,
  Headphones,
  Soup,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Store/categoriesSlice";

const categories = [
  {
    label: "Categories",
    icon: <LayoutGrid size={24} className="text-pink-600" />,
    link: "/categories",
  },
  {
    label: "Kurti & Dresses",
    icon: <Shirt size={24} className="text-orange-500" />,
    link: "/category/fashion"
  },
  {
    label: "Westernwear",
    icon: <User2 size={24} className="text-indigo-500" />,
    link: "/category/grocery"
  },
  {
    label: "Mall",
    icon: <Store size={24} className="text-blue-600" />,
    link: "/category/grocery"
  },
  {
    label: "Men",
    icon: <Shirt size={24} className="text-green-600" />,
    link: "/category/grocery"
  },
  {
    label: "Grocery",
    icon: <ShoppingBag size={24} className="text-yellow-500" />,
    link: "/category/grocery"
  },
  {
    label: "Snacks",
    icon: <Candy size={24} className="text-pink-500" />,
    link: "/category/grocery"
  },
  {
    label: "Fruits",
    icon: <Apple size={24} className="text-red-500" />,
    link: "/category/grocery"
  },
  {
    label: "Beauty",
    icon: <Heart size={24} className="text-rose-500" />,
    link: "/category/grocery"
  },
  {
    label: "Electronics",
    icon: <Headphones size={24} className="text-purple-600" />,
    link: "/category/grocery"
  },
  {
    label: "Home & Kitchen",
    icon: <Soup size={24} className="text-teal-500" />,
    link: "/category/grocery"
  },
];


export default function HorizontalCategoryBar() {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

 return (
    <div className="md:hidden block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex overflow-x-auto gap-5 scrollbar-hide">
        {categories.map((cat, index) => (
          <Link to={'/category/' + cat.categoryName} key={index} className="flex flex-col items-center min-w-[60px]">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full shadow">
              
            </div>
            <p className="text-xs text-center mt-1 truncate w-16">{cat.categoryName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}