import { motion } from "framer-motion";
import { ChevronRight, LocateFixedIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserAddresses } from "../../Store/addressSlice";
import { useEffect } from "react";

export function DeliveryInfo() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userData?.id);
    const {
      addresses,
      loading
    } = useSelector((state) => state.shipping);
console.log(addresses)
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserAddresses(userId));
    }
  }, [userId, dispatch]);

  const preferredAddress =
    addresses.find(addr => addr.adType === "Home") || addresses[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-1"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="md:hidden flex items-center justify-between p-1 rounded-lg cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 shadow-sm"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <span className="text-blue-600 dark:text-blue-400 text-lg">
            <LocateFixedIcon />
          </span>

          {preferredAddress ? (
            <span className="text-xs text-gray-700 dark:text-gray-200 line-clamp-2 single-line-ellipsis">
             Delivery to {preferredAddress.adName} at 
              {preferredAddress.adCity ? ` ${preferredAddress.adCity}` : ""}
              {preferredAddress.adState ? `, ${preferredAddress.adState}` : ""}
              {preferredAddress.adPincode ? ` - ${preferredAddress.adPincode}` : ""}
            </span>
          ) : (
            <Link to="/account" className="text-sm text-blue-600 hover:underline">
              Add delivery location to check extra discount
            </Link>
          )}
        </div>

        <motion.div
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <ChevronRight
            size={18}
            className="text-blue-500 dark:text-blue-400"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
