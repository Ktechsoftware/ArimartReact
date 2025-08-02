import { motion } from 'framer-motion';
import { ArrowLeftCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OtpForm() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);

    const handleChange = (index, value) => {
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleVerify = () => {
        if (otp.every(digit => digit !== '')) {
            alert('OTP Verified!');
            navigate('/info')
        }
    };

    const handleResendOTP = () => {
        if (resendDisabled) return;

        // Start resend timer
        setResendDisabled(true);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setResendDisabled(false);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        alert('New OTP has been sent!');
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace") {
            if (otp[index] === "") {
                if (index > 0) {
                    const newOtp = [...otp];
                    newOtp[index - 1] = '';
                    setOtp(newOtp);
                    document.getElementById(`otp-${index - 1}`).focus();
                }
            } else {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };


    return (
        <div className="min-h-screen md:flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md p-6 bg-white rounded-xl"
            >
                <motion.button
                    onClick={() => navigate('/')}
                    className="text-xl mb-4"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowLeftCircle />
                </motion.button>

                <motion.h1
                    className="text-2xl font-bold mb-2"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                >
                    Enter OTP to verify
                </motion.h1>

                <motion.p
                    className="text-gray-700 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    A 6 digit OTP has been sent to your phone number <strong>+91 9999988888</strong>
                    <span
                        className="text-blue-600 underline ml-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        Change
                    </span>
                </motion.p>

                <motion.div
                    className="flex justify-between gap-2 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {otp.map((digit, index) => (
                        <motion.input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-12 border border-gray-300 rounded-md text-center text-lg focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            whileFocus={{ scale: 1.05 }}
                        />

                    ))}
                </motion.div>

                <div className="text-center mb-6">
                    <motion.p
                        className="text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Didn't receive code?{' '}
                        <span
                            className={`cursor-pointer ${resendDisabled ? 'text-gray-400' : 'text-blue-600 underline'}`}
                            onClick={handleResendOTP}
                        >
                            {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                        </span>
                    </motion.p>
                </div>

                <motion.button
                    onClick={handleVerify}
                    className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!otp.every(digit => digit !== '')}
                    animate={{
                        opacity: otp.every(digit => digit !== '') ? 1 : 0.7,
                    }}
                >
                    Verify OTP
                </motion.button>
            </motion.div>
        </div>
    );
}