import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import API from '../../api';

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
import * as categoryIcons from "lucide-react";

import DesktopSidebar from '../sidebar/DesktopSidebar';
import { fetchCategories } from '../../Store/categoriesSlice';
import { Link } from 'react-router-dom';

export default function DesktopCategory() {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);

  // Local state for navigation dropdown - separate from page state
  const [navSubcategories, setNavSubcategories] = useState([]);
  const [navChildSubcategories, setNavChildSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryHover = async (category) => {
    setHoveredCategory(category);
    setHoveredSubcategory(null);
    setNavChildSubcategories([]);

    try {
      setLoading(true);
      const response = await API.get(`/subcategory/by-category/${category.id}`);
      setNavSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setNavSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Keep the child subcategory function for future use (commented out the API call)
  const handleSubcategoryHover = async (subcategory) => {
    setHoveredSubcategory(subcategory);

    // Commented out for future use
    // try {
    //   const response = await API.get(`/childsubcategory/by-subcategory/${subcategory.id}`);
    //   setNavChildSubcategories(response.data);
    // } catch (error) {
    //   console.error('Error fetching child subcategories:', error);
    //   setNavChildSubcategories([]);
    // }
  };

  return (
    <>
      <nav className="sticky top-14 bg-white text-black dark:bg-gray-800 dark:text-white text-sm font-medium shadow-md border-b dark:border-gray-700 z-10">
        <div className="relative flex">
          <div className="sticky left-0 z-20 bg-white dark:bg-gray-800 pl-4 pr-2 py-2 border-r dark:border-gray-700">
            <div
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center px-2 py-1  gap-1.5 whitespace-nowrap group cursor-pointer"
            >
              <Menu className="w-4 h-4 inline mr-1" />
              <span>All</span>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <ul className="flex items-center">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.iconLabel] || categoryIcons.Box;
                return (
                  <li
                    key={category.id}
                    className="relative group cursor-pointer px-2 py-2"
                    onMouseEnter={() => handleCategoryHover(category)}
                  >
                    <div className="flex items-center px-2 py-1  gap-1.5 whitespace-nowrap">
                      <div className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full shadow">
                        <IconComponent className="w-5 h-5 text-gray-800 dark:text-white" />
                      </div>
                      <span>{category.categoryName}</span>
                      <span className="text-[10px] ml-0.5 transition-transform duration-200 group-hover:rotate-180">▼</span>
                    </div>

                    {hoveredCategory?.id === category.id && navSubcategories.length > 0 && (
                      <div className="h-[30rem] max-w-6xl mx-auto fixed inset-0 top-[6.5rem] shadow-xl rounded-xl bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg z-[9998] overflow-y-auto transition-all duration-300 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100">
                        <div className="container mx-auto px-4 py-8">
                          <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold mb-6 text-center">{category.categoryName}</h3>
                              {loading ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                  {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                  ))}
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                  {navSubcategories.map((sub) => (
                                    <Link
                                      to={`/category/${category.categoryName}/${category.id}`}
                                      state={{
                                        selectedSubcategory: sub,
                                        scrollToProducts: true
                                      }}
                                      key={sub.id}
                                      onMouseEnter={() => handleSubcategoryHover(sub)}
                                      className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm"
                                    >
                                      <h5 className="font-medium text-center">{sub.subcategoryName}</h5>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                                        View products
                                      </p>
                                    </Link>
                                  ))}
                                </div>
                              )}

                              {!loading && navSubcategories.length === 0 && (
                                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                  <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                      <Gift className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-lg font-medium">No subcategories available</p>
                                    <p className="text-sm">Check back later for more options</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Hidden child subcategories section - kept for future use */}
                            {/* 
                          <div className="md:col-span-3" style={{ display: 'none' }}>
                            {hoveredSubcategory && (
                              <>
                                <h4 className="text-xl font-bold mb-6">{hoveredSubcategory.subcategoryName}</h4>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                  {navChildSubcategories.length > 0 ? (
                                    navChildSubcategories.map((child) => (
                                      <div
                                        key={child.id}
                                        className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-sm cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                      >
                                        <h5 className="font-medium">
                                          {child.childSubcategoryName || child.childcategoryName || child.name}
                                        </h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                          120+ products
                                        </p>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                                      <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                          <Gift className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p>No subcategories available</p>
                                        <p className="text-xs">Check back later for more options</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                            {!hoveredSubcategory && (
                              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <p className="text-lg font-medium">Explore {category.categoryName}</p>
                                  <p className="text-sm">Hover over a subcategory to see available options</p>
                                </div>
                              </div>
                            )}
                          </div>
                          */}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>

      <DesktopSidebar
        key={`sidebar-${Math.random()}`}
        source="header"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

    </>
  );
}