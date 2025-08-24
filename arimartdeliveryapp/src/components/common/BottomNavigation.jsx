import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MapPin, Package, User, QrCode, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Package, label: 'Orders', path: '/orders' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: User, label: 'Profile', path: '/account' }
  ];

  const activeIndex = navItems.findIndex((item) =>
    location.pathname.startsWith(item.path)
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl">
      {/* Bottom Nav */}
      <div className="relative flex items-center justify-around px-1 py-3 z-30">
        {/* Left Items */}
        <div className="flex space-x-8">
          {navItems.slice(0, 2).map((item) => (
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

        {/* Center Scan Button (replaces Add) */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/order/scan')}
          className="absolute left-1/2 transform -translate-x-1/2 -top-6 z-40"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <QrCode className="w-7 h-7 text-white" />
          </div>
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
