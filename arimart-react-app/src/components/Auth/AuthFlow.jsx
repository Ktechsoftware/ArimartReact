import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import LoaderSpinner from "../LoaderSpinner";
import Cookies from 'js-cookie';

export default function AuthFlow() {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [form, setForm] = useState({ fullName: '', email: '', referral: '' });
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
  if (pasteData.length === 4) {
    const newOtp = [...otp];
    for (let i = 0; i < 4; i++) {
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

 const handleContinue = () => {
  setIsLoading(true);

  const userId = `user_${Math.random().toString(36).substr(2, 9)}`;
  const userData = {
    fullName: form.fullName,
    email: form.email,
    userId: userId,
    type: "user",
    username: mobile,
    referral: form.referral || null,
  };

  Cookies.set('userLoginDataArimart', JSON.stringify(userData), {
    expires: 7,
    secure: true,
    sameSite: 'strict'
  });

  setTimeout(() => {
    navigate("/home");
    setIsLoading(false);
  }, 1000);
};

  useEffect(() => {
    if (step === 2 && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  return (
   <div className="min-h-screen flex items-center justify-center px-4 relative">
  <div 
    className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/watercolor-world-vegetarian-day-background_52683-91758.jpg')] 
               bg-cover bg-center bg-no-repeat backdrop-blur-sm"
  >
    <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
  </div>
  {isLoading && <LoaderSpinner />}
  <div className="relative z-10 w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden p-8">
  
        <img src={logo} alt="Onboarding" className="w-full object-cover rounded-lg mb-6" />
        <h2 className="text-2xl dark:text-white text-black font-bold mb-6 text-center">
          {step === 1 && "Verify Mobile Number"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Create Account"}
        </h2>

        {step === 1 && (
          <>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mobile Number
            </label>

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
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Valid mobile number
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
              <div className="mt-4 p-3 mb-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  We'll send an OTP to +91 {mobile}
                </p>
              </div>
            )}
            <button
              onClick={() => handleStepChange(2)}
              disabled={!isValid}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${isValid
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer'
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                }`}
            >
              {isValid ? "Send OTP" : "Next"}
            </button>
          </>
        )}

        {step === 2 && (
          <div className="space-y-4 max-w-xs mx-auto sm:max-w-md">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                OTP sent to <span className="font-semibold text-gray-800 dark:text-white">+91 {mobile}</span>
              </p>
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0}
                className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                4-digit verification code
              </label>
              <div className="flex justify-between gap-2 sm:gap-3">
                {[...Array(4)].map((_, i) => (
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
              onClick={() => handleStepChange(3)}
              disabled={otp.length < 4}
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${otp.length === 4
                  ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800'
                  : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                }`}
            >
              Verify OTP
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
        className={`w-full px-4 py-3 border rounded-lg dark:text-white text-black focus:outline-none focus:ring-2 transition-all ${
          form.fullName.length > 0
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
        className={`w-full px-4 py-3 border dark:text-white text-black rounded-lg focus:outline-none focus:ring-2 transition-all ${
          form.email.length > 0
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
      className={`w-full py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
        form.fullName.length >= 3 && /^\S+@\S+\.\S+$/.test(form.email)
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
      </div>
    </div>
  );
}
