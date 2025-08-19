import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
export const AffiliateBanner = ({ userData }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-6 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-full p-3">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Affiliate Program</h3>
            <p className="text-sm opacity-90">Earn ₹50 for every friend you refer!</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/affiliate')}
          className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
        >
          Join Now
        </motion.button>
      </div>
    </motion.div>
  );
};