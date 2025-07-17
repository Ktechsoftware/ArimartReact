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
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Store/categoriesSlice";


export default function HorizontalCategoryBar() {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate("/categories", {
      state: { selectedCategory: category }
    });
  };


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="md:hidden block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex overflow-x-auto gap-5 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="flex flex-col items-center min-w-[60px]"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full shadow" />
            <p className="text-xs text-center mt-1 truncate w-16">{cat.categoryName}</p>
          </button>
        ))}

      </div>
    </div>
  );
}