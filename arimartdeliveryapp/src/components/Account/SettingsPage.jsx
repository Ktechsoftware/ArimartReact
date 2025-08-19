import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Bell, 
  MapPin, 
  Globe, 
  Moon, 
  Volume2, 
  Smartphone,
  CreditCard,
  Shield,
  HelpCircle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  SettingsIcon
} from "lucide-react";
import { useState } from "react";

export const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const settingSections = [
    {
      title: "Account",
      items: [
        { icon: <User size={20} />, label: "Profile Information", route: "/profile", hasArrow: true },
        { icon: <CreditCard size={20} />, label: "Payment Details", route: "/payment", hasArrow: true },
      ]
    },
    {
      title: "Preferences",
      items: [
        { 
          icon: <Bell size={20} />, 
          label: "Push Notifications", 
          toggle: true,
          value: notifications,
          onChange: setNotifications
        },
        { 
          icon: <MapPin size={20} />, 
          label: "Location Access", 
          toggle: true,
          value: locationAccess,
          onChange: setLocationAccess
        },
        { 
          icon: <Volume2 size={20} />, 
          label: "Sound & Vibration", 
          toggle: true,
          value: soundEnabled,
          onChange: setSoundEnabled
        },
        { icon: <Globe size={20} />, label: "Language", route: "/language", hasArrow: true, value: "English" },
        { 
          icon: <Moon size={20} />, 
          label: "Dark Mode", 
          toggle: true,
          value: darkMode,
          onChange: setDarkMode
        },
      ]
    },
    {
      title: "Work Settings",
      items: [
        { icon: <MapPin size={20} />, label: "Delivery Area", route: "/delivery-area", hasArrow: true },
        { icon: <Smartphone size={20} />, label: "Vehicle Details", route: "/vehicle", hasArrow: true },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: <HelpCircle size={20} />, label: "Help Center", route: "/help", hasArrow: true },
        { icon: <Shield size={20} />, label: "Privacy & Security", route: "/privacy", hasArrow: true },
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto bg-gray-50 min-h-screen"
    >
      {/* Header */}
      <motion.div
        className="bg-white sticky top-16 px-4 py-4 flex items-center shadow-sm"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center gap-2"><SettingsIcon/>
        <h1 className="text-lg font-semibold text-gray-800">Settings</h1></div>
      </motion.div>

      {/* Settings Content */}
      <div className="p-4 space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="space-y-3"
          >
            {/* Section Title */}
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-2">
              {section.title}
            </h2>
            
            {/* Section Items */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  className={`flex items-center justify-between p-4 ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <div className="text-blue-600">{item.icon}</div>
                    </div>
                    <div>
                      <span className="text-gray-800 font-medium">{item.label}</span>
                      {item.value && !item.toggle && (
                        <p className="text-sm text-gray-500">{item.value}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {item.toggle ? (
                      <button
                        onClick={() => item.onChange(!item.value)}
                        className="focus:outline-none"
                      >
                        {item.value ? (
                          <ToggleRight size={24} className="text-blue-500" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-300" />
                        )}
                      </button>
                    ) : item.hasArrow ? (
                      <ChevronRight size={18} className="text-gray-400" />
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* App Version */}
      <motion.div
        className="p-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-gray-500">App Version 2.1.0</p>
      </motion.div>
    </motion.div>
  );
};