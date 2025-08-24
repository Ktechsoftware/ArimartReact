import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Clock,
  Phone,
  User,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RotateCcw,
  Wallet,
  IndianRupee
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateDeliveryStatus, updateOrderStatusLocal, selectActiveDeliveries } from "../../Store/deliveryOrderSlice";

export const OTPDeliveryScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { trackId, userId } = location.state || {};

  // Get order data from Redux store
  const activeDeliveries = useSelector(selectActiveDeliveries);
  const orderData = activeDeliveries.find(order => order.trackId === trackId);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isCashConfirmed, setIsCashConfirmed] = useState(false);
  const [collectedAmount, setCollectedAmount] = useState(orderData?.totalAmount || 0);


  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 5000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length === 4) {
      setIsVerifying(true);

      // Simulate OTP API
      setTimeout(async () => {
        setIsVerifying(false);

        try {
          await dispatch(updateDeliveryStatus({
            TrackId: trackId,
            deliveryPartnerId: userId,
            Status: 'delivered'
          })).unwrap();

          dispatch(updateOrderStatusLocal({ trackId, status: 'Delivered' }));
          setVerificationStatus("success");
        } catch (error) {
          console.error("Delivery update failed:", error);
          setVerificationStatus("failed");
        }
      }, 2000);
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    // Add resend logic here
  };

  // If order data not found, show error
  if (!orderData) {
    return (
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to find order details for verification</p>
          <Link to='/orders'>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors">
              Back to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }


  if (verificationStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto bg-gray-50 min-h-screen flex items-center justify-center"
      >
        <div className="text-center p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-green-500" />
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-800 mb-2"
          >
            Delivery Completed!
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-6"
          >
            Order has been successfully delivered to {orderData.customer?.name || orderData.shippingAddress?.contactPerson}
          </motion.p>
          <Link to='/orders'>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              Continue to Next Order
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-gray-50 min-h-screen"
    >
      {/* Header */}
      <motion.div
        className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-16 z-20"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Delivery Verification</h1>
      </motion.div>

      {/* Order Summary Card */}
      <motion.div
        className="m-4 bg-white rounded-2xl p-4 shadow-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
              {orderData.product?.image ? (
                <img
                  src={`https://apiari.kuldeepchaurasia.in/Uploads/${orderData.product.image}`}
                  alt={orderData.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <Package size={20} className="text-blue-600" />
              </div>}

            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Order #{orderData.trackId}</h3>
              <p className="text-sm text-gray-500">
                {orderData.qty} {orderData.qty > 1 ? 'items' : 'item'} • ₹{orderData.totalAmount}
              </p>
              {orderData.product?.name && (
                <p className="text-xs text-gray-400 truncate max-w-[150px]">
                  {orderData.product.name}
                </p>
              )}
            </div>
          </div>
          <div className="bg-orange-100 px-3 py-1 rounded-full">
            <span className="text-orange-600 text-sm font-medium">Ready to Deliver</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User size={16} className="text-gray-400" />
            <span className="text-gray-700">
              {orderData.customer?.name || orderData.shippingAddress?.contactPerson || 'Customer'}
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin size={16} className="text-gray-400 mt-0.5" />
            <span className="text-gray-700 text-sm leading-relaxed">
              {orderData.shippingAddress?.fullAddress || 'Address not available'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-gray-400" />
            <span className="text-gray-700">
              {orderData.customer?.phone || orderData.shippingAddress?.phone || 'Phone not available'}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-gray-500">Payment Method:</span>
            <span className="text-sm font-medium text-gray-800">
              {orderData.paymentMethod || 'Not specified'}
            </span>
          </div>

          {/* Special Instructions */}
          {(orderData.specialInstructions || orderData.isFragile) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
              <p className="text-xs font-semibold text-yellow-700 mb-1">Special Instructions:</p>
              <div className="space-y-1">
                {orderData.isFragile && (
                  <p className="text-xs text-red-600 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    Fragile item - Handle with care
                  </p>
                )}
                {orderData.specialInstructions && (
                  <p className="text-xs text-gray-700">{orderData.specialInstructions}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* OTP Verification Section */}
      {(orderData.paymentMethod !== "COD" || isCashConfirmed) && (
        <motion.div
          className="m-4 bg-white rounded-2xl p-6 shadow-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} className="text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Enter OTP</h2>
            <p className="text-gray-600 text-sm">
              Ask {orderData.customer?.name || orderData.shippingAddress?.contactPerson || 'customer'} for the 4-digit OTP to confirm delivery
            </p>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </div>

          {/* Timer and Resend */}
          <div className="text-center mb-6">
            {!canResend ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-semibold text-blue-600">{timer}s</span>
              </p>
            ) : (
              <motion.button
                onClick={handleResendOtp}
                className="flex items-center justify-center space-x-2 text-blue-600 font-medium mx-auto hover:text-blue-700 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={16} />
                <span>Resend OTP</span>
              </motion.button>
            )}
          </div>

          {/* Verify Button */}
          <motion.button
            onClick={handleVerifyOtp}
            disabled={otp.join("").length !== 4 || isVerifying}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${otp.join("").length === 4 && !isVerifying
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            whileTap={otp.join("").length === 4 ? { scale: 0.98 } : {}}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify & Complete Delivery"
            )}
          </motion.button>
        </motion.div>
      )}

      {/* COD Cash Collection Step */}
      <AnimatePresence>
        {orderData.paymentMethod === "COD" && !isCashConfirmed && (
          <motion.div
            className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Header with icon */}
            <div className="flex items-center mb-4">
              <motion.div
                className="bg-blue-100 p-3 rounded-full mr-3"
                initial={{ rotate: -30, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Wallet className="h-6 w-6 text-blue-600" />
              </motion.div>
              <h2 className="text-xl font-bold text-gray-800">Collect Cash Payment</h2>
            </div>

            {/* Amount info */}
            <motion.div
              className="flex items-center justify-center bg-blue-50 rounded-xl p-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <IndianRupee className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-lg font-semibold text-blue-700">
                Amount to collect: {orderData.totalAmount}
              </span>
            </motion.div>

            <p className="text-sm text-gray-600 mb-4 text-center">
              Please collect the exact amount from the customer
            </p>

            {/* Input with rupee icon */}
            <motion.div
              className="relative mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter collected amount"
              />
            </motion.div>

            <motion.button
              onClick={() => {
                if (Number(collectedAmount) === Number(orderData.totalAmount)) {
                  setIsCashConfirmed(true);
                } else {
                  alert("Collected amount must match order total.");
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm Cash Collected
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Quick Actions */}
      <motion.div
        className="m-4 space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <a
          href={`tel:${orderData.customer?.phone || orderData.shippingAddress?.phone}`}
          className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Phone size={18} />
          <span>Call Customer</span>
        </a>

        <button className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
          <Clock size={18} />
          <span>Mark as Delayed</span>
        </button>
      </motion.div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </motion.div>
  );
};