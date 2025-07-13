// components/ui/LoadMoreButton.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';

const LoadMoreButton = ({ 
  onClick, 
  loading = false, 
  disabled = false, 
  className = '', 
  children = 'Load More Products' 
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative overflow-hidden
        w-full max-w-md mx-auto
        px-6 py-4
        bg-gradient-to-r from-orange-500 to-orange-600
        hover:from-orange-600 hover:to-orange-700
        disabled:from-gray-300 disabled:to-gray-400
        text-white font-medium
        rounded-lg
        shadow-lg hover:shadow-xl
        transition-all duration-300
        flex items-center justify-center gap-2
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5"
        >
          <Loader2 className="w-5 h-5" />
        </motion.div>
      )}
      
      <span className={loading ? 'opacity-75' : 'opacity-100'}>
        {loading ? 'Loading...' : children}
      </span>
      
      {!loading && !disabled && (
        <motion.div
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      )}
      
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

export default LoadMoreButton;