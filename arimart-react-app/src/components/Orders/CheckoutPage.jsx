import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Minus, Plus, MapPin, Wallet2,
  StickyNote, CreditCard, Smartphone, ChevronDown
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import OrderConfirmedModal from './OrderConfirmedModal';
import { useCart } from '../../context/CartContext';
import { checkoutCart } from '../../Store/orderSlice';
import { clearCart } from '../../Store/cartSlice';
import { fetchWalletBalance } from '../../Store/walletSlice';

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'upi', name: 'UPI Payment', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'cod', name: 'Cash on Delivery', icon: <Wallet2 className="w-5 h-5" /> }
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
  const userId = userData?.id;

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[2]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [latestTrackId, setLatestTrackId] = useState(null);

  const { items, subtotal, totalItems } = useCart();

  useEffect(() => {
    if (userData?.userId) {
      dispatch(fetchWalletBalance(userData.userId));
    }
  }, [userData]);

  const handlecheckoutCart = async () => {
  try {
    const cartIds = items.map(item => item.id).join(',');
    const payload = {
      Addid: cartIds,
      Userid: userId,
      Sipid: "0"
    };

    const res = await dispatch(checkoutCart(payload)).unwrap();

    const trackId = res.orderid;
    if (!trackId) {
      throw new Error("Invalid response: Track ID missing");
    }

    setLatestTrackId(trackId);
    setShowModal(true);
    dispatch(clearCart()); // ✅ only after success
    toast.success("Order placed successfully!");
  } catch (err) {
    console.error("Checkout failed:", err);
    toast.error(err.message || "Checkout failed");
  }
};

  const shipping = 30;
  const discount = 10;
  const tax = 10;
  const total = subtotal + shipping - discount - tax;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      {/* Address */}
      <motion.div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl">
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
      <motion.div className="border border-orange-200 dark:border-gray-700 rounded-xl p-4 mb-6 space-y-4">
        <p className="font-semibold">Your Order ({totalItems})</p>
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4">
            <img src={item.image} className="w-14 h-14 rounded-md object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.categoryName}</p>
              <p className="font-bold mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <button><Minus className="w-4 h-4" /></button>
              <span className="font-medium">{item.quantity}</span>
              <button><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Wallet */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Wallet2 className="w-5 h-5 text-green-600" /> Wallet Balance
          </div>
          <span className="font-semibold">₹{userData?.walletBalance || 0}</span>
        </div>
      </div>

      {/* Payment Method */}
      <motion.div className="mb-6">
        <div
          className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border cursor-pointer"
          onClick={() => setShowPaymentOptions(!showPaymentOptions)}
        >
          <div className="flex flex-col">
            <p className="text-sm text-gray-500">Payment Method</p>
            <div className="flex items-center gap-3">
              {selectedPayment.icon}
              <span className="font-medium">{selectedPayment.name}</span>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>

        <AnimatePresence>
          {showPaymentOptions && (
            <motion.div className="mt-2 space-y-2">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                    selectedPayment.id === method.id ? 'bg-orange-100' : 'bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedPayment(method);
                    setShowPaymentOptions(false);
                  }}
                >
                  {method.icon}
                  <span>{method.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Payment Summary */}
      <motion.div className="border-t pt-4 space-y-3 text-sm mb-6">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span>₹{shipping}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>₹{tax}</span></div>
        <div className="flex justify-between font-bold text-lg pt-2">
          <span>Total</span><span className="text-orange-500">₹{total.toFixed(2)}</span>
        </div>
      </motion.div>

      <div className="sticky bottom-0 flex justify-center p-4 bg-white dark:bg-gray-900 z-10">
        <motion.button
          onClick={handlecheckoutCart}
          className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg"
        >
          Place Order
        </motion.button>
      </div>

      <OrderConfirmedModal isOpen={showModal} onClose={() => setShowModal(false)} trackId={latestTrackId} />
    </div>
  );
}
