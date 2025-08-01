import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Minus, Plus, MapPin, Wallet2, Truck, Zap, Calendar,
  StickyNote, CreditCard, Smartphone, ChevronDown,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import OrderConfirmedModal from './OrderConfirmedModal';
import { useCart } from '../../context/CartContext';
import { checkoutCart } from '../../Store/orderSlice';
import { clearCart } from '../../Store/cartSlice';
import { deductFromWallet, fetchWalletBalance } from '../../Store/walletSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { refreshUserInfo } from '../../Store/authSlice';
import { AddressSection } from '../common/AddressSection';
import PromoCodeInput from '../Cart/PromoCodeInput';
import { clearPromoState } from '../../Store/promocodeSlice';

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'upi', name: 'UPI Payment', icon: <Smartphone className="w-5 h-5" /> },
  { id: 'cod', name: 'Cash on Delivery', icon: <Wallet2 className="w-5 h-5" /> }
];

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const cartType = params.get("cart"); // "both", "cart", or "group"
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
  const userId = userData?.id;
  const [selectedMethod, setSelectedMethod] = useState('standard');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Get promo code state from Redux
  const { applyResult: appliedPromo, loading: promoLoading } = useSelector(state => state.promocode);

  useEffect(() => {
    if (userId) {
      dispatch(refreshUserInfo(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearPromoState());
    };
  }, [dispatch]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[2]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [latestTrackId, setLatestTrackId] = useState(null);
  const [sipid, setSipid] = useState(0);
  const [useWalletAmount, setUseWalletAmount] = useState(0);
  const walletBalance = useSelector((state) => state.wallet.balance);

  const {
    regularCartItems,
    groupCartItems,
    totalItems,
    subtotal,
    groupTotalItems,
    groupSubtotal,
    updateQuantity,
    removeFromCart
  } = useCart();

  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchWalletBalance(userData.id));
    }
  }, [userData, dispatch]);

  let items = []
  if (cartType === "both") {
    items = [...regularCartItems, ...groupCartItems];
    console.log(items)
  } else if (cartType === "group") {
    items = groupCartItems;
  } else {
    items = regularCartItems;
  }

  const handleChangeQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) {
      await handleRemoveItem(cartItemId);
      return;
    }
    try {
      await updateQuantity(cartItemId, newQty);
    } catch (err) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlecheckoutCart = async () => {
    if (!sipid) {
      toast.error("Please select delivery address to place order.");
      return;
    }

    if (selectedPayment.id !== 'cod') {
      navigate('/checkout/payment');
      return;
    }

    setIsProcessing(true);
    const processingTimer = setTimeout(() => {
      setIsProcessing(false);
    }, 6000);

    try {
      const cartIds = items.map(item => item.id).join(',');
      const isGroupOrder = items.some(item => item.groupId || item.groupid);
      const groupId = isGroupOrder ? (items[0].groupId || items[0].groupid) : null;

      // Deduct wallet amount first (if applicable)
      if (useWalletAmount > 0) {
        try {
          await dispatch(deductFromWallet({
            userid: userId,
            amount: useWalletAmount
          })).unwrap();
        } catch (deductError) {
          throw new Error("Wallet deduction failed: " + (deductError?.message || ""));
        }
      }

      const payload = {
        Addid: cartIds,
        Userid: userId,
        Sipid: sipid
      };

      if (groupId) {
        payload.groupId = groupId;
      }

      // Include promo code information if applied
      if (appliedPromo) {
        payload.promoCode = appliedPromo.code;
        payload.discountAmount = promoDiscountAmount;
      }

      const res = await dispatch(checkoutCart(payload)).unwrap();
      clearTimeout(processingTimer);
      const trackId = res.orderid;

      if (!trackId) {
        throw new Error("Invalid response: Track ID missing");
      }

      setLatestTrackId(trackId);
      setShowModal(true);

      if (cartType === "both") {
        clearCart({ clearBoth: true });
      } else if (cartType === "group") {
        clearCart({ clearAllGroups: true });
      } else {
        clearCart();
      }
      dispatch(clearPromoState());
      toast.success("Order placed successfully!");
    } catch (err) {
      clearTimeout(processingTimer);
      console.error("Checkout failed:", err);
      toast.error(err.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // ⏹️ Determine subtotal dynamically based on cartType
  let displaySubtotal = 0;

  if (cartType === "group") {
    displaySubtotal = groupSubtotal;
  } else if (cartType === "both") {
    displaySubtotal = subtotal + groupSubtotal;
  } else {
    displaySubtotal = subtotal;
  }
  console.log("promocode applied : ", appliedPromo)
  // ⏹️ Calculate promo discount amount
  const promoDiscountAmount = appliedPromo?.discount;

  // ⏹️ Calculate delivery fee based on selected method
  const getDeliveryFee = () => {
    switch (selectedMethod) {
      case 'express':
        return 49;
      case 'scheduled':
        return 29;
      default:
        return 0; // Standard delivery is free
    }
  };

  const shipping = isNaN(getDeliveryFee()) ? 0 : getDeliveryFee();
  const tax = 10;
  const discount = isNaN(promoDiscountAmount) ? 0 : promoDiscountAmount;
  const wallet = isNaN(useWalletAmount) ? 0 : useWalletAmount;
  const rawTotal = (displaySubtotal || 0) + shipping + tax - discount;
  const total = Math.max(0, rawTotal - wallet);


  return (
    <div className="max-w-6xl mx-auto p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      {/* Address */}
      <AddressSection userData={userData} onSelectPrimary={(id) => setSipid(id)} />

      {/* Cart Items */}
      <motion.div className="border border-orange-200 dark:border-gray-700 rounded-xl p-4 mb-6 space-y-4">
        <p className="font-semibold">
          Your Order
          {cartType === "both" && (
            <>
              &nbsp;(
              <span className="text-orange-600">{regularCartItems.length} regular items</span>
              &nbsp;+&nbsp;
              <span className="text-purple-600">{groupCartItems.length} group items</span>
              )
            </>
          )}
          {cartType === "cart" && (
            <> (<span className="text-orange-600">{regularCartItems.length} items</span>)</>
          )}
          {cartType === "group" && (
            <> (<span className="text-purple-600">{groupCartItems.length} items</span>)</>
          )}
        </p>
        {console.log("group cart items : ", groupCartItems)}
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4">
            <img src={"https://apiari.kuldeepchaurasia.in/Uploads/" + item.image} className="w-14 h-14 rounded-md object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">{item.categoryName}</p>
              <p className="font-bold mt-1">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <button><Minus className="w-4 h-4" /></button>
              <span className="font-medium"><X className='w-4 h-4'/>{item.quantity} {item.wweight}</span>
              <button><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Promo Code Section */}
      <PromoCodeInput subtotal={displaySubtotal} />

      {/* Wallet */}
      <div className="space-y-4 bg-green-50 dark:bg-gray-800 rounded-lg mb-6">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 text-sm">
            <Wallet2 className="w-5 h-5 text-green-600" /> Wallet Balance
          </div>
          <span className="font-semibold">₹{walletBalance || 0}</span>
        </div>
        <div className="flex items-center justify-between px-3 pb-2">
          <label className="text-sm font-medium">Use Wallet</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={Math.min(walletBalance, total)}
              value={useWalletAmount}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setUseWalletAmount(Math.min(value, walletBalance, total));
              }}
              className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
            />
            <button
              onClick={() => setUseWalletAmount(Math.min(walletBalance, total))}
              className="text-xs text-orange-600 hover:underline"
            >
              Apply Max
            </button>
          </div>
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
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${selectedPayment.id === method.id ? 'bg-orange-100' : 'bg-gray-50'
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

      <div className="mt-6 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Options</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Standard Delivery */}
          <motion.div
            whileHover={{ y: -5 }}
            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all 
        ${selectedMethod === 'standard' ?
                'border-green-500 bg-green-50 dark:bg-green-900/20' :
                'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}`}
            onClick={() => setSelectedMethod('standard')}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-5 items-center mt-0.5">
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center
            ${selectedMethod === 'standard' ?
                    'border-green-500 bg-green-500' :
                    'border-gray-400 dark:border-gray-500'}`}>
                  {selectedMethod === 'standard' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 bg-white rounded-full"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Standard Delivery</h4>
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">2-3 business days</p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Delivered by local partners
                </p>
              </div>
            </div>
            {selectedMethod === 'standard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                Selected
              </motion.div>
            )}
          </motion.div>

          {/* Express Delivery */}
          <motion.div
            whileHover={{ y: -5 }}
            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all 
        ${selectedMethod === 'express' ?
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}`}
            onClick={() => setSelectedMethod('express')}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-5 items-center mt-0.5">
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center
            ${selectedMethod === 'express' ?
                    'border-blue-500 bg-blue-500' :
                    'border-gray-400 dark:border-gray-500'}`}>
                  {selectedMethod === 'express' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 bg-white rounded-full"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Express Delivery</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                    ₹49
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Same day delivery</p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Available before 12 PM
                </p>
              </div>
            </div>
            {selectedMethod === 'express' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                Selected
              </motion.div>
            )}
          </motion.div>

          {/* Scheduled Delivery */}
          <motion.div
            whileHover={{ y: -5 }}
            className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all 
        ${selectedMethod === 'scheduled' ?
                'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'}`}
            onClick={() => setSelectedMethod('scheduled')}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-5 items-center mt-0.5">
                <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center
            ${selectedMethod === 'scheduled' ?
                    'border-purple-500 bg-purple-500' :
                    'border-gray-400 dark:border-gray-500'}`}>
                  {selectedMethod === 'scheduled' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 bg-white rounded-full"
                    />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Scheduled Delivery</h4>
                  <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-0.5 rounded-full">
                    ₹29
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Choose your time slot</p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> 7 AM - 10 PM slots
                </p>
              </div>
            </div>
            {selectedMethod === 'scheduled' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full"
              >
                Selected
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Time Slot Selector (shown when scheduled is selected) */}
        {selectedMethod === 'scheduled' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 space-y-2"
          >
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Time Slot</h4>
            <div className="grid grid-cols-3 gap-2">
              {['9 AM - 12 PM', '12 PM - 3 PM', '3 PM - 6 PM', '6 PM - 9 PM'].map(slot => (
                <motion.button
                  key={slot}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-2 px-3 rounded-lg text-sm border ${selectedSlot === slot ?
                    'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Payment Summary */}
      <motion.div className="border-t mt-2 pt-4 space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{displaySubtotal.toFixed(2)}</span>
        </div>

        {/* Show promo discount if applied */}
        {appliedPromo && promoDiscountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Promo Discount ({appliedPromo.code})</span>
            <span>- ₹{promoDiscountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹{shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        {useWalletAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Wallet Used</span>
            <span>- ₹{useWalletAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-orange-500">₹{total.toFixed(2)}</span>
        </div>
      </motion.div>

      <div className="sticky bottom-16 md:bottom-0 flex justify-center p-4 bg-white dark:bg-gray-900 z-10">
        <motion.button
          onClick={handlecheckoutCart}
          disabled={isProcessing}
          whileTap={!isProcessing ? { scale: 0.98 } : {}}
          className={`w-full max-w-md ${isProcessing ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white font-semibold py-3 rounded-xl shadow-lg transition-colors`}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </motion.button>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm mx-4"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-4 border-orange-300 border-b-transparent animate-spin animation-delay-200"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  Placing Your Order
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Please wait while we process your order...
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <OrderConfirmedModal userData={userData} isOpen={showModal} onClose={() => setShowModal(false)} trackId={latestTrackId} />
    </div>
  );
}