import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
const products = [
  {
    name: "Beetroot",
    desc: "Local shop",
    img: "https://via.placeholder.com/80x80?text=Beetroot",
    weight: "500 gm",
    price: "14.29$",
  },
  {
    name: "Italian Avocado",
    desc: "Local shop",
    img: "https://via.placeholder.com/80x80?text=Avocado",
    weight: "450 gm",
    price: "14.29$",
  },
  {
    name: "Beef Mixed",
    desc: "Cut Bone",
    img: "https://via.placeholder.com/80x80?text=Beef",
    weight: "1000 gm",
    price: "14.29$",
  },
  {
    name: "Plant Hunter",
    desc: "Frozen pack",
    img: "https://via.placeholder.com/80x80?text=Plant",
    weight: "250 gm",
    price: "14.29$",
  },
  {
    name: "Sprite",
    desc: "Can & Bottle",
    img: "https://via.placeholder.com/80x80?text=Sprite",
    weight: "250 gm",
    price: "14.29$",
  },
  {
    name: "Szam amm",
    desc: "Process food",
    img: "https://via.placeholder.com/80x80?text=Szam",
    weight: "300 gm",
    price: "14.29$",
  },
];
const TopProducts = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-pulse">
              <div className="w-20 h-20 mx-auto bg-gray-300 dark:bg-gray-700 rounded mb-3" />
              <div className="space-y-2 text-center">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mx-auto" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto" />
                <div className="h-4 bg-green-300 dark:bg-green-700 rounded w-1/2 mx-auto mt-2" />
                <div className="h-9 bg-green-400 dark:bg-green-600 rounded-lg w-full mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-20 h-20 mx-auto object-contain mb-3"
              />
              <div className="text-center">
                <p className="font-semibold text-sm">{product.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.desc}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.weight}</p>
                <p className="font-semibold text-green-600 dark:text-green-400 mt-2">{product.price}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white text-sm w-full py-2 rounded-lg flex items-center justify-center"
                >
                  <span>+</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  )
}

export default TopProducts