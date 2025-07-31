import { MapPin, Box } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const PickupPage = () => {
  const navigate = useNavigate();
  const handlenavigate = () => {
    navigate('/order/navigate')
  }
  const pickupCenters = [
    {
      name: "Nikhita Stores",
      address: "201/B, Nirant Apts, Andheri East",
      items: [{ name: "Besan Ladoo", weight: "500g", qty: 2 }]
    },
    {
      name: "Ananta Stores",
      address: "204/C, Apts, Andheri East",
      items: [{ name: "Atta Ladoo", weight: "500g", qty: 3 }]
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pickup Items</h2>
      {pickupCenters.map((center, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <MapPin className="text-blue-500 mt-1" />
            <div>
              <p className="font-medium">{center.name}</p>
              <p className="text-sm text-gray-500">{center.address}</p>
            </div>
          </div>
          <ul className="mt-3 pl-2">
            {center.items.map((item, j) => (
              <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                <Box className="w-4 h-4 text-gray-400" />
                {item.qty} × {item.name} ({item.weight})
              </li>
            ))}
          </ul>
          <button onClick={handlenavigate} className="mt-4 w-full py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">
            Mark as Picked
          </button>
        </motion.div>
      ))}
    </div>
  );
};
