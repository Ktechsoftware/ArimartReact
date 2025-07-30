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
        <div className="relative w-full h-full flex flex-col">
            {/* Curved background container */}
            <motion.div 
                className="w-full h-96 bg-gradient-to-b from-[#FF6B74] to-[#FC848B] rounded-b-3xl"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl"></div>
                
                {/* Image centered in the colored area */}
                <motion.div 
                    className="absolute top-10 left-1/2 transform -translate-x-1/2"
                    whileHover={{ scale: 1.05 }}
                >
                    <img
                        src="https://png.pngtree.com/png-vector/20210528/ourmid/pngtree-courir-cash-on-delivery-with-customers-png-image_3361008.jpg"
                        alt="Delivery Partner"
                        className="w-96 h-96 object-contain"
                    />
                </motion.div>
            </motion.div>

            {/* Content area */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 px-6 pt-16 pb-6 flex flex-col"
            >
                <div className="text-center mb-8">
                    <h2 className="text-gray-800 text-xl font-semibold mb-1">Be a EatFit Partner</h2>
                    <h1 className="text-2xl font-bold text-black">Get a stable monthly income</h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <motion.div whileTap={{ scale: 0.98 }}>
                        <input
                            type="tel"
                            placeholder="e.g. 9999988888"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md mb-2"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            pattern="[0-9]{10}"
                            required
                        />
                    </motion.div>

                    <label className="text-xs text-gray-600 mb-4 flex items-center justify-center">
                        <motion.div whileTap={{ scale: 0.95 }} className="mr-1">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                                className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                            />
                        </motion.div>
                        I agree to the
                        <span className="text-blue-600 underline ml-1 cursor-pointer">Terms</span> and
                        <span className="text-blue-600 underline ml-1 cursor-pointer">Privacy Policy</span>.
                    </label>

                    <motion.button
                        type="submit"
                        className="w-full bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600"
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
    );
}