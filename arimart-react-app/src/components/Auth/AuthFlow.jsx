import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import LoaderSpinner from "../LoaderSpinner";
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";
import { sendOtp, verifyOtp, registerUser } from '../../api/auth'
import toast from 'react-hot-toast';

export default function AuthFlow() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [form, setForm] = useState({ fullName: '', email: '', referral: '' });
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const navigate = useNavigate()
  const validateIndianMobile = (number) => {
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(number);
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobile(value);
    setIsValid(validateIndianMobile(value));
  };

  const handleBlur = () => {
    setIsTouched(true);
  };
  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 7) {
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
      document.getElementById('otp-input-6').focus();
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
      const res = await registerUser(form.fullName, form.email, mobile);
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

  const bagRef = useRef(null);
  const [bagTilt, setBagTilt] = useState({ x: 0, y: 0 });
  const [bagHover, setBagHover] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 z-50 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 shadow-md backdrop-blur-sm transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <motion.div
        className="absolute inset-0 bg-[url('https://png.pngtree.com/thumb_back/fh260/background/20240327/pngtree-supermarket-aisle-with-empty-shopping-cart-at-grocery-store-retail-business-image_15646095.jpg')] 
             bg-cover bg-top md:bg-center bg-no-repeat"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      </motion.div>

      {isLoading && <LoaderSpinner />}

      {/* Shopping Bag Container with 3D effects */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Bag Handle with physics-based animation */}
        <motion.div
          className="relative mx-auto w-24 h-8 mb-1"
          transition={{ type: "spring", damping: 10, stiffness: 300 }}
        >
          <motion.div
            className="absolute left-0 w-8 h-10 bg-green-300 dark:bg-green-600 rounded-t-full"
            style={{
              transform: `rotateX(${bagTilt.x}deg) rotateY(${bagTilt.y}deg)`,
              boxShadow: "inset 0 -5px 10px rgba(0,0,0,0.1)"
            }}
          />
          <motion.div
            className="absolute right-0 w-8 h-10 bg-green-300 dark:bg-green-600 rounded-t-full"
            style={{
              transform: `rotateX(${bagTilt.x}deg) rotateY(${bagTilt.y}deg)`,
              boxShadow: "inset 0 -5px 10px rgba(0,0,0,0.1)"
            }}
          />
        </motion.div>

        {/* Bag Body with 3D tilt and depth */}
        <motion.div
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl rounded-t-[1.5rem] border-4 border-green-300 dark:border-green-600 
          shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] px-6 py-8 sm:px-8 sm:py-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transform: `rotateX(${bagTilt.x}deg) rotateY(${bagTilt.y}deg)`
          }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 20px 50px -15px rgba(0,0,0,0.3)"
          }}
        >
          {/* Logo with floating animation */}
          <motion.div
            className="flex justify-center -mt-14 mb-4"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.img
              src={logo}
              alt="Logo"
              className="w-24 h-24 object-contain rounded-full border-4 border-green-300 dark:border-green-600 bg-white dark:bg-gray-800 shadow-md"
              whileHover={{ scale: 1.05 }}
            />
          </motion.div>

          {/* Stitching with subtle animation */}
          <motion.div
            className="flex justify-center mb-6"
            animate={{ scaleX: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="h-1 w-16 bg-green-300 dark:bg-green-600 rounded-full"></div>
          </motion.div>

          {/* Form content with staggered animations */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl dark:text-white text-black font-bold mb-4 text-center">
                {step === 1 && "Login or Sign Up"}
                {step === 2 && "Enter OTP"}
                {step === 3 && "Create Account"}
              </h2>

              {step === 1 && (
                <>
                  <p className="text-sm p-1 mb-2 text-gray-600 dark:text-gray-200">We will send you a 4-digit confirmation code to verify phone number.</p>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Number
                  </label>

                  {isLocalhost && (
                    <div className="text-center text-sm text-green-600 dark:text-green-400">
                      Demo Logined Mobile Number is <strong>8799690044</strong>
                    </div>
                  )}


                  <div className="relative mb-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400">+91</span>
                    </div>
                    <input
                      type="tel"
                      id="mobile"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${isTouched
                        ? isValid
                          ? 'border-green-500 focus:ring-green-200 dark:focus:ring-green-800'
                          : 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-800'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="9876543210"
                      maxLength="10"
                      value={mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  {isTouched && (
                    <p className={`mt-2 mb-1 text-sm flex items-center ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                      {isValid ? (
                        <>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {mobile.length > 0 ? 'Invalid mobile number' : 'Mobile number required'}
                        </>
                      )}
                    </p>
                  )}

                  {isValid && (
                    <div className="mt-4 p-2 mb-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                        We'll send an code to +91 {mobile}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const res = await sendOtp(mobile);

                        // ✅ success based on response
                        if (res?.status === 200 && res.data?.message?.includes("OTP sent")) {
                          handleStepChange(2);
                        } else {
                          alert(res.data?.message || "Failed to send OTP. Please try again.");
                        }
                      } catch (err) {
                        console.error("Send OTP Error:", err);
                        const errorMessage =
                          err?.response?.data?.message || "Error sending OTP. Please try again.";
                        alert(errorMessage);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={!isValid}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${isValid
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 cursor-pointer'
                      : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      }`}
                  >
                    {isValid ? "Get the code" : "Countinue"}
                  </button>
                </>
              )}

              {step === 2 && (
                <div className="space-y-4 max-w-xs mx-auto sm:max-w-md">
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-1">
                      Code sent to <span className="font-semibold text-gray-800 dark:text-white">+91 {mobile}</span>
                    </p>
                    <button
                      onClick={handleResendOTP}
                      disabled={countdown > 0}
                      className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}
                    >
                      {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend OTP'}

                      {isLocalhost && (
                        <div className="text-center text-sm text-green-600 dark:text-green-400">
                          Mock OTP is <strong>123456</strong>
                        </div>
                      )}

                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      6-digit verification code
                    </label>
                    <div className="flex justify-between gap-2 sm:gap-3">
                      {[...Array(6)].map((_, i) => (
                        <input
                          key={i}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={otp[i] || ''}
                          onChange={(e) => handleOTPChange(e, i)}
                          onKeyDown={(e) => handleOTPKeyDown(e, i)}
                          onPaste={handleOTPPaste}
                          className="flex-1 aspect-square max-w-[50px] sm:max-w-none sm:w-12 h-12 sm:h-14 text-center dark:text-white text-black text-xl sm:text-2xl 
                 border border-gray-300 dark:border-gray-600 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 bg-white dark:bg-gray-700"
                          autoFocus={i === 0}
                          id={`otp-input-${i}`}
                        />
                      ))}
                    </div>
                  </div>

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
                          toast.error("User not found. Redirecting to registration.");
                          handleStepChange(3);
                        } else {
                          toast.error(message);
                        }

                        console.error("OTP Verification Error:", err);
                      }
                      finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={otp.length < 6}
                    className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${otp.length === 6
                      ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                      : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      }`}
                  >
                    Verify Code
                  </button>

                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {otp.length === 4 ? (
                      <span className="flex items-center justify-center text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ready to verify
                      </span>
                    ) : (
                      `Enter all 4 digits to continue`
                    )}
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full px-4 py-3 border rounded-lg dark:text-white text-black focus:outline-none focus:ring-2 transition-all ${form.fullName.length > 0
                        ? form.fullName.length >= 3
                          ? 'border-green-500 focus:ring-green-200 dark:focus:ring-green-800'
                          : 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-800'
                        } bg-white dark:bg-gray-700`}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className={`w-full px-4 py-3 border dark:text-white text-black rounded-lg focus:outline-none focus:ring-2 transition-all ${form.email.length > 0
                        ? /^\S+@\S+\.\S+$/.test(form.email)
                          ? 'border-green-500 focus:ring-green-200 dark:focus:ring-green-800'
                          : 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-800'
                        } bg-white dark:bg-gray-700`}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Referral Code (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border dark:text-white text-black border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-700"
                      placeholder="Enter referral code if any"
                      value={form.referral}
                      onChange={(e) => setForm({ ...form, referral: e.target.value })}
                    />
                  </div>

                  <button
                    onClick={handleContinue}
                    disabled={form.fullName.length < 3 || !/^\S+@\S+\.\S+$/.test(form.email)}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800'
                      : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      }`}
                  >
                    Continue
                  </button>

                  {!(form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)) && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Please complete all required fields correctly to continue
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}