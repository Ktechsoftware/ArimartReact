import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  MapPin,
  Package,
  User,
  Plus,
  X,
  QrCode,
  Wallet,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const BottomNavigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Package, label: 'Orders', path: '/orders' },
    { icon: MapPin, label: 'Map', path: '/order/navigate' },
    { icon: User, label: 'Profile', path: '/account' }
  ];

  const getActiveIndex = () => {
    return navItems.findIndex((item) => location.pathname.startsWith(item.path));
  };

  const activeIndex = getActiveIndex();

  const handleNavigate = (path) => {
  navigate(path);
  setIsExpanded(false);
};

const expandedOptions = [
  {
    icon: QrCode,
    label: 'Scan',
    color: 'bg-blue-500',
    delay: 0.1,
    onClick: () => handleNavigate('/order/scan')
  },
  {
    icon: Wallet,
    label: 'Wallet',
    color: 'bg-green-500',
    delay: 0.2,
    onClick: () => handleNavigate('/wallet')
  },
  {
    icon: HelpCircle,
    label: 'Help',
    color: 'bg-purple-500',
    delay: 0.3,
    onClick: () => {
      alert('Help clicked');
      setIsExpanded(false); // also close after alert
    }
  }
];


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl">
      {/* Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Arc expanded buttons */}
      <AnimatePresence>
        {isExpanded && (
          <div className="absolute gap-4 left-1/2 transform -translate-x-1/2 bottom-20 z-50">
            {expandedOptions.map((option, index) => {
              const angles = [-60, 0, 60];
              const angle = angles[index];
              const radius = 70;
              const x = Math.sin((angle * Math.PI) / 180) * radius;
              const y = -Math.abs(Math.cos((angle * Math.PI) / 180)) * radius - 20;

              return (
                <motion.div
                  key={option.label}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, x, y }}
                  exit={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: option.delay,
                    type: 'spring',
                    stiffness: 150,
                    damping: 12
                  }}
                  className="absolute left-1/2 top-0 transform -translate-x-1/2"
                >
                  <div className="flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={option.onClick}
                      className={`w-14 h-14 ${option.color} rounded-full flex items-center justify-center shadow-xl`}
                    >
                      <option.icon className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <div className="relative flex items-center justify-around px-1 py-3 z-30">
        {/* Left Items */}
        <div className="flex space-x-8">
          {navItems.slice(0, 2).map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center space-y-1 ${
                location.pathname.startsWith(item.path)
                  ? 'text-blue-500'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Center Add Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleExpanded}
          className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-40"
        >
          <motion.div
            animate={{
              rotate: isExpanded ? 45 : 0,
              scale: isExpanded ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                >
                  <X className="w-7 h-7 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                >
                  <Plus className="w-7 h-7 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>

        {/* Right Items */}
        <div className="flex space-x-8">
          {navItems.slice(2).map((item) => (
            <motion.button
              key={item.label}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center space-y-1 ${
                location.pathname.startsWith(item.path)
                  ? 'text-blue-500'
                  : 'text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>

        {/* 🔵 Active Tab Indicator */}
        <motion.div
          className="absolute top-0 w-12 h-1 bg-blue-500 rounded-full"
          animate={{
            left: `${activeIndex * 25 + 2}%`
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
};
