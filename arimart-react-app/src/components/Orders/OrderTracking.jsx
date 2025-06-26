import { MapPin, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function OrderTracking() {
  const [showDetails, setShowDetails] = useState(true);
  const [orderCollected, setOrderCollected] = useState(false);

  const deliveryStages = [
    {
      id: 1,
      status: "Order Confirmed",
      time: "12:40 PM",
      active: true,
      completed: true,
      location: "Big Bazaar, Mumbai"
    },
    {
      id: 2,
      status: "Picked Up",
      time: "12:55 PM",
      active: true,
      completed: true,
      location: "Big Bazaar, Andheri East"
    },
    {
      id: 3,
      status: "On the Way",
      time: "1:15 PM",
      active: true,
      completed: false,
      location: "Near Lokhandwala Circle"
    },
    {
      id: 4,
      status: "Delivery",
      time: "Estimated 1:45 PM",
      active: false,
      completed: false,
      location: "Your Location, Andheri West"
    }
  ];

  return (
    <div className="relative h-screen w-full bg-gray-50">
      {/* Map with India focus */}
      <div className="absolute top-0 left-0 w-full bg-blue-50 overflow-hidden">
        <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746984.465708819!2d78.10441925!3d23.1996397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
  width="100%"
  height="600"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
></iframe>
      </div>


      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="absolute dark:bg-gray-900 bottom-0 left-0 mt-[-40px] right-0 bg-white rounded-t-3xl p-6"
      >
        {/* Driver Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="driver"
              className="w-14 h-14 rounded-full border-2 border-orange-400"
            />
            <div>
              <p className="text-lg font-semibold">Rahul Sharma</p>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500">Swiggy Delivery Partner</span>
                <span className="text-xs dark:bg-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">DL 4C AB 1234</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-orange-100 text-orange-500 p-3 rounded-full shadow-sm"
            >
              <Phone size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-100 text-gray-600 p-3 rounded-full shadow-sm"
            >
              <MessageCircle size={18} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div 
            className="flex items-center justify-between mb-3 cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            <h3 className="font-semibold">Delivery Status</h3>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
            >
              <ChevronDown className="text-gray-400" />
            </motion.div>
          </div>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {deliveryStages.map((stage) => (
                  <motion.div 
                    key={stage.id}
                    className="flex gap-4 items-start"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: stage.id * 0.1 }}
                  >
                    <div className="flex flex-col items-center pt-1">
                      <div className={`w-3 h-3 rounded-full ${
                        stage.completed ? "bg-green-500" : 
                        stage.active ? "bg-orange-500 animate-pulse" : "bg-gray-300"
                      }`} />
                      {stage.id < deliveryStages.length && (
                        <div className={`w-0.5 h-8 ${
                          stage.completed ? "bg-green-500" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{stage.status}</p>
                      <p className="text-sm text-gray-500">{stage.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{stage.time}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA Button */}
        <AnimatePresence>
          {!orderCollected ? (
            <motion.div
              className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOrderCollected(true)}
                className="w-full max-w-md mx-auto bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Confirm Delivery</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 to-transparent z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div 
                className="w-full max-w-md mx-auto bg-green-100 text-green-800 py-4 rounded-xl font-semibold text-center shadow-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                Order Delivered Successfully!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Delivery Vehicle Animation */}
      {/* <motion.div
        className="absolute top-1/3 left-1/2 w-12 h-12 z-20"
        animate={{
          x: ["-100%", "-50%", "0%", "50%", "100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/2838/2838694.png" 
          alt="Delivery Bike" 
          className="w-full h-full object-contain"
        />
      </motion.div> */}
    </div>
  );
}