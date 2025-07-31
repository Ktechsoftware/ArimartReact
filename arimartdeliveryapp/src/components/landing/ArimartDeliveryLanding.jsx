import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Truck, 
  Clock, 
  DollarSign, 
  MapPin, 
  Smartphone, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Target,
  TrendingUp,
  Shield,
  Calendar,
  Phone,
  Mail,
  Menu,
  X
} from 'lucide-react';
import { DesktopHeader } from '../common/DesktopHeader';

const ArimartDeliveryLanding = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <DesktopHeader/>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-2" />
                  #1 Delivery Platform in India
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Become an
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {' '}Arimart{' '}
                  </span>
                  Delivery Partner
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Earn flexible income on your schedule. Join thousands of delivery partners 
                  making up to ₹50,000 per month with Arimart's premium delivery network.
                </p>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Earning Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
                <motion.button
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="flex items-center space-x-8 pt-8"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-gray-600">Active Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">₹35K</div>
                  <div className="text-gray-600">Avg. Monthly Earning</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">4.8★</div>
                  <div className="text-gray-600">Partner Rating</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative z-10">
                <img
                  src="https://blinkit.com/careers/sites/default/files/2023-05/ezgif.com-webp-to-png.png"
                  alt="Delivery Partner"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <motion.div
                className="absolute -top-8 -right-8 bg-white rounded-2xl p-6 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">₹2,500</div>
                    <div className="text-gray-600">Today's Earnings</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1.5 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">27</div>
                    <div className="text-gray-600">Deliveries Done</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Arimart?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the benefits of being part of India's fastest-growing delivery network
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "High Earnings",
                description: "Earn up to ₹50,000/month with surge pricing and bonuses",
                color: "green"
              },
              {
                icon: Clock,
                title: "Flexible Schedule",
                description: "Work when you want, no fixed hours or minimum commitments",
                color: "blue"
              },
              {
                icon: Shield,
                title: "Insurance Coverage",
                description: "Comprehensive insurance for you and your vehicle",
                color: "purple"
              },
              {
                icon: Smartphone,
                title: "Easy-to-Use App",
                description: "Intuitive partner app with real-time tracking and support",
                color: "orange"
              },
              {
                icon: TrendingUp,
                title: "Performance Rewards",
                description: "Extra bonuses for maintaining high ratings and delivery counts",
                color: "pink"
              },
              {
                icon: Users,
                title: "24/7 Support",
                description: "Dedicated partner support team available round the clock",
                color: "indigo"
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-2xl flex items-center justify-center mb-6`}>
                  <benefit.icon className={`w-8 h-8 text-${benefit.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="requirements" className="py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              variants={slideInLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Simple Requirements
                </h2>
                <p className="text-xl text-gray-600">
                  Join our delivery network with these basic requirements
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Valid driving license",
                  "Own vehicle (bike/scooter/bicycle)",
                  "Smartphone with internet connection",
                  "Age between 18-60 years",
                  "Basic knowledge of local area"
                ].map((requirement, index) => (
                  <motion.div
                    key={requirement}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-lg text-gray-700">{requirement}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Check Eligibility
              </motion.button>
            </motion.div>

            <motion.div
              variants={slideInRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://blinkit.com/careers/sites/default/files/2021-12/deliver-icon-earnings.png"
                alt="Delivery Requirements"
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How to Get Started
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our delivery network in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Apply Online",
                description: "Fill out our simple application form with your basic details and documents",
                icon: Smartphone
              },
              {
                step: "02",
                title: "Verification",
                description: "Our team will verify your documents and conduct a brief interview",
                icon: Shield
              },
              {
                step: "03",
                title: "Start Delivering",
                description: "Download the app, complete training, and start earning immediately",
                icon: Truck
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl font-bold text-gray-100 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 -z-10">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-8 h-8 text-gray-300 mx-auto" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of delivery partners earning flexible income with Arimart
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now
              </motion.button>
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download App
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help you get started
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Call Us",
                info: "+91 1800-ARIMART",
                color: "blue"
              },
              {
                icon: Mail,
                title: "Email Us",
                info: "partner@arimart.com",
                color: "green"
              },
              {
                icon: Calendar,
                title: "Office Hours",
                info: "Mon-Sat: 9AM-7PM",
                color: "purple"
              }
            ].map((contact, index) => (
              <motion.div
                key={contact.title}
                className="text-center p-8 bg-white rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 bg-${contact.color}-100 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <contact.icon className={`w-8 h-8 text-${contact.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-gray-600">{contact.info}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Arimart</span>
              </div>
              <p className="text-gray-400">
                India's leading delivery platform connecting businesses with customers.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Partners</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Partner Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Earnings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner Agreement</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Arimart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArimartDeliveryLanding;