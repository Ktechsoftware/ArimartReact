import { Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import PromoCodeInput from './PromoCodeInput';

const items = [
  {
    id: 1,
    name: 'Broiler Chicken Skin',
    description: 'Fresh Chicken Skin',
    price: 265,
    image: '/images/chicken.png',
  },
  {
    id: 2,
    name: 'Fresh Watermelon',
    description: 'Fresh Watermelon',
    price: 265,
    image: '/images/watermelon.png',
  },
  {
    id: 3,
    name: 'Fresh Green bean',
    description: 'Original Fresh Green Bean',
    price: 265,
    image: '/images/greenbean.png',
  },
];

export default function CartDetails() {
  const [cart, setCart] = useState(items.map(item => ({ ...item, quantity: 1 })));

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 30;
  const discount = 10;
  const total = subtotal + shipping - discount;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 text-gray-800 dark:text-gray-100 rounded-2xl"
    >
      <h2 className="text-md text-gray-800 dark:text-gray-100 font-bold mb-4">Your Items</h2>

      <AnimatePresence>
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            Your cart is empty
          </motion.div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl relative"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-lg object-cover" 
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                  <p className="font-bold mt-1">₹{item.price.toFixed(2)}</p>
                </div>
                
                {/* Quantity controls and trash button at the bottom */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-full px-2 py-1 shadow-sm">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </motion.button>
                    
                    <motion.span 
                      key={`quantity-${item.id}-${item.quantity}`}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-sm font-medium w-5 text-center"
                    >
                      {item.quantity}
                    </motion.span>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {cart.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-6 space-y-3"
        >
          <PromoCodeInput/>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Discount</span>
              <span>₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span className="text-green-500">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/checkout" className="sticky bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 z-10">
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-lg transition"
  >
    Proceed To Payment
  </motion.button>
</Link>

        </motion.div>
      )}
    </motion.div>
  );
}