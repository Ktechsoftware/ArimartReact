import React from "react";

const categories = [
  { title: "Meets", subtitle: "Frozen Meal", icon: "🥩" },
  { title: "Vegetable", subtitle: "Markets", icon: "🥦" },
  { title: "Fruits", subtitle: "Comical free", icon: "🍊" },
  { title: "Breads", subtitle: "Burnt", icon: "🍞" },
  { title: "Snacks", subtitle: "Evening", icon: "🍿" },
  { title: "Bakery", subtitle: "Meal and Flour", icon: "🥐" },
  { title: "Dairy & Sweet", subtitle: "In store", icon: "🧁" },
  { title: "Chicken", subtitle: "Frozen Meal", icon: "🍗" },
];

const CategoryCard = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      {/* Promo Banner */}
      <div className="bg-orange-100 dark:bg-orange-900 p-4 rounded-lg mb-6 shadow flex items-center justify-between">
        <div>
          <p className="font-semibold text-sm">Get 10% off groceries with Plus+ T&C Apply</p>
          <p className="text-xs text-gray-700 dark:text-gray-300">Spend $30.00 to get 5%</p>
        </div>
        <span className="text-xl">🛒</span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-4">All categories</h2>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <h3 className="font-semibold">{cat.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{cat.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
