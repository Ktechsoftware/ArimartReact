import React from 'react';

const LoaderSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      {/* Spinner container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner animation */}
        <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-300 border-b-green-200 border-l-green-400 rounded-full animate-spin"></div>
        
        {/* Optional loading text */}
        <p className="mt-3 text-gray-800 dark:text-gray-200 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoaderSpinner;