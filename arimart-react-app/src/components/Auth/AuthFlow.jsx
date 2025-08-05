import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import LoaderSpinner from "../LoaderSpinner";
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp, registerUser } from '../../api/auth'
import toast from 'react-hot-toast';
import { Phone, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

export default function AuthFlow() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [form, setForm] = useState({ fullName: '', email: '', referral: '' });
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referCode = params.get('refercode');
    if (referCode) {
      setForm(prev => ({ ...prev, referral: referCode }));
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

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 min-h-screen md:min-h-[600px] md:rounded-2xl md:shadow-xl dark:md:shadow-gray-800/30 md:px-5 relative overflow-hidden">

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
              <h1 className="text-3xl font-bold mb-4">Arimart Retail Shopping App</h1>
              <p className="text-green-100 dark:text-green-200 mb-8">Experience lightning fast shopping</p>
              <ProductGrid />
            </div>
          </div>
        )}

        {/* Right Side - Auth Flow */}
        <div className="md:w-1/2 p-6 pb-20 md:pb-6 relative">
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
          <div className="pb-20 md:pb-0">
            {isMobile && step === 1 && <ProductGrid />}

            <div className="text-center mb-8">
              <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-green-500 dark:bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isMobile ? "Arimart Retail Shopping app" : "Welcome to AriMart"}
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
                        value={mobile}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-black dark:text-white dark:bg-gray-800 focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="Enter phone number"
                        maxLength={10}
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
                      <div className="flex justify-between space-x-3">
                        {[...Array(6)].map((_, index) => (
                          <input
                            key={index}
                            id={`otp-input-${index}`}
                            type="text"
                            maxLength={1}
                            value={otp[index] || ''}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleOTPKeyDown(e, index)}
                            onPaste={handleOTPPaste}
                            className="w-12 h-14 text-center text-black dark:text-white text-xl font-semibold border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                            autoFocus={index === 0}
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
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:bg-gray-800 dark:text-white ${form.fullName.length > 0
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
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors dark:bg-gray-800 dark:text-white ${form.email.length > 0
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
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-green-500 focus:outline-none transition-colors dark:bg-gray-800 dark:text-white"
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

          {/* Action Buttons */}
          <div className="mt-8">
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
                className={`w-full py-3 rounded-2xl font-semibold text-white transition-all ${isValid
                    ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 active:scale-95'
                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  }`}
              >
                Continue
              </button>
            )}
            {step === 2 && (
              <button
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
                className={`w-full py-3 rounded-2xl font-semibold text-white transition-all ${otp.join('').length === 6
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
                className={`w-full py-3 rounded-2xl font-semibold text-white transition-all ${form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)
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