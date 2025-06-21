import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Heart, Star, Plus, Minus, ShoppingCart } from "lucide-react";
import ProductCard from "./ProductCard";
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [userRating, setUserRating] = useState(0);
const handleWishlist = () => {
  const newState = !isFavorite;
  setIsFavorite(newState);
  toast.success(newState ? "Added to wishlist" : "Removed from wishlist");
};
const handleaddtocart = () => {
  toast.success("Added to cart");
};


  const product = {
    name: "Beef Mixed Cut Bone",
    description:
      "Premium quality beef mixed cuts with bone for rich flavor. Perfect for stews, curries, and grilling. Sourced from grass-fed cattle raised in organic farms.",
    price: 23.46,
    weight: "50 gm",
    packageWeight: "1000 gm",
    rating: 4.5,
    ratingCount: 128,
    delivery: "Available on fast delivery",
    colors: ["bg-red-400", "bg-blue-500", "bg-yellow-500"],
    images: [
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVlZnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
    ],
    reviews: [
      {
        id: 1,
        name: "Rahul Sharma",
        rating: 5,
        date: "2 days ago",
        comment: "Excellent quality meat! Very fresh and tender. Will definitely order again."
      },
      {
        id: 2,
        name: "Priya Patel",
        rating: 4,
        date: "1 week ago",
        comment: "Good quality but delivery was delayed by a day. Taste was great though."
      },
      {
        id: 3,
        name: "Amit Singh",
        rating: 5,
        date: "2 weeks ago",
        comment: "Perfect for my biryani recipe. The cuts were exactly as described."
      }
    ]
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen pb-24"
    >
      <div className="max-w-6xl mx-auto lg:flex lg:items-start lg:gap-8 px-2 lg:px-6">
  {/* Sticky Wrapper for Image on Large Screens */}
  <div className="lg:sticky lg:top-20 lg:flex-1">
        <div className="relative h-64 w-full overflow-hidden rounded-xl lg:h-[450px] lg:flex-1">
          <motion.button
  whileTap={{ scale: 0.9 }}
  onClick={handleWishlist}
  className={`absolute top-4 right-4 z-10 p-2 rounded-full ${
    isFavorite
      ? "bg-red-100 text-red-500 shadow-lg"
      : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 shadow-lg"
  }`}
>
  <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} />
</motion.button>

          <div className="absolute top-4 left-4 z-10 flex items-center gap-1 text-sm bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full shadow-lg">
            <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" />
            <span>{product.rating}</span>
          </div>

          <AnimatePresence>
            <motion.img
              key={product.images[0]}
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {product.images.map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
</div>
        {/* Right: Product Info */}
        <div className="lg:flex-1 mt-4 lg:mt-0">
          <div className="p-2 lg:p-0">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.weight} (Pack of {product.packageWeight})</p>

              <div className="flex items-center justify-between my-3">
                <div className="flex items-end">
                  <span className="text-3xl font-bold text-green-600">₹{product.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 ml-1 line-through">₹{Math.round(product.price * 1.2)}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">20% OFF</span>
                </div>
                <p className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{product.delivery}</p>
              </div>
            </motion.div>

            <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6">
              {["description", "reviews", "more you like"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === tab ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="my-4">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{product.description}</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        100% satisfaction guarantee. If you experience any issues: missing item, poor quality,
                        late delivery, or unprofessional service, contact us for immediate resolution or full refund.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
                    {/* Review form and list */}
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Write a Review</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${star <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              onClick={() => setUserRating(star)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
                        <textarea id="review-text" rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white" placeholder="Share details about your experience with this product"></textarea>
                      </div>
                      <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition">Submit Review</button>
                    </div>
                    <h3 className="font-medium mb-2">Customer Reviews ({product.reviews.length})</h3>
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="font-medium">{review.name}</p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "more you like" && <ProductCard />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.3 }} className="fixed bottom-0 left-0 bg-white/80 border-t right-0 dark:bg-gray-900/60 p-4 shadow-lg">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex items-center border rounded-full px-4 py-2 gap-3 bg-white/80">
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-600 dark:text-gray-300">
              <Minus size={18} />
            </motion.button>
            <span className="text-sm font-semibold w-6 text-center">{qty}</span>
            <motion.button whileTap={{ scale: 0.8 }} onClick={() => setQty(qty + 1)} className="text-gray-600 dark:text-gray-300">
              <Plus size={18} />
            </motion.button>
          </div>
          <motion.button 
          onClick={handleaddtocart}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-full transition">
            <ShoppingCart size={18} />
            Add to cart
          </motion.button>
        </div>
      </motion.div>
      
    </motion.div>
</>
  );
}
