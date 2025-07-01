import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Minus, Plus, MapPin, Wallet2, StickyNote, CreditCard, Smartphone, ChevronDown } from 'lucide-react';
import OrderConfirmedModal from './OrderConfirmedModal';
import { useCart } from '../../context/CartContext';

const cartItems = [
  { id: 1, name: 'Bell Pepper Red', desc: '1kg', price: 199, image: '/images/pepper.png' },
  { id: 2, name: 'Red Chicken Egg', desc: '12 Piece', price: 79, image: '/images/egg.png' },
  { id: 3, name: 'Organic Banana', desc: '10 Piece', price: 49, image: '/images/banana.png' },
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'upi', name: 'UPI Payment', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'cod', name: 'Cash on Delivery', icon: <Wallet2 className="w-5 h-5" /> }
];

export default function CheckoutPage() {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[2]);
  const [walletBalance] = useState(150);

  const handleQty = (id, delta) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    ));
  };

  const { items, subtotal, totalItems } = useCart();
  
  const shipping = 30;
  const discount = 10;
  const tax = 10;
  const total = subtotal + shipping - discount-tax;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">

      {/* Delivery Address */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-6 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl"
      >
        <div className="p-2 bg-orange-100 dark:bg-gray-700 rounded-full">
          <MapPin className="text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Delivery Address</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">1901 Thornridge Cir. Shiloh, Hawaii 81063</p>
        </div>
        <ArrowRight className="text-gray-400" />
      </motion.div>

      {/* Cart Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-orange-200 dark:border-gray-700 rounded-xl p-4 mb-6 space-y-4"
      >
        <p className="font-semibold">Your Order ({totalItems})</p>
        {items.map(item => (
          <motion.div 
            key={item.id}
            layout
            className="flex items-center gap-4"
          >
            <motion.img 
              src={item.image} 
              alt={item.name} 
              className="w-14 h-14 object-cover rounded-md"
              whileHover={{ scale: 1.05 }}
            />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.categoryName}</p>
              <p className="font-bold mt-1">₹{item.price}</p>
            </div>
            <motion.div 
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <motion.button 
                onClick={() => handleQty(item.id, -1)}
                whileTap={{ scale: 0.9 }}
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <motion.span
                key={`qty-${item.id}`}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-medium"
              >
                {item.quantity}
              </motion.span>
              <motion.button 
                onClick={() => handleQty(item.id, 1)}
                whileTap={{ scale: 0.9 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Wallet & Shipping */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 mb-6"
      >
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Wallet2 className="w-5 h-5 text-green-600" />
            Wallet Balance
          </div>
          <span className="text-gray-700 dark:text-gray-300 font-semibold">₹{walletBalance.toFixed(2)}</span>
        </div>
        
        <div className="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
          <p className="font-semibold mb-1 text-sm">Shipping Details</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Expected delivery: 30-45 min</p>
        </div>
      </motion.div>

      {/* Payment Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <motion.div 
  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-700"
  onClick={() => setShowPaymentOptions(!showPaymentOptions)}
  whileHover={{ backgroundColor: "#f5f5f5" }}
  whileTap={{ scale: 0.98 }}
>
  <div className="flex flex-col">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
    <div className="flex items-center gap-3">
      {selectedPayment.icon}
      <span className="font-medium text-gray-800 dark:text-gray-200">
        {selectedPayment.name}
      </span>
    </div>
  </div>
  <motion.div
    animate={{ rotate: showPaymentOptions ? 180 : 0 }}
    transition={{ duration: 0.2 }}
  >
    <ChevronDown className="w-5 h-5 text-gray-500" />
  </motion.div>
</motion.div>

        <AnimatePresence>
          {showPaymentOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-2 overflow-hidden"
            >
              {paymentMethods.map(method => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${selectedPayment.id === method.id ? 'bg-orange-100 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'}`}
                  onClick={() => {
                    setSelectedPayment(method);
                    setShowPaymentOptions(false);
                  }}
                >
                  {method.icon}
                  <span>{method.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Additional Notes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <StickyNote className="w-5 h-5 text-orange-500" />
          <p className="font-semibold">Additional Notes</p>
        </div>
        <textarea
          placeholder="Any delivery instructions?"
          className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm border-none focus:ring-2 focus:ring-orange-400"
          rows={3}
        />
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 text-sm mb-6"
      >
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Total</span>
          <span className="text-orange-500">₹{total.toFixed(2)}</span>
        </div>
      </motion.div>

      <div className="sticky bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-white/90 to-transparent dark:from-gray-900/90 z-10">
    <motion.button
    onClick={() => setShowModal(true)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg transition"
    >
      Place Order
    </motion.button>
  </div>
      <OrderConfirmedModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}