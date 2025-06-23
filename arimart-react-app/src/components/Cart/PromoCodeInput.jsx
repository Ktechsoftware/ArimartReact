import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const PromoCodeInput = () => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isValid, setIsValid] = useState(true);

  const handleApply = () => {
    if (promoCode.trim() === ""){
      toast.error("Enter Promo code..")
      return;
    };
    
    // Simulate validation - replace with your actual validation logic
    const validCodes = ["FRESH50", "ARIMART25", "GROCERY10"];
    const isValidCode = validCodes.includes(promoCode.toUpperCase());
    setIsValid(isValidCode);
    
    if (isValidCode) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: promoCode.toUpperCase() === "FRESH50" ? 50 : 
                 promoCode.toUpperCase() === "ARIMART25" ? 25 : 10
      });
      setPromoCode("");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setIsValid(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Enter Promo Code"
          className={`flex-1 p-3 rounded-l-lg bg-gray-100 dark:bg-gray-700 text-sm border-none focus:ring-2 ${
            !isValid ? "focus:ring-red-400" : "focus:ring-green-400"
          }`}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-3 rounded-r-lg text-sm font-medium"
        >
          Apply
        </motion.button>
      </div>

      {!isValid && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs"
        >
          Invalid promo code. Please try again.
        </motion.p>
      )}

      <AnimatePresence>
        {appliedPromo && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: { type: "spring", stiffness: 300 }
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/40 rounded-lg border border-green-200 dark:border-green-800"
          >
            {/* Confetti effect container */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 overflow-hidden rounded-lg"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                    rotate: Math.random() * 360
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [0, -50],
                    transition: {
                      duration: 1.5,
                      delay: i * 0.05,
                      repeat: 1,
                      repeatDelay: 1
                    }
                  }}
                  className="absolute text-yellow-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <Sparkles size={16} />
                </motion.div>
              ))}
            </motion.div>

            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                  <Check className="text-green-600 dark:text-green-400" size={18} />
                </div>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Promo Applied: {appliedPromo.code}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    {appliedPromo.discount}% discount on your order!
                  </p>
                </div>
              </div>
              <button 
                onClick={removePromo}
                className="p-1 rounded-full hover:bg-green-200/50 dark:hover:bg-green-900/30"
              >
                <X className="text-green-600 dark:text-green-400" size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromoCodeInput;