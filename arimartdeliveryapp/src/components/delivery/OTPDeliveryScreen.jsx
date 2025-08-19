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
  RotateCcw
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const OTPDeliveryScreen = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
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

      // Simulate API call
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationStatus("success");
      }, 2000);
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    // Add resend logic here
  };

  const orderDetails = {
    orderId: "ORD123456789",
    customerName: "Priya Sharma",
    address: "B-204, Green Valley Apartments, Sector 18, Noida",
    phone: "+91 9876543210",
    items: 3,
    amount: "₹485"
  };

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
            Order has been successfully delivered to {orderDetails.customerName}
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
        className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-16"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
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
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Order #{orderDetails.orderId}</h3>
              <p className="text-sm text-gray-500">{orderDetails.items} items • {orderDetails.amount}</p>
            </div>
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full">
            <span className="text-green-600 text-sm font-medium">Delivered</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <User size={16} className="text-gray-400" />
            <span className="text-gray-700">{orderDetails.customerName}</span>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin size={16} className="text-gray-400 mt-0.5" />
            <span className="text-gray-700 text-sm leading-relaxed">{orderDetails.address}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-gray-400" />
            <span className="text-gray-700">{orderDetails.phone}</span>
          </div>
        </div>
      </motion.div>

      {/* OTP Verification Section */}
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
            Ask customer for the 4-digit OTP to confirm delivery
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

      {/* Quick Actions */}
      <motion.div
        className="m-4 space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
          <Phone size={18} />
          <span>Call Customer</span>
        </button>

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