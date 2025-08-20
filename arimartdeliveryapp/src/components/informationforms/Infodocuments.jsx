import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Infodocuments = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.deliveryAuth.user);
    
    console.log('User data:', user);
    const [pendingDocs, setPendingDocs] = useState([
        { name: "Personal Documents", completed: false, route: "/info/docs/upload" },
        { name: "Vehicle Details", completed: false, route: "/info/docs/vehicle" },
        { name: "Bank Account Details", completed: false, route: "/info/docs/bank" },
        { name: "Emergency Details", completed: false, route: "/info/docs/emergency" },
    ]);

    const [completedDocs] = useState([
        { name: "Personal Information", completed: true, route: "/info/docs/upload/personal-info" }
    ]);


    const toggleDocCompletion = (index) => {
        const updatedDocs = [...pendingDocs];
        updatedDocs[index].completed = !updatedDocs[index].completed;
        setPendingDocs(updatedDocs);
    };
    const handlesubmitdocuments = () => {
        navigate('/info/docs/register')
    };

    return (
        <div className="relative w-full min-h-screen bg-gray-50 px-4 pb-24">
            <div className="max-w-md w-full mx-auto pt-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-[#FF5963] to-[#FFAF70] text-white rounded-2xl p-6 mb-6 shadow-lg"
                >
                    <h2 className="text-2xl font-bold">Welcome to Arimart</h2>
                    <p className="text-sm mt-2 opacity-90">
                        Just a few steps to complete and then you can start earning with Us
                    </p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{completedDocs.length} of {completedDocs.length + pendingDocs.length} completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(completedDocs.length / (completedDocs.length + pendingDocs.length)) * 100}%`,
                                transition: { delay: 0.4, duration: 1 }
                            }}
                            className="bg-gradient-to-r from-[#FF5963] to-[#FFAF70] h-2 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Pending Documents */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">
                        Pending Documents
                    </h3>
                    <div className="space-y-3 mb-6">
                        <AnimatePresence>
                            {pendingDocs.map((doc, idx) => (
                                !doc.completed && (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => toggleDocCompletion(idx)}
                                    >
                                        <Link
                                            to={doc.route} className="flex items-center space-x-3">
                                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                                            <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                        </Link>
                                        <span className="text-gray-400 text-lg">→</span>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Completed Documents */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">
                        Completed Documents
                    </h3>
                    <div className="space-y-3">
                        {completedDocs.map((doc, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                                className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                </div>
                                <span className="text-gray-400 text-lg">→</span>
                            </motion.div>
                        ))}
                        {pendingDocs.map((doc, idx) => (
                            doc.completed && (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                    </div>
                                    <span className="text-gray-400 text-lg">→</span>
                                </motion.div>
                            )
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Sticky Submit Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4"
            >
                <button
                    className="w-full max-w-md mx-auto bg-gradient-to-r from-[#FF5963] to-[#FFAF70] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handlesubmitdocuments}
                >
                    Submit Documents
                </button>
            </motion.div>
        </div>
    );
};