import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { createNotification } from "../../Store/notificationSlice";

const ConfettiPiece = () => {
  const [position] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100 - 100,
    rotate: Math.random() * 360
  });

  return (
    <motion.div
      initial={{
        x: position.x + 'vw',
        y: -50,
        rotate: position.rotate,
        opacity: 0
      }}
      animate={{
        y: position.y + 150,
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.8]
      }}
      transition={{
        duration: 1.5 + Math.random(),
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeOut"
      }}
      className="absolute w-2 h-2"
      style={{
        backgroundColor: [
          '#f59e0b',
          '#ec4899',
          '#10b981',
          '#3b82f6'
        ][Math.floor(Math.random() * 4)],
        borderRadius: ['50%', '0%'][Math.floor(Math.random() * 2)]
      }}
    />
  );
};

export default function OrderConfirmedModal({userData, isOpen, onClose, trackId }) {
  const dispatch = useDispatch();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const formattedDate = tomorrow.toLocaleDateString('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
dispatch(createNotification({
        userid: userData.id,
        urlt : `/orders/track/${trackId}`,
        title: "Order Placed",
        message: `Your order #${trackId} has been successfully placed.`,
      }));

const randomHour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
const formattedTime = `${randomHour}:00 ${randomHour < 12 ? 'AM' : 'PM'}`;


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { type: 'spring', damping: 10 }
        }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm p-6 relative overflow-hidden"
      >
        {/* Confetti Explosion */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <ConfettiPiece key={i} />
            ))}
          </div>
        )}

        {/* Check Icon with Celebration */}
        <motion.div
          className="flex flex-col items-center text-center mb-6"
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            transition: {
              delay: 0.2,
              type: 'spring',
              stiffness: 500,
              damping: 10
            }
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              transition: {
                duration: 0.6,
                times: [0, 0.5, 1]
              }
            }}
          >
            <CheckCircle className="w-12 h-12 text-yellow-500 mb-2" />
          </motion.div>
          <motion.h2
            className="text-lg font-semibold dark:text-white text-gray-800"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.4 }
            }}
          >
            Order has been placed
          </motion.h2>
        </motion.div>

        

        {/* Order Details */}
        <motion.div
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-inner space-y-2 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.6 }
          }}
        >
          <div className="flex items-center gap-3">
            <motion.img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Recipient"
              className="w-10 h-10 rounded-full"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                transition: { delay: 0.7 }
              }}
            />
            <div className="text-left">
              <p className="text-xs text-gray-400">Recipient</p>
              <p className="text-sm font-medium dark:text-white text-gray-800">{userData?.name}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400">Address</p>
            <p className="text-sm font-medium dark:text-white text-gray-800">{userData?.adddress}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-400">Delivery Date</p>
             <p className="text-sm font-medium dark:text-white text-gray-800">{formattedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Time</p>
              <p className="text-sm font-medium dark:text-white text-gray-800">{formattedTime}</p>
            </div>
          </div>
        </motion.div>
         <p className="text-sm text-gray-500 mt-2">
            Your tracking ID is: <span className="font-semibold">{trackId}</span>
          </p>
        <Link to={`/orders/track/${trackId}`} className="w-full">
          <motion.button
            onClick={onClose}
            className="w-full bg-orange-500 text-white py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.8 }
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Track Order
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}