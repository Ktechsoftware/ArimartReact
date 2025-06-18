import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="py-20 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to <span className="text-indigo-600 dark:text-indigo-400">Arimart</span>
          </h1>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
            Your one-stop shop for all your retail needs. Quality products at affordable prices with exceptional customer service.
          </p>
          <div className="flex space-x-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md">
              Explore Products
            </button>
            <button className="border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 px-6 py-3 rounded-md">
              Learn More
            </button>
          </div>
        </div>
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
            alt="Shopping" 
            className="rounded-lg shadow-xl w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;