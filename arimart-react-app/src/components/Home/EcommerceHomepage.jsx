import { motion } from 'framer-motion'
import { ShoppingCart, Star, Heart, Clock, ChevronRight, Zap, Tag } from 'lucide-react'

const EcommerceHomepage = () => {
  // Sample product data
  const featuredProducts = [
    { id: 1, name: 'Wireless Headphones', price: 99.99, rating: 4.5, image: '/headphones.jpg' },
    { id: 2, name: 'Smart Watch', price: 199.99, rating: 4.2, image: '/smartwatch.jpg' },
    // ... more products
  ]

  const categories = [
    { id: 1, name: 'Electronics', icon: <Zap size={24} /> },
    { id: 2, name: 'Fashion', icon: <Tag size={24} /> },
    // ... more categories
  ]

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Categories */}
      <section className="py-12 container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm flex flex-col items-center cursor-pointer"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-3">
                {category.icon}
              </div>
              <h3 className="font-medium dark:text-white">{category.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold dark:text-white">Featured Products</h2>
            <button className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
              View all <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-600"
              >
                <div className="relative h-60 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow"
                  >
                    <Heart className="text-gray-700 dark:text-gray-200" size={18} />
                  </motion.button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium dark:text-white mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 
                          "fill-yellow-400 text-yellow-400" : 
                          "text-gray-300 dark:text-gray-500"}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg dark:text-white">${product.price}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-purple-600 text-white p-2 rounded-full"
                    >
                      <ShoppingCart size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="py-12 container mx-auto px-6">
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="animate-pulse" />
                <span className="font-semibold">Deal of the Day</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Smart Home Bundle</h2>
              <p className="mb-6">Get 40% off on our best-selling smart home products</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">45</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="bg-white/20 p-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">30</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold"
              >
                Shop Now
              </motion.button>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <motion.img
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                src="/smart-home-bundle.png"
                alt="Smart Home Bundle"
                className="h-64 object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EcommerceHomepage