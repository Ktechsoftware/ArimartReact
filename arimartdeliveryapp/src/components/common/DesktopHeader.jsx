import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, Truck, X } from 'lucide-react'

export const DesktopHeader = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <motion.header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white backdrop-blur-md shadow-lg' : 'bg-transparent'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                            <Truck className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            Arimart
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {['Benefits', 'Requirements', 'Process', 'Contact'].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                whileHover={{ y: -2 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                        <motion.button
                            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Join Now
                        </motion.button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.nav
                        className="md:hidden mt-4 pb-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {['Benefits', 'Requirements', 'Process', 'Contact'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="block py-2 text-gray-700 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item}
                            </a>
                        ))}
                        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full font-semibold">
                            Join Now
                        </button>
                    </motion.nav>
                )}
            </div>
        </motion.header>
    )
}