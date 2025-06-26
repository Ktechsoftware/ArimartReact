import { motion } from "framer-motion";

export default function DiscountBadge({ price, originalPrice, label }) {
  const discount = Math.round((1 - price / originalPrice) * 100);

  return (
    <div className="absolute top-0 left-[-18px] z-10 w-16 h-16 flex items-start justify-center pointer-events-none">
      {/* Nail */}
      <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-gray-500 z-10 shadow-sm" />
      
      {/* String - swings infinitely */}
      <motion.div
        className="absolute top-0 w-px h-3 bg-gray-400 z-10"
        animate={{
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      />
      
      {/* Coupon Badge - swings with slight delay */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ 
          y: 4, 
          opacity: 1,
          rotateZ: [-3, 2, -3] // subtle swing
        }}
        transition={{
          rotateZ: {
            duration: 2.3,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 0.3
          },
          y: {
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: 0.1
          }
        }}
        className="relative w-10 mt-2 text-white text-[10px] font-bold uppercase bg-gradient-to-b from-red-600 to-red-700 rounded-sm"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        }}
      >
        <div className="py-1.5 px-2 text-center leading-[10px] tracking-tight">
          {label || (
            <>
              <span className="text-xs font-extrabold">{discount}%</span>
              <br />
              <span className="text-[0.65rem]">OFF</span>
            </>
          )}
        </div>
        
        {/* Perforation effect (coupon tear marks) */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-0.5 pb-0.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-px h-1 bg-white bg-opacity-40" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}