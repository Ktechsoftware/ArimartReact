import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import Products from './components/Products';
import { ThemeProvider } from './context/ThemeContext';

function App() {

  return (
    <ThemeProvider>
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header/>
        <main>
          <Hero />
          <Features />
          <Products />
        </main>
        <Footer />
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;