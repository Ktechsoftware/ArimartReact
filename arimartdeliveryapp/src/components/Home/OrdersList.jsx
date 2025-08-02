import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ChevronDown,
  ArrowLeft,
  Package,
  CheckCircle,
  ChevronUp,
  Calendar
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const OrdersList = ({ orders, expandedOrder, toggleExpand }) => {
  const navigate = useNavigate();
  const handlepickup = () => {
    navigate('/order/pickup')
  }
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const statusStyles = {
    'Pickup Pending': 'bg-pink-100 text-pink-700',
    'Pickup Failed': 'bg-red-100 text-red-800',
    'Pickup Rescheduled': 'bg-blue-100 text-blue-800',
    'Delivery Failed': 'bg-red-100 text-red-800',
    'Delivery Pending': 'bg-amber-100 text-amber-800',
    'Delivery Rescheduled': 'bg-blue-100 text-blue-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Paid': 'bg-green-100 text-green-800'
  };

  const statusOptions = [
    'Select an option',
    'In Transit',
    'Picked Up',
    'Delayed',
    'Unable to Pickup'
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="px-4 space-y-3">
      <AnimatePresence>
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
            className={`rounded-xl bg-white shadow-xs border border-gray-100 transition-all ${
              expandedOrder === index ? "ring-2 ring-blue-100" : "hover:shadow-sm"
            }`}
          >
            {/* Order Header - Always Visible */}
            <motion.div
              onClick={() => toggleExpand(index)}
              className="flex items-center justify-between cursor-pointer p-4"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Order #{order.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" /> {order.date}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                {expandedOrder === index ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </motion.div>

            {/* Expanded Content - Detailed Pickup UI */}
            <AnimatePresence>
              {expandedOrder === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {/* Customer Info */}
                      <motion.div variants={itemVariants} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 font-semibold text-sm">AS</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Aman Sharma</p>
                            </div>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm"
                          >
                            <Phone className="w-5 h-5 text-white" />
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Pickup Centers */}
                      <motion.div variants={itemVariants} className="space-y-3">
                        {order.pickups.map((pickup, i) => (
                          <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                  <MapPin className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">{pickup.centerName}</p>
                                  <p className="text-xs text-gray-500 mt-1">{pickup.address}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                                >
                                  <Phone className="w-4 h-4 text-white" />
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                                >
                                  <MapPin className="w-4 h-4 text-white" />
                                </motion.button>
                              </div>
                            </div>
                            
                            {/* Product Items */}
                            {pickup.items.map((item, idx) => (
                              <div key={idx} className="flex items-center space-x-3 bg-white rounded-xl p-3 mb-2 last:mb-0">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                  <div className={`w-8 h-8 rounded-full ${item.name.includes('Besan') ? 'bg-yellow-400' : 'bg-yellow-600'}`}></div>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                  <p className="text-xs text-gray-500">{item.weight}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </motion.div>

                      {/* Delivery Address */}
                      <motion.div variants={itemVariants} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-red-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">Delivery</p>
                              <p className="text-xs text-gray-500 mt-1">{order.delivery.address}</p>
                            </div>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                          >
                            <MapPin className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      </motion.div>

                      {/* Payment Info */}
                      <motion.div variants={itemVariants} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Package className="w-5 h-5 text-gray-600" />
                            <span className="font-semibold text-gray-900">₹ {order.total}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{order.payment}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Time Alert */}
                      <motion.div 
                        variants={itemVariants}
                        className="bg-red-50 border border-red-200 rounded-2xl p-4"
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-red-800">Delivery Pickup By</p>
                            <p className="text-xs text-gray-600 mt-1">Tomorrow</p>
                            <p className="text-sm font-semibold text-gray-900">{order.pickupDeadline}</p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800">TIME LEFT</span>
                            </div>
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="bg-red-100 px-3 py-1 rounded-full"
                            >
                              <span className="text-sm font-bold text-red-800">{order.timeLeft}</span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Update Status */}
                      <motion.div variants={itemVariants} className="space-y-3">
                        <p className="text-sm font-medium text-red-600">Update Status</p>
                        
                        <div className="relative">
                          <motion.button
                            onClick={() => setShowDropdown(!showDropdown)}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between text-left shadow-sm"
                          >
                            <span className="text-sm text-gray-600">
                              {selectedStatus || 'Select an option'}
                            </span>
                            <motion.div
                              animate={{ rotate: showDropdown ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            </motion.div>
                          </motion.button>

                          <AnimatePresence>
                            {showDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
                              >
                                {statusOptions.map((option, index) => (
                                  <motion.button
                                    key={option}
                                    onClick={() => {
                                      setSelectedStatus(option === 'Select an option' ? '' : option);
                                      setShowDropdown(false);
                                    }}
                                    whileHover={{ backgroundColor: '#f9fafb' }}
                                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                                  >
                                    {option}
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>

                      {/* Confirm Pickup Button */}
                      <motion.div variants={itemVariants} className="pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlepickup}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 rounded-2xl shadow-lg"
                        >
                          Confirm Pickup
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};