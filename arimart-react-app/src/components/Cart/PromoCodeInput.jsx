import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, X, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { applyPromoCode, clearPromoState } from "../../Store/promocodeSlice";

const PromoCodeInput = ({ subtotal = 0 }) => {
  const dispatch = useDispatch();
  const { applyResult: appliedPromo, loading: promoLoading, error } = useSelector(state => state.promocode);
  const userData = useSelector(state => state.auth.userData);

  const [promoCode, setPromoCode] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (error) {
      setIsValid(false);
    }
  }, [error]);

  const handleApply = async () => {
    if (promoCode.trim() === "") {
      toast.error("Enter Promo code..");
      return;
    }
    console.log(promoCode, userData?.id, subtotal)
    setIsValid(true);

    try {
      const result = await dispatch(applyPromoCode({
        code: promoCode.toUpperCase(),
        userId: userData?.id,
        orderAmount: subtotal
      })).unwrap();

      setPromoCode("");
      toast.success(`Promo code applied! You saved ₹${result.discount}`);
    } catch (error) {
      console.error("Promo code application failed:", error);
      setIsValid(false);
    }
  };

  const removePromo = () => {
    dispatch(clearPromoState());
    setIsValid(true);
    toast.success("Promo code removed");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="flex">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Promo Code"
          disabled={promoLoading || appliedPromo}
          className={`flex-1 p-3 rounded-l-lg bg-gray-100 dark:bg-gray-700 text-sm border-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${!isValid ? "focus:ring-red-400" : "focus:ring-green-400"
            }`}
        />
        <motion.button
          whileHover={{ scale: appliedPromo ? 1 : 1.02 }}
          whileTap={{ scale: appliedPromo ? 1 : 0.98 }}
          onClick={handleApply}
          disabled={promoLoading || appliedPromo}
          className={`px-4 py-3 rounded-r-lg text-sm font-medium transition-colors ${appliedPromo
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-black dark:bg-white text-white dark:text-black'
            }`}
        >
          {appliedPromo ? "Applied" : "Apply"}
        </motion.button>
      </div>

      {!isValid && error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs"
        >
          {typeof error === 'string' ? error : 'Promo code could not be applied.'}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none"
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
                    ₹{appliedPromo.discount} discount on your order!
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
