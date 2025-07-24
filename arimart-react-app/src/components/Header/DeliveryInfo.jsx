import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function DeliveryInfo() {
  const [address, setAddress] = useState("Detecting location...");
  const [isHoveringCart, setIsHoveringCart] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse Geocode using Nominatim API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const fullAddress = data.display_name || "Address not found";
          setAddress(fullAddress);
        } catch (err) {
          console.error("Geocoding error:", err);
          setAddress("Unable to detect address");
        }
      }, () => {
        setAddress("Location permission denied");
      });
    } else {
      setAddress("Geolocation not supported");
    }
  }, []);

  return (
    <div
      className="hidden md:flex flex-col relative group"
      onMouseEnter={() => setIsHoveringCart(true)}
      onMouseLeave={() => setIsHoveringCart(false)}
    >
      <div className="flex items-center gap-1 cursor-pointer">
        <span className="text-sm font-semibold text-black dark:text-white">Delivery in 22 minutes</span>
        <motion.div
          animate={{ rotate: isHoveringCart ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-[250px]">{address}</span>

      <motion.div
        className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
        initial={{ y: -10, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">{address}</p>
      </motion.div>
    </div>
  );
}
