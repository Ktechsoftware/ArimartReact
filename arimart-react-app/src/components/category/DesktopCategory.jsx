import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Menu,
  Star,
  Flame,
  Phone,
  Home,
  Computer,
  Wallet,
  TrendingUp,
  Gift,
} from 'lucide-react';

import DesktopSidebar from '../sidebar/DesktopSidebar';
import { fetchCategories, fetchChildSubcategories, fetchSubcategories } from '../../Store/categoriesSlice';

export default function DesktopCategory() {
  const dispatch = useDispatch();

  const { categories, subcategories, childSubcategories } = useSelector((state) => state.category);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);
  //console.log("Categories:", categories);
  //console.log("Subcategories:", subcategories);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryHover = (category) => {
    setHoveredCategory(category);
    dispatch(fetchSubcategories(category.id));
  };

  const handleSubcategoryHover = (subcat) => {
    setHoveredSubcategory(subcat);
    dispatch(fetchChildSubcategories(subcat.id));
  };

  return (
    <>
      <nav className="sticky top-14 bg-white text-black dark:bg-gray-800 dark:text-white text-sm font-medium shadow-md border-b dark:border-gray-700 z-10">
        <div className="relative flex">
          <div className="sticky left-0 z-20 bg-white dark:bg-gray-800 pl-4 pr-2 py-2 border-r dark:border-gray-700">
            <div
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center px-2 py-1 hover:underline gap-1.5 whitespace-nowrap group cursor-pointer"
            >
              <Menu className="w-4 h-4 inline mr-1" />
              <span>All</span>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <ul className="flex items-center">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="relative group cursor-pointer px-2 py-2"
                  onMouseEnter={() => handleCategoryHover(category)}
                >
                  <div className="flex items-center px-2 py-1 hover:underline gap-1.5 whitespace-nowrap">
                    <span>{category.categoryName}</span>
                    <span className="text-[10px] ml-0.5 transition-transform duration-200 group-hover:rotate-180">▼</span>
                  </div>

                  {hoveredCategory?.id === category.id && subcategories.length > 0 && (
                    <div className="fixed inset-0 top-[7rem] bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg z-[9998] overflow-y-auto transition-all duration-300 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100">
                      <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          <div className="md:col-span-1 space-y-2">
                            <h3 className="text-lg font-bold mb-4">{category.categoryName}</h3>
                            {subcategories.map((sub) => (
                              <div
                                key={sub.id}
                                onMouseEnter={() => handleSubcategoryHover(sub)}
                                className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${hoveredSubcategory?.id === sub.id
                                  ? 'bg-gray-100 dark:bg-gray-800 font-medium text-primary-500 dark:text-primary-400 shadow-sm'
                                  : ''
                                  }`}
                              >
                                {sub.subcategoryName}
                              </div>
                            ))}
                          </div>

                          {/* Child Subcategory List */}
                          <div className="md:col-span-3">
                            {hoveredSubcategory && (
                              <>
                                <h4 className="text-xl font-bold mb-6">{hoveredSubcategory.subcategoryName}</h4>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                  {childSubcategories.map((child) => (
                                    <div
                                      key={child.id}
                                      className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-sm cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                    >
                                      <h5 className="font-medium">{child.name}</h5>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <DesktopSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
}
