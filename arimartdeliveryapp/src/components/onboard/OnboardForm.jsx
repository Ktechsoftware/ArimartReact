import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardForm() {
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');
    const [checked, setChecked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mobile.length === 10 && checked) {
            navigate('/otp');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Layout (shown by default) */}
            <div className="block md:hidden">
                <div className="relative w-full flex flex-col">
                    {/* Curved background container */}
                    <motion.div 
                        className="w-full h-64 bg-gradient-to-b from-[#FF6B74] to-[#FC848B] rounded-b-3xl"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    >
                        
                        {/* Image centered in the colored area */}
                        <motion.div 
                            className="absolute top-10 left-1/2 transform -translate-x-1/2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src="https://png.pngtree.com/png-vector/20210528/ourmid/pngtree-courir-cash-on-delivery-with-customers-png-image_3361008.jpg"
                                alt="Delivery Partner"
                                className="w-64 h-64 object-contain"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Content area */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex-1 px-6 pt-12 pb-6 flex flex-col"
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-gray-800 text-lg font-semibold mb-1">Be a Arimart Delivery Partner</h2>
                            <h1 className="text-2xl font-bold text-black">Get a stable monthly income</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="w-full">
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <input
                                    type="tel"
                                    placeholder="e.g. 9999988888"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    pattern="[0-9]{10}"
                                    required
                                />
                            </motion.div>

                            <label className="text-xs text-gray-600 mb-4 flex items-center justify-center">
                                <motion.div whileTap={{ scale: 0.95 }} className="mr-2">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => setChecked(!checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                                    />
                                </motion.div>
                                I agree to the
                                <span className="text-blue-600 underline ml-1 cursor-pointer">Terms</span> and
                                <span className="text-blue-600 underline ml-1 cursor-pointer">Privacy Policy</span>
                            </label>

                            <motion.button
                                type="submit"
                                className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 shadow-md"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!checked || mobile.length !== 10}
                                animate={{
                                    opacity: checked && mobile.length === 10 ? 1 : 0.7,
                                }}
                            >
                                Send OTP
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Desktop Layout (Blinkit-style) */}
            <div className="hidden md:flex min-h-screen">
                {/* Left side - Hero image and content */}
                <div className="flex-1 bg-gradient-to-br from-[#FF4D4D] to-[#F97878] flex flex-col justify-center p-12">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-lg mx-auto text-white"
                    >
                        <h1 className="text-4xl font-bold mb-4">Earn up to ₹30,000/month as a delivery partner</h1>
                        <p className="text-xl mb-8">Flexible hours · Weekly payments · Growth opportunities</p>
                        
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p>Work on your own schedule</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p>Earn incentives for top performance</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 bg-white/20 p-2 rounded-full mr-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p>Be part of the fastest growing delivery network</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-12 max-w-md mx-auto"
                    >
                        <img
                            src="https://png.pngtree.com/png-vector/20210528/ourmid/pngtree-courir-cash-on-delivery-with-customers-png-image_3361008.jpg"
                            alt="Delivery Partner"
                            className="w-full h-auto object-contain"
                        />
                    </motion.div>
                </div>

                {/* Right side - Form */}
                <div className="w-1/2 bg-white flex flex-col justify-center p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-gray-600 text-lg font-medium mb-1">Start your journey with Arimart</h2>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF4D4D] to-[#F97878] bg-clip-text text-transparent">
                                Become a Delivery Partner
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                                <motion.div whileTap={{ scale: 0.98 }}>
                                    <input
                                        type="tel"
                                        placeholder="Enter 10-digit mobile number"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none transition-all"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </motion.div>
                            </div>

                            <div className="flex items-start">
                                <motion.div whileTap={{ scale: 0.95 }} className="flex items-center h-5 mt-1">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => setChecked(!checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                                    />
                                </motion.div>
                                <label className="ml-2 block text-sm text-gray-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-red-500 hover:underline font-medium">Terms</a> and{' '}
                                    <a href="#" className="text-red-500 hover:underline font-medium">Privacy Policy</a>
                                </label>
                            </div>

                            <motion.button
                                type="submit"
                                className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition-all
                                    ${checked && mobile.length === 10 ? 
                                        'bg-gradient-to-r from-[#FF4D4D] to-[#F97878] hover:shadow-red-200' : 
                                        'bg-gray-300 cursor-not-allowed'}`}
                                whileHover={checked && mobile.length === 10 ? { scale: 1.02 } : {}}
                                whileTap={checked && mobile.length === 10 ? { scale: 0.98 } : {}}
                                disabled={!checked || mobile.length !== 10}
                            >
                                Send OTP
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>Already registered? <a href="#" className="text-red-500 font-medium">Login here</a></p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}