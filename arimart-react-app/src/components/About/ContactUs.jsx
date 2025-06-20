import { motion } from "framer-motion";
import { Phone, Mail, MessageSquare, Headphones, ArrowRight } from "lucide-react";

export default function ContactUs() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Contact Arimart
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            If you face any trouble with item ordering, feel free to contact us.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Phone Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="p-3 bg-green-100 dark:bg-gray-700 rounded-full"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <Phone className="text-green-600 dark:text-green-400" size={24} />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Call Us</h3>
            </div>
            <motion.a
              href="tel:+919341110535"
              className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
              whileHover={{ x: 5 }}
            >
              +91 9341110535
            </motion.a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Available 9:00 AM - 8:00 PM, Monday to Saturday
            </p>
          </motion.div>

          {/* Email Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-green-100 dark:border-gray-700"
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div 
                className="p-3 bg-green-100 dark:bg-gray-700 rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Mail className="text-green-600 dark:text-green-400" size={24} />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Email Us</h3>
            </div>
            <motion.a
              href="mailto:customersupport@arimart.in"
              className="text-lg text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
              whileHover={{ x: 5 }}
            >
              customersupport@arimart.in
            </motion.a>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Typically respond within 24 hours
            </p>
          </motion.div>
        </div>

        {/* Live Chat */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-12"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 bg-green-50 dark:bg-gray-700">
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 1.0 } }}
              >
                <MessageSquare className="text-green-600 dark:text-green-400" size={28} />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Live Chat Support</h2>
              </motion.div>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.2 } }}
              >
                Get instant help from our friendly support team through our in-app chat.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.4 } }}
              >
                Open Chat <ArrowRight size={18} />
              </motion.button>
            </div>
            <div className="md:w-1/2 p-8">
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ x: 20 }}
                animate={{ x: 0, transition: { delay: 1.0 } }}
              >
                <Headphones className="text-green-600 dark:text-green-400" size={28} />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Help Center</h2>
              </motion.div>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.2 } }}
              >
                Browse our comprehensive help articles and FAQs for quick solutions.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.4 } }}
              >
                Visit Help Center <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.6 } }}
          className="text-center"
        >
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
            Connect with us on social media
          </h3>
          <div className="flex justify-center gap-4">
            {[
              { icon: "facebook", name: "Facebook" },
              { icon: "instagram", name: "Instagram" },
              { icon: "twitter", name: "Twitter" },
              { icon: "youtube", name: "YouTube" }
            ].map((social, index) => (
              <motion.a
                key={social.icon}
                href="#"
                className="bg-white dark:bg-gray-700 p-3 rounded-full shadow-md text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  transition: { 
                    delay: 1.8 + index * 0.1,
                    type: "spring",
                    stiffness: 300
                  }
                }}
              >
                <span className="sr-only">{social.name}</span>
                <span className="block w-6 h-6">
                  {social.icon === "facebook" && "f"}
                  {social.icon === "instagram" && "ig"}
                  {social.icon === "twitter" && "t"}
                  {social.icon === "youtube" && "yt"}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}