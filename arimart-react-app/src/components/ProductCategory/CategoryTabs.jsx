import React, { useState } from "react";
import { ArrowRight, Filter, SlidersHorizontalIcon } from "lucide-react";
import MobileFilterDrawer from "./MobileFilterDrawer";

const categoryTabs = [
  "Featured",
  "All vegetables",
  "All fruits",
  "Season's special",
  "Stone fruits",
  "Leafy greens",
  "Herbs and Seasoning",
  "Premium and exotic",
  "Organic fruits & vegetables",
  "Freshly cut",
];

export default function CategoryTabs() {
  const [selected, setSelected] = useState("Featured");
   const [showFilter, setIsMobileFilterOpen] = useState(false);

  return (
    <>
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 border-b">
      <div className="flex items-center gap-2">
        <img
          src="https://img.icons8.com/emoji/48/fruit-emoji.png"
          alt="fruits"
          className="w-8 h-8"
        />
        <h2 className="text-2xl font-bold">Fruits & vegetables</h2>
      </div>
      <button className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
        Next <ArrowRight className="w-4 h-4" />
      </button>
    </div>
   <div className="bg-white dark:bg-gray-900 px-4 border-b overflow-x-auto whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">
  <div className="flex justify-between items-center">
    
    <button
      className="lg:hidden flex items-center space-x-1 text-lime-600 hover:text-lime-700 transition mr-4"
      onClick={() => setIsMobileFilterOpen(true)}
    >
      <SlidersHorizontalIcon className="w-5 h-5 text-gray-500" />
    </button>
    <ul className="flex space-x-6 relative">
      {categoryTabs.map((label) => (
        <li 
          key={label}
          onClick={() => setSelected(label)}
          className={`cursor-pointer py-3 ${
            selected === label
              ? "text-lime-600 font-semibold border-b-2 border-lime-500"
              : "hover:text-lime-600"
          } transition`}
        >
          {label}
        </li>
      ))}
    </ul>

  </div>
   <MobileFilterDrawer isOpen={showFilter} onClose={() => setIsMobileFilterOpen(false)} />
</div>
    </>
  );
}
