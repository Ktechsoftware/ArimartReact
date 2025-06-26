import {
  Menu,
  Shirt,
  Leaf,
  Phone,
  Flame,
  Headphones,
  Gift,
  Home,
  Computer,
  ShoppingCart,
  Star,
  TrendingUp,
  Wallet,
  Baby,
  BrushCleaningIcon,
} from "lucide-react";

import { useState } from "react";
import SidebarMenu from "../sidebar/SidebarMenu";
import DesktopSidebar from "../sidebar/DesktopSidebar";

const links = [
  { label: "All", isSidebar: true, icon: <Menu className="w-4 h-4 inline mr-1" /> },
  {
    label: "Grocery",
    dropdown: true,
    icon: <Leaf className="w-5 h-5 mx-auto mb-1" />,
    subcategories: [
      { name: "Vegetables", image: "..." },
      { name: "Fruits", image: "..." },
      { name: "Dairy", image: "..." },
    ],
  },
  {
    label: "Fashion",
    dropdown: true,
    icon: <Shirt className="w-5 h-5 mx-auto mb-1" />,
    subcategories: [
      {
        name: "Men's Top Wear",
        children: [
          "All", "Men’s T-Shirts", "Men’s Casual Shirts", "Men’s Formal Shirts",
          "Men’s Kurtas", "Men’s Ethnic Sets", "Men’s Blazers", "Men’s Raincoat",
          "Men’s Windcheaters", "Men’s Suit", "Men’s Fabrics"
        ],
      },
      {
        name: "Men's Bottom Wear",
        children: ["Jeans", "Trousers", "Track Pants", "Shorts"]
      },
      {
        name: "Women Ethnic",
        children: ["Sarees", "Kurtas & Kurtis", "Dress Materials", "Lehenga Choli"]
      },
      {
        name: "Kids",
        children: ["Boys Clothing", "Girls Clothing", "Toys & Games"]
      }
    ],
  },
  { label: "Beauty", dropdown: true,icon: <BrushCleaningIcon className="w-5 h-5 mx-auto mb-1" /> ,
     subcategories: [
      {
        name: "Men's Top Wear",
        children: [
          "All", "Men’s T-Shirts"
        ],
      },
      {
        name: "Men's Bottom Wear",
        children: ["Jeans", "Trousers", "Track Pants", "Shorts"]
      },
    ],
  },
  { label: "Bestsellers", icon: <Star className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Mobiles", icon: <Phone className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Today's Deals", icon: <Flame className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Home Appliances", icon: <Headphones className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Kids", icon: <Gift className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Arimart Pay", icon: <Wallet className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Electronics", icon: <TrendingUp className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Home & Kitchen", icon: <Home className="w-5 h-5 mx-auto mb-1" /> },
  { label: "Computers", icon: <Computer className="w-5 h-5 mx-auto mb-1" /> },
];


export default function DesktopCategory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hoveredSubcategory, setHoveredSubcategory] = useState(null);


  const handleClick = (item) => {
    if (item.isSidebar) {
      setIsSidebarOpen(true);
    }
  };

  return (
    <>
      <nav className="sticky top-14 bg-white text-black dark:bg-gray-800 dark:text-white text-sm font-medium shadow-md border-b dark:border-gray-700 z-10">
        <div className="relative flex">
          {/* Sticky first item */}
          {links.length > 0 && (
            <div className="sticky left-0 z-20 bg-white dark:bg-gray-800 pl-4 pr-2 py-2 border-r dark:border-gray-700">
              <div
                onClick={() => handleClick(links[0])}
                className="flex items-center px-2 py-1 hover:underline gap-1.5 whitespace-nowrap group cursor-pointer"
              >
                {links[0].icon && <span>{links[0].icon}</span>}
                <span>{links[0].label}</span>
                {links[0].dropdown && (
                  <span className="text-[10px] ml-0.5 transition-transform duration-200 group-hover:rotate-180">▼</span>
                )}
              </div>
            </div>
          )}

          {/* Scrollable container for other items */}
          <div className="flex-1 overflow-x-auto scrollbar-hide">
            <ul className="flex items-center">
              {links.slice(1).map((item, idx) => (
                <li key={idx + 1} className="relative group cursor-pointer px-2 py-2">
                  <div
                    onClick={() => handleClick(item)}
                    className="flex items-center px-2 py-1 hover:underline gap-1.5 whitespace-nowrap"
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.label}</span>
                    {item.dropdown && (
                      <span className="text-[10px] ml-0.5 transition-transform duration-200 group-hover:rotate-180">▼</span>
                    )}
                  </div>

                  {item.dropdown && item.subcategories && (
                    <div className="fixed inset-0 top-[7rem] bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg z-[9998] overflow-y-auto transition-all duration-300 origin-top scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-100">
                      <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                          {/* Left Column – Subcategories */}
                          <div className="md:col-span-1 space-y-2">
                            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white border-b pb-2">
                              {item.label}
                            </h3>
                            {item.subcategories.map((sub, subIdx) => (
                              <div
                                key={subIdx}
                                onMouseEnter={() => setHoveredSubcategory(sub)}
                                className={`px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${hoveredSubcategory?.name === sub.name
                                  ? "bg-gray-100 dark:bg-gray-800 font-medium text-primary-500 dark:text-primary-400 shadow-sm"
                                  : ""
                                  }`}
                              >
                                <div className="flex items-center">
                                  {sub.icon && (
                                    <span className="mr-3 text-lg">{sub.icon}</span>
                                  )}
                                  <span>{sub.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Right Column – Sub-Subcategories */}
                          <div className="md:col-span-3">
                            {hoveredSubcategory && (
                              <div className="animate-fadeIn">
                                <h4 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
                                  {hoveredSubcategory.name}
                                </h4>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                  {hoveredSubcategory.children?.map((child, idx) => (
                                    <div
                                      key={idx}
                                      className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:shadow-sm cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                                    >
                                      <div className="flex items-start">
                                        {child.icon && (
                                          <span className="text-2xl mr-3 text-primary-500 dark:text-primary-400">
                                            {child.icon}
                                          </span>
                                        )}
                                        <div>
                                          <h5 className="font-medium text-gray-800 dark:text-gray-100">
                                            {child.title || child}
                                          </h5>
                                          {child.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                              {child.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {hoveredSubcategory.featured && (
                                  <div className="mt-8 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6">
                                    <h5 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
                                      Featured in {hoveredSubcategory.name}
                                    </h5>
                                    <div className="grid grid-cols-3 gap-4">
                                      {hoveredSubcategory.featured.map((feature, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-xs">
                                          <h6 className="font-medium">{feature.title}</h6>
                                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{feature.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
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
      {/* Sidebar component */}
      {isSidebarOpen && (
        <DesktopSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
}
