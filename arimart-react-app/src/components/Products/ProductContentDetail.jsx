import { Star } from "lucide-react";
import DProductCard from "./DProductcards";

const product = {
  name: "Fresh Banana Robusta, 1kg",
  image: "https://images-eu.ssl-images-amazon.com/images/I/51ebZJ+DR4L.AC_SL240_.jpg",
  price: 78,
  originalPrice: 140,
  rating: 4.0,
  reviews: 30689,
  sold: 2000,
  description:
    "It is a semi-tall variety, grown mostly in Tamil Nadu and parts of Karnataka. Fruit is very sweet with good aroma.",
};



export default function ProductContentDetail() {
  return (
    <div className="hidden md:block bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6">
      {/* Product Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-lg w-60 h-60 object-cover"
          />
        </div>

        {/* Main Info */}
        <div className="md:col-span-2 space-y-3">
          <h1 className="text-xl font-semibold">{product.name}</h1>

          {/* Rating and Sold */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 font-medium">{product.rating}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              ({product.reviews} ratings) • {product.sold} bought this month
            </span>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="text-2xl font-bold text-lime-600">
              ₹{product.price}
              <span className="text-sm font-normal text-gray-400 line-through ml-2">
                ₹{product.originalPrice}
              </span>
              <span className="ml-2 text-red-500 font-semibold">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            </div>
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* Cashback */}
          <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/10 border border-orange-300 dark:border-orange-500 px-3 py-2 rounded-md">
            Cashback: Get 5% back with Amazon Pay ICICI Bank credit card for Prime members.
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-sm mt-2 text-gray-700 dark:text-gray-300">
            <span>✔ Free Delivery</span>
            <span>✔ Secure Transaction</span>
            <span>✔ Returnable</span>
            <span>✔ Vegetarian</span>
          </div>
        </div>
      </div>

      {/* Delivery + Cart Section */}
      <div className="border p-4 rounded-md mt-6 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-green-600 font-medium">In Stock</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              FREE delivery today from 2 PM - 4 PM on orders over ₹249.
            </p>
          </div>
          <button className="mt-4 sm:mt-0 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-md shadow">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Product Description</h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {product.description}
        </p>
      </div>

      {/* Promise Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 bg-white dark:bg-gray-800 border rounded-md p-6">
        {[
          {
            title: "Clean and Hygienic",
            desc: "We use clean and well-maintained facilities for cutting, packing, and storing fruits and vegetables.",
            icon: "🧼",
          },
          {
            title: "Guaranteed Weight",
            desc: "Net weight of product will be equal to or greater than mentioned.",
            icon: "⚖️",
          },
          {
            title: "Food Safety",
            desc: "Our vendors follow all the food safety norms as per FSSAI guidelines.",
            icon: "🍽️",
          },
        ].map((item, index) => (
          <div key={index} className="text-center border p-4 rounded-md shadow-sm dark:border-gray-700">
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="text-md font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {item.desc}
            </p>
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 bg-white dark:bg-gray-800 border rounded-md p-6 justify-center items-center">
        <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/f4258821-4583-407e-9882-650d32b364af.__CR0,0,300,300_PT0_SX300_V1___.jpg" alt="Verified"/>
        <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/94c5ccbd-5093-4b45-a9dd-55fb709761fd.__CR0,0,300,300_PT0_SX300_V1___.jpg" alt="Verified"/>
        <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/b5c01efa-26a5-4350-bfa5-bd697b45c5f3.__CR0,0,300,300_PT0_SX300_V1___.jpg" alt="Verified"/>
        </div>

      {/* Ingredients */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">banana</p>
      </div>

      {/* Legal */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
        While we try to ensure product information is correct, on occasion manufacturers may alter ingredients.
      </div>

      <h4 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300">Products related to this item</h4>
      <DProductCard product={product} />
    </div>
  );
}
