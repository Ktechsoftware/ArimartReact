import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";

const RegistrationStatus = () => {
  const navigate = useNavigate();

  const sections = [
    { title: "Personal Information", status: "Approved", route: "/documents/personal-info" },
    { title: "Personal Documents", status: "Verification Pending", route: "/documents/personal" },
    { title: "Vehicle Details", status: "Approved", route: "/documents/vehicle" },
    { title: "Bank Account Details", status: "Approved", route: "/documents/bank" },
    { title: "Emergency Details", status: "Approved", route: "/documents/emergency" },
  ];

  const getStatusClass = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-800";
    if (status === "Verification Pending") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    if (status === "Approved") return "✓";
    if (status === "Verification Pending") return "!";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {/* Header */}
      <div className="sticky top-0 pt-6 pb-4 bg-gray-50 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          <span className="font-medium">Back</span>
        </button>
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mt-2 text-gray-800"
        >
         Registration Status
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          Track your application progress
        </motion.p>
      </div>

      {/* Status Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 mb-6 flex items-center shadow-sm"
      >
        <div className="flex-1">
          <div className="flex items-center">
            <span className="bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2">!</span>
            <h2 className="text-amber-800 font-semibold text-sm">Application Under Review</h2>
          </div>
          <p className="text-xs text-amber-700 mt-1">Your account will be activated within 48 hours</p>
        </div>
        <motion.img 
          src="/img/verify-illustration.png" 
          alt="Verification" 
          className="w-16 h-16 ml-3 object-contain"
          whileHover={{ scale: 1.05 }}
        />
      </motion.div>

      {/* Progress Cards */}
      <div className="space-y-3">
        {sections.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(item.route)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getStatusClass(item.status)}`}>
                {getStatusIcon(item.status)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
            <ArrowRight className="text-gray-400 h-5 w-5" />
          </motion.div>
        ))}
      </div>

      {/* Help Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-sm"
      >
        <button
          onClick={() => navigate("/support/contact")}
          className="w-full py-3 bg-gray-50 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <HelpCircle className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium">Need Help? Contact Support</span>
        </button>
      </motion.div>
    </div>
  );
};

export default RegistrationStatus;