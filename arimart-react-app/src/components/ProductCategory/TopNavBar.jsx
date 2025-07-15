    import React from "react";

    const topLinks = [
      "Past Purchases",
      "Deals",
      "Fruits & vegetables",
      "Atta, rice & grains",
      "Oil & ghee",
      "Milk & dairy",
      "Snacks & biscuits",
      "Eggs, meat & fish",
      "Bath & body",
      "Laundry detergents",
      "Baby care",
    ];

    export default function TopNavBar() {
      return (
        <nav className="bg-lime-100 dark:bg-lime-900 border-b px-4 py-2 overflow-x-auto whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white scrollbar-hide">
          <ul className="flex space-x-6">
            <li className="font-bold text-lime-600 dark:text-lime-300">fresh</li>
            {topLinks.map((label, i) => (
              <li key={i} className="cursor-pointer hover:text-lime-600 transition">
                {label}
              </li>
            ))}
          </ul>
        </nav>
      );
    }
