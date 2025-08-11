import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MainPage() {
  const prices = [9, 49, 99, 999];
  const storeImages = [
    "https://static.vecteezy.com/system/resources/previews/022/251/571/original/store-3d-rendering-icon-illustration-transparent-background-shopping-and-retail-png.png",
    "https://png.pngtree.com/png-clipart/20210311/original/pngtree-youth-fashion-personality-summer-womens-clothing-store-clipart-png-image_6046804.jpg",
    "https://png.pngtree.com/png-vector/20240328/ourlarge/pngtree-shop-store-3d-pic-png-image_12248317.png",
    "https://png.pngtree.com/png-vector/20241119/ourmid/pngtree-a-3d-shop-or-retail-store-png-image_14149792.png"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="md:mb-0 mb-8"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 rounded-2xl"
      >
        <div className="flex justify-center gap-4">
          {prices.map((price, idx) => (
            <PriceCard 
              key={idx} 
              price={price} 
              image={storeImages[idx]} 
              delay={0.5 + idx * 0.1}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function PriceCard({ price, image, delay }) {
  return (
    <Link to={`/topstore/${price}`}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.1, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        className="md:hidden flex flex-col items-center justify-center w-20 h-20 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all relative overflow-visible"
      >
        {/* Floating store image */}
        <img
          src={image}
          alt="3D Store"
          className="absolute -top-6 w-16 h-16 object-contain pointer-events-none"
        />

        {/* Price & Label */}
        <p className="text-blue-600 dark:text-blue-400 font-bold z-10 mt-6">
          ₹{price}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-300">Store</p>
      </motion.div>
    </Link>
  );
}



function ActionCard({ icon, label, color ,tolink}) {
  return (
    <motion.div 
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`flex md:hidden flex-col items-center justify-center w-24 h-24 ${color} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all`}
    >
        <Link to={tolink}>
      <div className="mb-2">{icon}</div>
      <p className="text-xs text-center font-medium">{label}</p>
      </Link>
    </motion.div>
  );
}