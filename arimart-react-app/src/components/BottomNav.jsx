import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  HeartHandshake,
  Compass,
  LayoutList,
  User,
  Search
} from "lucide-react";
import { motion } from 'framer-motion';

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/foryou", label: "For You", icon: HeartHandshake },
  { path: "/explore", label: "Search", icon: Search },
  { path: "/categories", label: "Categories", icon: LayoutList },
  { path: "/account", label: "Account", icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
 <div className="relative w-full max-w-lg px-1 mx-auto">
    <div className="absolute border dark:border-gray-500 inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg shadow-xl" />

    <ul className="relative flex justify-around items-center p-2">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <li
            key={index}
            className="relative flex-1 flex justify-center"
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              to={item.path}
              className="flex flex-col items-center justify-center p-2 z-10"
            >
              {(isActive || hoveredItem === index) && (
                <motion.div
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-green-500/20 dark:bg-green-400/20 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <motion.div
                animate={{
                  color: isActive ? "#ef4444" : "#6b7280",
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-green-500 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-100"
                  }
                  fill={isActive ? "currentColor" : "none"}
                />
              </motion.div>

              <motion.span
                className={`text-xs mt-1 ${
                  isActive
                    ? "text-green-500 dark:text-green-400 font-medium"
                    : "text-gray-500 dark:text-gray-100"
                }`}
                animate={{
                  opacity: isActive ? 1 : 0.8,
                  y: isActive ? 0 : 2,
                }}
              >
                {item.label}
              </motion.span>
            </Link>
          </li>
        );
      })}
    </ul>
  </div>
</nav>

  );
}