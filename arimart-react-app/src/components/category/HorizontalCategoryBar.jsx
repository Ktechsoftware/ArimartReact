import React, { useEffect } from "react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Store/categoriesSlice";

export default function HorizontalCategoryBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    navigate("/categories", {
      state: { selectedCategory: category },
    });
  };

  return (
    <div className="md:hidden block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex overflow-x-auto gap-5 scrollbar-hide">
        {categories.map((cat) => {
          const IconComponent = Icons[cat.iconLabel] || Icons.Box; // fallback to Box icon

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="flex flex-col items-center min-w-[60px]"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full shadow">
                <IconComponent className="w-6 h-6 text-gray-800 dark:text-white" />
              </div>
              <p className="text-xs text-center mt-1 truncate w-16">{cat.categoryName}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
