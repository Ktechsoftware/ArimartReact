import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Bell,
  Info,
  Lock,
  HelpCircle,
  MessageSquare,
  Contact,
  UserPlus,
  X,
  ChevronRight
} from "lucide-react";

const menuItems = [
  { label: "Home", icon: <Home /> },
  { label: "Notification Options", icon: <Bell /> },
  { label: "About Us", icon: <Info /> },
  { label: "Privacy Policy", icon: <Lock /> },
  { label: "FAQs", icon: <HelpCircle /> },
  { label: "Send Feedback", icon: <MessageSquare /> },
  { label: "Contact Us", icon: <Contact /> },
  { label: "Invite Friends", icon: <UserPlus /> },
];

export default function SidebarMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-[999]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ 
              x: 0,
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            exit={{ 
              x: "-100%",
              transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-[1000]"
          >
            {/* Close Button */}
            <motion.div 
              whileTap={{ scale: 0.9 }}
              className="flex justify-end p-4"
            >
              <button onClick={onClose}>
                <X className="w-6 h-6 text-gray-600 dark:text-white" />
              </button>
            </motion.div>

            {/* Menu List */}
            <div className="flex flex-col gap-2 px-4">
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                    transition: { delay: (menuItems.length - index) * 0.02 }
                  }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="p-2 rounded-md bg-red-100 dark:bg-red-900/30"
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <motion.div whileHover={{ x: 2 }}>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: { delay: menuItems.length * 0.05 + 0.2 }
              }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400"
            >
              v1.0.0
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}