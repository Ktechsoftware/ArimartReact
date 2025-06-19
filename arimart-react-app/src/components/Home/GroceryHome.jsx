import { Bell, SlidersHorizontal, Search, User } from "lucide-react";
import MainPage from "../MainPage";
import HotDealsCarousel from "./HotDealsCarousel";

const categories = [
  { label: "Vegetable", color: "bg-purple-100", icon: "🥦" },
  { label: "Coffee & Drinks", color: "bg-pink-100", icon: "☕" },
  { label: "Milk & Dairy", color: "bg-yellow-100", icon: "🥛" },
];

const offers = [
  {
    name: "Fresh Carrot",
    img: "https://via.placeholder.com/80x80?text=Carrot",
    rating: 5,
    weight: "1kg, Priceg",
    price: "$4.99",
    bg: "bg-purple-100",
  },
  {
    name: "Fresh Salmon",
    img: "https://via.placeholder.com/80x80?text=Salmon",
    rating: 5,
    weight: "1kg, Priceg",
    price: "$4.99",
    bg: "bg-orange-100",
  },
];

export default function GroceryHome() {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome</p>
          <h1 className="font-bold text-lg">Yogesh!</h1>
        </div>
        <div className="flex items-center gap-3">
          <User className="w-6 h-6" />
          <Bell className="w-6 h-6" />
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 rounded-xl mb-4">
        <Search className="text-gray-500 mr-2 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none flex-1 text-sm"
        />
        <SlidersHorizontal className="text-gray-500 w-5 h-5" />
      </div>

      {/* Promo Banner */}
      <div className="bg-green-100 p-4 rounded-xl flex items-center justify-between mb-6">
        <div>
          <p className="font-semibold text-gray-800">Get Fresh Grocery</p>
          <p className="text-sm">in your Door</p>
          <span className="text-orange-600 font-semibold text-sm mt-1 block">
            49% Discount
          </span>
        </div>
        <img
          src="https://via.placeholder.com/100x100?text=Grocery+Guy"
          alt="promo"
          className="w-20 h-20 object-cover rounded-lg"
        />
      </div>
      <MainPage/>
      <HotDealsCarousel/>
      {/* Categories */}
      <h2 className="font-semibold text-base mb-2">Search By Category</h2>
      <div className="flex gap-3 mb-6">
        {categories.map((cat, i) => (
          <div
            key={i}
            className={`${cat.color} px-4 py-2 rounded-xl flex flex-col items-center text-sm font-medium`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.label}</span>
          </div>
        ))}
      </div>

      {/* Special Offers */}
      <h2 className="font-semibold text-base mb-2">Special Offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {offers.map((item, i) => (
          <div
            key={i}
            className={`${item.bg} p-3 rounded-xl flex flex-col justify-between`}
          >
            <div className="flex items-center gap-1 text-sm mb-1">
              <span className="text-orange-500">★ {item.rating}</span>
            </div>
            <img
              src={item.img}
              alt={item.name}
              className="w-16 h-16 object-contain mx-auto mb-2"
            />
            <p className="font-medium text-sm">{item.name}</p>
            <p className="text-xs text-gray-500">{item.weight}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="font-semibold">{item.price}</p>
              <button className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
