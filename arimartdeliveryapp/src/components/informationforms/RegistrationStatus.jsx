import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, ArrowRight, HelpCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getRegistrationStatusAsync } from "../../Store/authSlice";

const RegistrationStatus = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userId } = useAuth();

  // Get status from Redux store
  const registrationStatus = useSelector(state => state.deliveryAuth.registrationStatus);
  const loading = useSelector(state => state.deliveryAuth.loading);

  useEffect(() => {
    if (userId) {
      dispatch(getRegistrationStatusAsync(userId));
    }
  }, [userId, dispatch]);

  // Build sections array from actual user data
  const sections = [
    { 
      title: "Personal Information", 
      status: user?.personalInfoComplete ? "Approved" : "Pending",
      route: "/info/docs/upload/personal-info",
      field: "personalInfoComplete"
    },
    { 
      title: "Personal Documents", 
      status: user?.documentsUploaded ? "Approved" : user?.documentsUploaded === false ? "Verification Pending" : "Pending",
      route: "/info/docs/upload",
      field: "documentsUploaded"
    },
    { 
      title: "Vehicle Details", 
      status: user?.vehicledetail ? "Approved" : "Pending",
      route: "/info/docs/vehicle",
      field: "vehicledetail"
    },
    { 
      title: "Bank Account Details", 
      status: user?.bankcomplete ? "Approved" : "Pending",
      route: "/info/docs/bank",
      field: "bankcomplete"
    },
    { 
      title: "Emergency Details", 
      status: user?.emergencycomplete ? "Approved" : "Pending",
      route: "/info/docs/emergency",
      field: "emergencycomplete"
    },
  ];

  const getStatusClass = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-800";
    if (status === "Verification Pending") return "bg-amber-100 text-amber-800";
    if (status === "Rejected") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    if (status === "Approved") return <CheckCircle className="w-4 h-4" />;
    if (status === "Verification Pending") return <Clock className="w-4 h-4" />;
    if (status === "Rejected") return <XCircle className="w-4 h-4" />;
    return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />;
  };

  // Determine overall application status
  const getOverallStatus = () => {
    const completedSections = sections.filter(section => section.status === "Approved").length;
    const pendingSections = sections.filter(section => section.status === "Verification Pending").length;
    const rejectedSections = sections.filter(section => section.status === "Rejected").length;

    if (rejectedSections > 0) {
      return {
        status: "Rejected",
        message: "Some documents have been rejected. Please review and resubmit.",
        bgColor: "from-red-50 to-red-100",
        borderColor: "border-red-200",
        textColor: "text-red-800",
        icon: "❌"
      };
    }

    if (completedSections === sections.length) {
      return {
        status: "Approved",
        message: "Your registration is complete and approved!",
        bgColor: "from-green-50 to-green-100",
        borderColor: "border-green-200",
        textColor: "text-green-800",
        icon: "✅"
      };
    }

    if (pendingSections > 0) {
      return {
        status: "Under Review",
        message: "Your account will be activated within 48 hours",
        bgColor: "from-amber-50 to-amber-100",
        borderColor: "border-amber-200",
        textColor: "text-amber-800",
        icon: "⏳"
      };
    }

    return {
      status: "Incomplete",
      message: "Please complete all sections to proceed",
      bgColor: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
      textColor: "text-gray-800",
      icon: "📝"
    };
  };

  const overallStatus = getOverallStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading status...</p>
        </div>
      </div>
    );
  }

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
        className={`bg-gradient-to-r ${overallStatus.bgColor} border ${overallStatus.borderColor} rounded-xl p-4 mb-6 flex items-center shadow-sm`}
      >
        <div className="flex-1">
          <div className="flex items-center">
            <span className="text-xl mr-2">{overallStatus.icon}</span>
            <h2 className={`${overallStatus.textColor} font-semibold text-sm`}>
              {overallStatus.status}
            </h2>
          </div>
          <p className={`text-xs ${overallStatus.textColor.replace('800', '700')} mt-1`}>
            {overallStatus.message}
          </p>
          {user?.rejectRemark && (
            <p className="text-xs text-red-700 mt-2 font-medium">
              Reason: {user.rejectRemark}
            </p>
          )}
        </div>
        <motion.div
          className="w-16 h-16 ml-3 bg-white bg-opacity-50 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-2xl">{overallStatus.icon}</span>
        </motion.div>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-500">
            {sections.filter(s => s.status === "Approved").length} of {sections.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${(sections.filter(s => s.status === "Approved").length / sections.length) * 100}%` 
            }}
            transition={{ delay: 0.3, duration: 1 }}
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
          />
        </div>
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

      {/* Registration Status Details */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-4 mt-6 shadow-sm border border-gray-100"
        >
          <h3 className="font-semibold text-gray-800 text-sm mb-3">Registration Details</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Status:</span>
              <span className={`font-medium ${
                user.registrationStatus === 'APPROVED' ? 'text-green-600' :
                user.registrationStatus === 'REJECTED' ? 'text-red-600' :
                'text-amber-600'
              }`}>
                {user.registrationStatus || 'PENDING'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Step:</span>
              <span className="font-medium text-gray-800">{user.currentStep || 1}</span>
            </div>
            {user.name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
            )}
            {user.phone && (
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-800">{user.phone}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Help Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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