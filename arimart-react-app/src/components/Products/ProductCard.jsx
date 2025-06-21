import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const groceryProducts = [
  {
    id: 1,
    name: "Organic Bananas",
    weight: "1kg",
    price: "$1.99",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFuYW5hc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-yellow-50"
  },
  {
    id: 2,
    name: "Fresh Strawberries",
    weight: "500g",
    price: "$3.49",
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyYXdiZXJyaWVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    bg: "bg-red-50"
  },
  {
    id: 3,
    name: "Avocados",
    weight: "3 pieces",
    price: "$2.99",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZvY2Fkb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-green-50"
  },
  {
    id: 4,
    name: "Whole Milk",
    weight: "1L",
    price: "$2.29",
    rating: 4.5,
    img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlsa3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-blue-50"
  },
  {
    id: 5,
    name: "Brown Eggs",
    weight: "12 pieces",
    price: "$3.79",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWdnc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-amber-50"
  },
  {
    id: 6,
    name: "Whole Wheat Bread",
    weight: "500g",
    price: "$2.49",
    rating: 4.4,
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    bg: "bg-orange-50"
  }
];

const ProductCard = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-1">
      {groceryProducts.map((product) => (
        <motion.div
          key={product.id}
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className={`${product.bg} p-2 rounded-xl flex flex-col justify-between h-full cursor-pointer`}
        >
          <div className="flex items-center gap-1 text-xs mb-1">
            <span className="text-orange-500">★ {product.rating}</span>
          </div>
          
          <Link to="/product/category/123" className="relative h-32 w-full mb-3">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
          </Link>
          
          <div>
            <p className="font-medium text-sm line-clamp-2 mb-1">{product.name}</p>
            <p className="text-xs text-gray-500 mb-2">{product.weight}</p>
            
            <div className="flex justify-between items-center">
              <p className="font-semibold text-base">{product.price}</p>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="bg-orange-500 hover:bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors"
              >
                +
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductCard;