import { motion } from 'framer-motion';
import { UserPlus, Gift, Wallet, Search } from 'lucide-react';
import CarouselComponent from './CarouselComponent';
import { Link } from 'react-router-dom';

export default function MainPage() {
    const prices = [9, 49, 99, 999];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="md:mb-0 mb-8"
        >

            {/* Carousel */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <CarouselComponent />
            </motion.div>

            {/* Action Cards Section */}
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10 rounded-2xl"
            >
                {/* Action Buttons */}
                <div className="flex justify-center gap-4 md:mb-0 mb-6">
                    <ActionCard 
                        icon={<UserPlus className="w-6 h-6" />} 
                        label="Share & Earn ₹50" 
                        color="bg-gradient-to-r from-blue-500 to-blue-400"
                        tolink="/home/referandearn"
                    />
                    <ActionCard 
                        icon={<Gift className="w-6 h-6" />} 
                        label="Rewards" 
                        color="bg-gradient-to-r from-purple-500 to-purple-400"
                        tolink="/promocodes"
                    />
                    <ActionCard 
                        icon={<Wallet className="w-6 h-6" />} 
                        label="Wallet" 
                        color="bg-gradient-to-r from-green-500 to-green-400"
                        tolink="/home/wallet"
                    />
                </div>

                {/* Pricing Options */}
                <div className="flex justify-center gap-4">
                    {prices.map((price, idx) => (
                        <PriceCard 
                            key={idx} 
                            price={price} 
                            delay={0.5 + idx * 0.1}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
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

function PriceCard({ price, delay }) {
  return (
   <Link to={`/topstore/${price}`}>
    <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.1, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        className="md:hidden flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-gray-700 rounded-full shadow-md hover:shadow-lg transition-all"
    >
      <p className="text-blue-600 dark:text-blue-400 font-bold">₹{price}</p>
      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">Store</p>
    </motion.div>
    </Link>
  );
}