import { motion } from "framer-motion"
import { Bell, User } from "lucide-react"
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"

const Intro = () => {
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="md:hidden flex items-center justify-between mb-2 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm"
    >
      <div>
        <motion.p
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          Hello
        </motion.p>
        <motion.h1
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {isAuthenticated ? (
            <Link to="/account" className="text-md font-medium">
              {userData?.fullName || userData?.username || "User"}
            </Link>
          ) : (
            <Link to="/auth" className="text-md font-medium">
              Guest
            </Link>
          )}
        </motion.h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Icon with Badge */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 bg-blue-100 dark:bg-blue-900 rounded-full"
        >
          <Link to="/notification">
            <Bell className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              3
            </motion.span>
          </Link>
        </motion.div>

        {/* Profile Icon with Online Status */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 bg-purple-100 dark:bg-purple-900 rounded-full"
        >
          <Link to="/account/editprofile">
            <User className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
            />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Intro