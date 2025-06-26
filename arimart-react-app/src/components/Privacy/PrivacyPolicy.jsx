import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Shield, Lock, EyeOff, Server } from "lucide-react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: "data-collection",
      title: "Data Collection",
      icon: <Server className="w-5 h-5" />,
      content: "We collect minimal data required to provide our services. This includes basic account information, usage data, and device information to improve your experience."
    },
    {
      id: "data-usage",
      title: "Data Usage",
      icon: <EyeOff className="w-5 h-5" />,
      content: "Your data is used solely to deliver and improve our services. We never sell your data to third parties. Analytics help us understand feature usage and improve performance."
    },
    {
      id: "data-protection",
      title: "Data Protection",
      icon: <Lock className="w-5 h-5" />,
      content: "We implement industry-standard security measures including encryption, access controls, and regular audits. Your data is stored securely in compliance with GDPR regulations."
    },
    {
      id: "user-rights",
      title: "Your Rights",
      icon: <Shield className="w-5 h-5" />,
      content: "You have the right to access, correct, or delete your personal data. You can request data export or account deletion at any time through your account settings."
    }
  ];

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/50">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section) => (
          <motion.div 
            key={section.id}
            layout
            className="overflow-hidden"
          >
            <motion.button
              layout
              onClick={() => toggleSection(section.id)}
              className={`w-full flex items-center justify-between p-5 rounded-xl text-left transition-all ${
                activeSection === section.id 
                  ? 'bg-blue-50 dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
              } shadow-sm border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  activeSection === section.id 
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}>
                  {section.icon}
                </div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">{section.title}</h2>
              </div>
              <motion.div
                animate={{ rotate: activeSection === section.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {activeSection === section.id && (
                <motion.div
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 pt-0 pb-5"
                >
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                    <p className="text-gray-700 dark:text-gray-300">{section.content}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Need more information?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Contact our Data Protection Officer at privacy@example.com for any privacy-related inquiries.</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Contact Support
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyPolicy;