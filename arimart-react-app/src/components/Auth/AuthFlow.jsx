import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import LoaderSpinner from "../LoaderSpinner";
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp, registerUser } from '../../api/auth'
import toast from 'react-hot-toast';
import { Phone, ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

const onboardingSlides = [
  {
    image: 'https://img.freepik.com/free-vector/safe-food-delivery-concept_23-2148559600.jpg',
    title: "Convenient & Fast Delivery",
    description: "Order on Arimart & get it delivered by 4 hours"
  },
  {
    image: 'https://img.freepik.com/free-vector/flat-world-vegetarian-day-background_23-2149623819.jpg',
    title: "Healthy & Fresh",
    description: "Hygienically managed from farmland to your doorstep delivery, farm to your door in less than 12 hours"
  },
  {
    image: 'https://img.freepik.com/free-vector/people-shopping-with-bags_24908-56774.jpg',
    title: "Purchase Together, Save More Together",
    description: "Purchase together in group with your friends & get up to 80% off, extra discount!"
  }
];
// Replace your OnboardingSlider component with this version:

const OnboardingSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-8">
      {/* Carousel content */}
      <div className="flex flex-col items-center text-center">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 200,
              duration: 0.4
            }}
            className="w-full flex flex-col items-center"
          >
            {/* Illustration */}
            <div className="relative mb-6 w-full max-w-sm mx-auto">
              <motion.img
                src={onboardingSlides[currentSlide].image}
                alt="Onboarding illustration"
                className="w-full h-48 object-cover rounded-2xl shadow-lg"
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 20 }}
              />
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full blur-2xl opacity-40 -z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.4 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </div>

            {/* Text */}
            <div className="h-40">
            <motion.h3
              className="text-lg font-bold mb-3 text-gray-900 dark:text-white px-4"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {onboardingSlides[currentSlide].title}
            </motion.h3>
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 max-w-xs leading-relaxed px-4"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {onboardingSlides[currentSlide].description}
            </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <motion.div
          className="flex gap-2 justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {onboardingSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? 'bg-green-500 dark:bg-green-400 w-6'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const DesktopOnboardingSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % onboardingSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white">
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200,
            duration: 0.5
          }}
          className="text-center"
        >
          <motion.img
            src={onboardingSlides[currentSlide].image}
            alt="Onboarding illustration"
            className="w-full h-64 object-cover rounded-2xl mb-6 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
          />

          <motion.h3
            className="text-xl font-bold mb-3 text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {onboardingSlides[currentSlide].title}
          </motion.h3>

          <motion.p
            className="text-green-100 dark:text-green-200 text-sm leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {onboardingSlides[currentSlide].description}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Desktop Indicators */}
      <div className="flex gap-2 justify-center mt-6">
        {onboardingSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                ? 'bg-white w-6'
                : 'bg-green-200 hover:bg-green-100'
              }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          />
        ))}
      </div>
    </div>
  );
};

export default function AuthFlow() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [form, setForm] = useState({ fullName: '', email: '', referral: '' });
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referCode = params.get('refercode');
    if (referCode) {
      setForm(prev => ({ ...prev, referral: referCode }));
    }

    // Capacitor Keyboard listeners
    if (isNativeApp) {
      const showListener = Keyboard.addListener('keyboardWillShow', info => {
        setKeyboardHeight(info.keyboardHeight);
        setIsKeyboardVisible(true);
      });

      const hideListener = Keyboard.addListener('keyboardWillHide', () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      });

      return () => {
        showListener.remove();
        hideListener.remove();
      };
    }
  }, []);

  const validateIndianMobile = (number) => {
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(number);
  };

  const handleChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    setMobile(numericValue);
    setIsValid(validateIndianMobile(numericValue));
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const handleOTPChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleResendOTP = () => {
    setCountdown(30);
    console.log('Resending OTP to:', mobile);
  };

  const handleOTPPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pasteData.length === 6) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        if (pasteData[i]) {
          newOtp[i] = pasteData[i];
        }
      }
      setOtp(newOtp);
      document.getElementById('otp-input-5').focus();
    }
  };

  const handleStepChange = (nextStep) => {
    setIsLoading(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsLoading(false);
    }, 1000);
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const res = await registerUser(form.fullName, form.email, mobile, form.referral);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      Cookies.set('userLoginDataArimart', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
      navigate('/home');
    } catch (err) {
      toast.error("Registration failed");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mobile keyboard "Enter" key
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (action) action();
    }
  };

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const ProductGrid = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { emoji: '🍌', bg: 'bg-yellow-100 dark:bg-yellow-900' },
        { emoji: '🥛', bg: 'bg-blue-100 dark:bg-blue-900' },
        { emoji: '🥗', bg: 'bg-green-100 dark:bg-green-900' },
        { emoji: '🍞', bg: 'bg-orange-100 dark:bg-orange-900' },
        { emoji: '☕', bg: 'bg-red-100 dark:bg-red-900' },
        { emoji: '🧊', bg: 'bg-cyan-100 dark:bg-cyan-900' }
      ].map((item, i) => (
        <div key={i} className={`${item.bg} rounded-2xl p-4 aspect-square flex items-center justify-center`}>
          <span className="text-3xl">{item.emoji}</span>
        </div>
      ))}
    </div>
  );

  // const buttonBottomPosition = isNativeApp && isKeyboardVisible 
  //   ? `${keyboardHeight + 20}px` 
  //   : isMobile 
  //     ? '20px' 
  //     : 'auto';

  return (
    <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 md:min-h-screen md:min-h-[600px] md:rounded-2xl md:px-5 relative overflow-hidden">

      {/* Back Button */}
      <button
        onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
        className="absolute top-5 left-5 z-10 p-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
      >
        <ArrowLeft className="w-5 h-5 dark:text-white" />
      </button>

      {isLoading && <LoaderSpinner />}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-full mt-10">
        {/* Left Side - Desktop Only */}
        {!isMobile && (
          <div className="hidden md:block w-1/2 bg-gradient-to-b from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 p-8">
            <div className="text-white">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <h1 className="text-3xl font-bold mb-4">Arimart</h1>
              <DesktopOnboardingSlider />
            </div>
          </div>
        )}

        {/* Right Side - Auth Flow */}
        <div className="md:w-1/2 p-6 md:pb-6 relative">
          {/* Header */}
          <div className="mb-4">
            {step === 2 && (
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  OTP verification
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="pb-5 md:pb-0">
            {isMobile && step === 1 && <OnboardingSlider />}

            <div className="text-center mb-8">
              {/* <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-green-500 dark:bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
               
              </div> */}

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to  <img src={logo} alt="Logo" className="w-40 h-12 object-contain inline-block" />
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 whitespace-pre-line">
                {step === 1 && (isMobile ? 'Log in or sign up' : 'Enter your phone number to get started')}
                {step === 2 && `We've sent a verification code to\n+91 ${mobile.slice(0, 5)}${mobile.slice(5)}`}
                {step === 3 && 'Complete your profile'}
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="space-y-4 max-w-xs mx-auto">
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={mobile}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        onKeyPress={(e) => handleKeyPress(e, async () => {
                          if (isValid) {
                            setIsLoading(true);
                            try {
                              const res = await sendOtp(mobile);
                              if (res?.status === 200 && res.data?.message?.includes("OTP sent")) {
                                handleStepChange(2);
                              } else {
                                toast.error(res.data?.message || "Failed to send OTP. Please try again.");
                              }
                            } catch (err) {
                              console.error("Send OTP Error:", err);
                              const errorMessage =
                                err?.response?.data?.message || "Error sending OTP. Please try again.";
                              toast.error(errorMessage);
                            } finally {
                              setIsLoading(false);
                            }
                          }
                        })}
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-black dark:text-white dark:bg-gray-800 focus:border-green-500 focus:outline-none transition-colors text-lg"
                        placeholder="Enter phone number"
                        maxLength={10}
                        autoComplete="tel"
                      />
                      {isTouched && !isValid && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {mobile.length > 0 ? 'Invalid mobile number' : 'Mobile number required'}
                        </p>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 max-w-xs mx-auto">
                      <div className="flex justify-between space-x-2">
                        {[...Array(6)].map((_, index) => (
                          <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={otp[index] || ''}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleOTPKeyDown(e, index)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && otp.join('').length === 6) {
                                e.preventDefault();
                                // Trigger verify OTP
                                document.querySelector('[data-verify-btn]').click();
                              }
                            }}
                            onPaste={handleOTPPaste}
                            className="w-12 h-16 text-center text-black dark:text-white text-xl font-semibold border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                            autoFocus={index === 0}
                            autoComplete="one-time-code"
                          />
                        ))}
                      </div>

                      {countdown > 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Resend OTP in {countdown}s
                        </p>
                      ) : (
                        <button
                          onClick={handleResendOTP}
                          className="text-green-500 dark:text-green-400 text-sm font-medium hover:underline"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4 max-w-xs mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                          Full Name
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="text"
                          autoComplete="name"
                          onKeyPress={(e) => handleKeyPress(e, () => {
                            if (form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)) {
                              handleContinue();
                            }
                          })}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none transition-colors dark:bg-gray-800 dark:text-white text-lg ${form.fullName.length > 0
                            ? form.fullName.length >= 3
                              ? 'border-green-500 focus:ring-green-200 dark:focus:ring-green-800'
                              : 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500'
                            }`}
                          placeholder="John Doe"
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        />
                        {form.fullName.length > 0 && form.fullName.length < 3 && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Name must be at least 3 characters
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                          Email
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          onKeyPress={(e) => handleKeyPress(e, () => {
                            if (form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)) {
                              handleContinue();
                            }
                          })}
                          className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none transition-colors dark:bg-gray-800 dark:text-white text-lg ${form.email.length > 0
                            ? /^\S+@\S+\.\S+$/.test(form.email)
                              ? 'border-green-500 focus:ring-green-200 dark:focus:ring-green-800'
                              : 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                            : 'border-gray-200 dark:border-gray-700 focus:border-green-500'
                            }`}
                          placeholder="example@mail.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        {form.email.length > 0 && !/^\S+@\S+\.\S+$/.test(form.email) && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Please enter a valid email address
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left">
                          Referral Code (optional)
                        </label>
                        <input
                          type="text"
                          inputMode="text"
                          onKeyPress={(e) => handleKeyPress(e, () => {
                            if (form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)) {
                              handleContinue();
                            }
                          })}
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 focus:outline-none transition-colors dark:bg-gray-800 dark:text-white text-lg"
                          placeholder="Enter referral code if any"
                          value={form.referral}
                          onChange={(e) => setForm({ ...form, referral: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Fixed Action Buttons */}
          <div
            className={`${isMobile ? 'fixed' : 'absolute'} bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700`}
          >
            {step === 1 && (
              <button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const res = await sendOtp(mobile);
                    if (res?.status === 200 && res.data?.message?.includes("OTP sent")) {
                      handleStepChange(2);
                    } else {
                      toast.error(res.data?.message || "Failed to send OTP. Please try again.");
                    }
                  } catch (err) {
                    console.error("Send OTP Error:", err);
                    const errorMessage =
                      err?.response?.data?.message || "Error sending OTP. Please try again.";
                    toast.error(errorMessage);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={!isValid}
                className={`w-full py-4 rounded-2xl font-semibold text-white text-lg transition-all ${isValid
                  ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 active:scale-95'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
              >
                Continue
              </button>
            )}
            {step === 2 && (
              <button
                data-verify-btn
                onClick={async () => {
                  setIsLoading(true);
                  const code = otp.join('');

                  try {
                    const res = await verifyOtp(mobile, code);

                    if (res.data.requiresRegistration) {
                      toast.error("Please complete your registration to continue.");
                      handleStepChange(3);
                    } else {
                      const { token, user } = res.data;
                      localStorage.setItem('token', token);
                      Cookies.set('userLoginDataArimart', JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });

                      navigate('/home');
                    }
                  } catch (err) {
                    const status = err?.response?.status;
                    const message = err?.response?.data?.message || "Invalid or expired OTP";

                    if (status === 404 && message.includes("User not found")) {
                      toast.info("welcome to Arimart, Please Register to continue..");
                      handleStepChange(3);
                    } else {
                      toast.error(message);
                    }

                    console.error("OTP Verification Error:", err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={otp.join('').length < 6}
                className={`w-full py-4 rounded-2xl font-semibold text-white text-lg transition-all ${otp.join('').length === 6
                  ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 active:scale-95'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
              >
                Verify
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleContinue}
                disabled={form.fullName.length < 3 || !/^\S+@\S+\.\S+$/.test(form.email)}
                className={`w-full py-4 rounded-2xl font-semibold text-white text-lg transition-all ${form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)
                  ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 active:scale-95'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
              >
                Complete Registration
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}