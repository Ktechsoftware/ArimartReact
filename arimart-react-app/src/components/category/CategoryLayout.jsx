import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  fetchSubcategories,
  fetchChildSubcategories,
} from '../../Store/categoriesSlice'

export default function CategoryLayout() {
  const dispatch = useDispatch();
  const { categories, subcategories, childSubcategories } = useSelector((state) => state.category);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  console.log("categories", categories);
  console.log("subcategories", subcategories);
  console.log("childSubcategories", childSubcategories);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
    <div className="grid grid-cols-3 gap-0 w-full h-screen mb-20 border rounded shadow-md bg-white dark:bg-gray-900 overflow-hidden">
      {/* Categories */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-md font-semibold text-gray-700 dark:text-white mb-3">Categories</h2>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`cursor-pointer px-3 py-2 rounded transition-all ${
                selectedCategory?.id === cat.id
                  ? 'bg-white dark:bg-gray-700 font-bold'
                  : 'hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              {cat.categoryName}
            </li>
          ))}
        </ul>
      </div>

      {/* Subcategories */}
      <div className="bg-gray-50 dark:bg-gray-850 p-4 overflow-y-auto border-l border-gray-200 dark:border-gray-700">
        <h2 className="text-md font-semibold text-gray-700 dark:text-white mb-3">Subcategories</h2>
        {selectedCategory && subcategories.length > 0 ? (
          <ul className="space-y-2">
            {subcategories.map((sub) => (
              <li
                key={sub.id}
                onClick={() => handleSubcategoryClick(sub)}
                className={`cursor-pointer px-3 py-2 rounded transition-all ${
                  selectedSubcategory?.id === sub.id
                    ? 'bg-white dark:bg-gray-700 font-semibold'
                    : 'hover:bg-white dark:hover:bg-gray-700'
                }`}
              >
                {sub.subcategoryName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </div>

      {/* Child Subcategories */}
      <div className="bg-gray-100 dark:bg-gray-850 p-4 overflow-y-auto border-l border-gray-200 dark:border-gray-700">
        <h2 className="text-md font-semibold text-gray-700 dark:text-white mb-3">Child Subcategories</h2>
        {selectedSubcategory && childSubcategories.length > 0 ? (
          <ul className="space-y-2">
            {childSubcategories.map((child) => (
              <li
                key={child.id}
                className="cursor-pointer px-3 py-2 rounded hover:bg-white dark:hover:bg-gray-700 transition-all"
              >
                {child.childcategoryName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </div>
    </div>
  );
}
