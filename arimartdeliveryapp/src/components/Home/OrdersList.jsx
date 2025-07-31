import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Utensils, Store, Info, Clock, MapPin, Package, CreditCard, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const statusStyles = {
  'Pickup Pending': 'bg-amber-100 text-amber-800',
  'Pickup Failed': 'bg-red-100 text-red-800',
  'Pickup Rescheduled': 'bg-blue-100 text-blue-800',
  'Delivery Failed': 'bg-red-100 text-red-800',
  'Delivery Pending': 'bg-amber-100 text-amber-800',
  'Delivery Rescheduled': 'bg-blue-100 text-blue-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Paid': 'bg-green-100 text-green-800'
};

export const OrdersList = ({ orders, expandedOrder, toggleExpand }) => {
  const navigate = useNavigate();
  const handlepickup = () => {
    navigate('/order/pickup')
  }
  return (
    <div className="px-4 space-y-3">
      <AnimatePresence>
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
            className={`p-4 rounded-xl bg-white shadow-xs border border-gray-100 transition-all ${
              expandedOrder === index ? "ring-2 ring-blue-100" : "hover:shadow-sm"
            }`}
          >
            {/* Order Header */}
            <motion.div
              onClick={() => toggleExpand(index)}
              className="flex items-center justify-between cursor-pointer"
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

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedOrder === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-4">
                    {/* Pickup Centers */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pickup Centers</p>
                      <div className="space-y-2">
                        {order.pickups.map((pickup, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-800">{pickup.centerName}</p>
                                <p className="text-xs text-gray-500 mt-1">{pickup.address}</p>
                                <div className="mt-2 space-y-1.5">
                                  {pickup.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs text-gray-700">
                                      <span>{item.name} ({item.weight})</span>
                                      <span>Qty: {item.qty}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Address</p>
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{order.delivery.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.delivery.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 flex items-center">
                          <CreditCard className="w-3 h-3 mr-1" /> Total
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">₹{order.total}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500">Payment</p>
                        <p className="text-sm font-semibold text-green-600 mt-1 flex items-center">
                          {order.payment}
                        </p>
                      </div>
                    </div>

                    {/* Time Alert */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <p className="text-xs font-medium text-amber-700">Delivery Pickup By</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 ml-6">{order.pickupDeadline}</p>
                      <div className="flex items-center justify-between text-xs font-medium ml-6 mt-1">
                        <span className="text-amber-600">Time Left</span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          {order.timeLeft}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <select className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white">
                        <option>Update Status</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-xs"
                      >
                        Confirm
                      </motion.button>
                    </div>
                  </div>
                  <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={handlepickup}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-xs"
                      >
                        Pick up order
                      </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};