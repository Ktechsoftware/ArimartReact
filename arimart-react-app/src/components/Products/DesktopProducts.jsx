import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import DiscountBadge from '../ui/DiscountBadge';
import DProductCard from './DProductcards';

const productCategories = [
    {
        name: "Vegetables",
        icon: "🥦",
        products: [
            {
                id: 1,
                name: "Fresh Broccoli",
                image: "https://m.media-amazon.com/images/G/31/img24/DEC/nav/FV.png",
                quantity: "500 g",
                rating: 4.6,
                ratingCount: "2,143",
                price: 60,
                originalPrice: 80,
                delivery: "Today 2 PM - 4 PM"
            },
            {
                id: 2,
                name: "Organic Carrot",
                image: "https://via.placeholder.com/150x150?text=Carrot",
                quantity: "1 kg",
                rating: 4.4,
                ratingCount: "3,211",
                price: 45,
                originalPrice: 59,
                delivery: "Today 3 PM - 5 PM"
            },
            {
                id: 3,
                name: "Green Capsicum",
                image: "https://via.placeholder.com/150x150?text=Capsicum",
                quantity: "500 g",
                rating: 4.2,
                ratingCount: "1,154",
                price: 39,
                originalPrice: 49,
                delivery: "Tomorrow 9 AM - 11 AM"
            }
        ]
    },
    {
        name: "Fruits",
        icon: "🍎",
        products: [
            {
                id: 4,
                name: "Red Apples (Premium)",
                image: "https://images-eu.ssl-images-amazon.com/images/I/51ebZJ+DR4L.AC_SL240_.jpg",
                quantity: "4 pcs (approx. 800 g)",
                rating: 4.7,
                ratingCount: "5,376",
                price: 129,
                originalPrice: 149,
                delivery: "Today 12 PM - 2 PM"
            },
            {
                id: 5,
                name: "Seedless Black Grapes",
                image: "https://via.placeholder.com/150x150?text=Grapes",
                quantity: "500 g",
                rating: 4.3,
                ratingCount: "2,783",
                price: 75,
                originalPrice: 99,
                delivery: "Today 1 PM - 3 PM"
            },
            {
                id: 6,
                name: "Banana (Robusta)",
                image: "https://via.placeholder.com/150x150?text=Banana",
                quantity: "6 pcs",
                rating: 4.5,
                ratingCount: "6,012",
                price: 40,
                originalPrice: 50,
                delivery: "Today 10 AM - 12 PM"
            }
        ]
    }
];



const DesktopProducts = () => {
    const carouselRefs = useRef(productCategories.map(() => React.createRef()));

    const scroll = (direction, categoryIndex) => {
        const container = carouselRefs.current[categoryIndex].current;
        const scrollAmount = direction === 'left' ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="hidden md:block py-8 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
            {productCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">{category.icon}</span>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                {category.name}
                            </h2>
                        </div>
                        <button className="text-sm text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors">
                            View all
                        </button>
                    </div>

                    <div className="relative group">
                        <button
                            onClick={() => scroll('left', categoryIndex)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ChevronLeftIcon className="text-gray-700 dark:text-gray-300 text-xl" />
                        </button>

                        <button
                            onClick={() => scroll('right', categoryIndex)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <ChevronRightIcon className="text-gray-700 dark:text-gray-300 text-xl" />
                        </button>

                        <div
                            ref={carouselRefs.current[categoryIndex]}
                            className="flex gap-6 overflow-x-auto pb-6 px-1 scrollbar-hide"
                        >
                            {category.products.map((product) => (
                                <DProductCard key={product.id} product={product} />
                            ))}

                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DesktopProducts;