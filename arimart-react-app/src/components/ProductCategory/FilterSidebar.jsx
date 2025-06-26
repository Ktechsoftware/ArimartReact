import React from 'react';
import { Slider } from '@material-tailwind/react'; 

const FilterSidebar = () => {
  return (
    <aside className="w-full max-w-xs p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Filters</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
        <input type="range" min="19" max="10900" className="w-full" />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>₹19</span>
          <span>₹10,900+</span>
        </div>
      </div>

      <FilterGroup title="Brands" options={['Cadbury', 'Amul', 'KITKAT', 'Nestlé', 'HERSHEY’S']} />

      <FilterGroup title="Discount" options={['10% Off or more', '25% Off or more', '50% Off or more']} />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Reviews</label>
        <span className="text-yellow-500">★★★★☆ & up</span>
      </div>

      <FilterGroup title="Grocery" options={['Made for Amazon', 'Top Brands']} />

      <FilterGroup title="Category" options={['Any Department', 'Amazon Fresh', 'Grocery & Gourmet Foods']} />

      <FilterGroup title="Pay on Delivery" options={['Eligible for Pay On Delivery']} />

      <FilterGroup title="Occasion" options={['Birthday', 'Thanksgiving', 'Anniversary']} />

      <FilterGroup title="Flavor" options={['Chocolate', 'Dark Chocolate', 'Almond', 'Peanut Butter']} />

      <FilterGroup title="Food Type" options={['Natural', 'High in Protein', 'No Added Sugar', 'Dairy Free']} />
    </aside>
  );
};

const FilterGroup = ({ title, options }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{title}</label>
    <ul className="space-y-1">
      {options.map((opt, idx) => (
        <li key={idx}>
          <label className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <input type="checkbox" className="form-checkbox text-indigo-600 dark:bg-gray-800" />
            <span>{opt}</span>
          </label>
        </li>
      ))}
    </ul>
  </div>
);

export default FilterSidebar;
