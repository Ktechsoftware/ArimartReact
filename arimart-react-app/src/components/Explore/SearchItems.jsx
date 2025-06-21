import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import FilterSheet from "./FilterSheet";

const SearchItems = () => {
    const [showFilter, setShowFilter] = useState(false);
  return (
    <>
   <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-xl mb-6"
         >
           <Search className="w-5 h-5 text-gray-500 mr-2" />
           <input
             type="text"
             placeholder="Search for 'Grocery'"
             className="bg-transparent outline-none flex-1 text-sm"
           />
           <motion.button 
           onClick={() => setShowFilter(true)}
             whileHover={{ rotate: 15 }}
             whileTap={{ scale: 0.9 }}
           >
             <SlidersHorizontal className="w-5 h-5 text-gray-500" />
           </motion.button>
         </motion.div>
      
      <FilterSheet isOpen={showFilter} onClose={() => setShowFilter(false)} />
      </>
  )
}

export default SearchItems