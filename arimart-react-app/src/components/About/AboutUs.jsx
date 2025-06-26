import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Users, Leaf, Layers, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import BlogPage from "../Blogs/BlogPage";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("app");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12 text-center"
      >
        <motion.h1 
          className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4"
          whileHover={{ scale: 1.02 }}
        >
          About Arimart
        </motion.h1>
        <p className="max-w-6xl mx-auto text-gray-600 dark:text-gray-300">
          Revolutionizing shopping and agriculture through technology and community
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="flex justify-center gap-4 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
      >
        <motion.button
          onClick={() => setActiveTab("app")}
          className={`px-6 py-2 rounded-full font-medium ${activeTab === "app" ? "bg-green-600 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Our App
        </motion.button>
        <motion.button
          onClick={() => setActiveTab("agriculture")}
          className={`px-6 py-2 rounded-full font-medium ${activeTab === "agriculture" ? "bg-green-600 text-white" : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Agriculture
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === "app" ? (
            <motion.div
              key="app"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div 
                  className="md:w-1/2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <motion.img
                      src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                      alt="Virtual Shopping"
                      className="rounded-2xl shadow-lg"
                      whileHover={{ scale: 1.02 }}
                    />
                    <motion.div
                      className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-700 p-3 rounded-full shadow-lg"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        transition: { repeat: Infinity, duration: 3 }
                      }}
                    >
                      <MessageCircle className="text-green-600 dark:text-green-400" size={24} />
                    </motion.div>
                  </div>
                </motion.div>
                <div className="md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.6 } }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Virtual Shopping Experience</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Arimart offers an interactive and fun 'virtual shopping experience' where you can shop together, chat together 
                      with friends and family just like offline shopping. Enjoy more savings, more fun, and an interactive shopping 
                      experience online.
                    </p>
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.8 } }}
                      >
                        <Users className="text-green-500" />
                        <span>Shop with friends in real-time</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 1.0 } }}
                      >
                        <MessageCircle className="text-green-500" />
                        <span>Integrated chat during shopping</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 1.2 } }}
                      >
                        <ShoppingCart className="text-green-500" />
                        <span>Group discounts and special offers</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="agriculture"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8"
            >
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <motion.div 
                  className="md:w-1/2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.img
                    src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Farmers Market"
                    className="rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  />
                </motion.div>
                <div className="md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.6 } }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Leaf className="text-green-600 dark:text-green-400" size={28} />
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Agricultural Revolution</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Arimart is optimizing the inefficient, multi-layered agricultural supply chain. By eliminating unnecessary 
                      intermediaries, we connect farmers directly with consumers, ensuring better prices for both.
                    </p>
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.8 } }}
                      >
                        <Layers className="text-green-500" />
                        <span>Farmers sell bulk at retail prices</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 1.0 } }}
                      >
                        <Users className="text-green-500" />
                        <span>Group aggregation model for volume</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-3"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 1.2 } }}
                      >
                        <Leaf className="text-green-500" />
                        <span>40% reduction in product wastage</span>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <BlogPage/>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.4 } }}
          className="flex justify-center gap-6 mt-12"
        >
          {[
            { icon: "facebook", name: "Facebook", color: "bg-blue-600" },
            { icon: "instagram", name: "Instagram", color: "bg-pink-600" },
            { icon: "twitter", name: "Twitter", color: "bg-blue-400" },
            { icon: "youtube", name: "YouTube", color: "bg-red-600" }
          ].map((social, index) => (
            <motion.a
              key={social.icon}
              href="#"
              className={`${social.color} text-white p-3 rounded-full shadow-lg`}
              whileHover={{ y: -5, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                transition: { 
                  delay: 1.6 + index * 0.1,
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
        </motion.div>
      </div>
    </div>
  );
}