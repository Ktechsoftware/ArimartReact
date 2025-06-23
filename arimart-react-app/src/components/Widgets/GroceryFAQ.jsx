import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ShoppingBag, Truck, RefreshCw, Shield, CreditCard, Phone, HelpCircle } from "lucide-react";

const GroceryFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What are your delivery hours?",
      answer: "We deliver daily from 8:00 AM to 10:00 PM. Same-day delivery available for orders placed before 6:00 PM.",
      icon: <Truck className="w-5 h-5" />,
      category: "delivery"
    },
    {
      question: "How do I return a grocery item?",
      answer: "Unopened, non-perishable items can be returned within 7 days with receipt. Fresh produce and perishables can only be returned if damaged or spoiled.",
      icon: <RefreshCw className="w-5 h-5" />,
      category: "returns"
    },
    {
      question: "Are your products organic?",
      answer: "We offer both organic and conventional options. Look for the 'Organic' badge on product pages. All organic products are certified by USDA standards.",
      icon: <Shield className="w-5 h-5" />,
      category: "products"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, Arimart Wallet, UPI, and cash on delivery. Contactless payments recommended for safety.",
      icon: <CreditCard className="w-5 h-5" />,
      category: "payments"
    },
    {
      question: "How do I track my order?",
      answer: "You'll receive SMS and app notifications with live tracking. You can also check order status in 'My Orders' section with estimated delivery time.",
      icon: <ShoppingBag className="w-5 h-5" />,
      category: "orders"
    },
    {
      question: "Do you price match competitors?",
      answer: "Yes! If you find a lower price at any local grocery store, contact us within 24 hours of purchase with proof for price adjustment.",
      icon: <HelpCircle className="w-5 h-5" />,
      category: "pricing"
    }
  ];

  const categories = [
    { id: "all", name: "All Questions", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "delivery", name: "Delivery", icon: <Truck className="w-4 h-4" /> },
    { id: "products", name: "Products", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "payments", name: "Payments", icon: <CreditCard className="w-4 h-4" /> }
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredFaqs = activeCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 sm:p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/50">
          <HelpCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Arimart Help Center</h1>
        <p className="text-gray-600 dark:text-gray-300">Find answers to common questions about Arimart groceries</p>
      </motion.div>

      {/* Category Filters */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-8 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.icon}
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <motion.div 
            key={index}
            layout
            className="overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <motion.button
              layout
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className={`w-full flex items-start gap-4 p-5 rounded-xl text-left transition-all ${
                activeIndex === index 
                  ? 'bg-green-50 dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
              } shadow-sm border border-gray-200 dark:border-gray-700`}
            >
              <div className={`p-2 rounded-lg ${
                activeIndex === index 
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}>
                {faq.icon}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">{faq.question}</h2>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-gray-600 dark:text-gray-300 mt-2"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                className="text-gray-500 dark:text-gray-400"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Support Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 p-6 bg-green-50 dark:bg-gray-800 rounded-xl border border-green-200 dark:border-gray-700"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
            <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Still need help?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-0">Our arimart support team is available 7AM-11PM daily</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium whitespace-nowrap"
          >
            Contact Support
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GroceryFAQ;