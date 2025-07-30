import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const DocumentSelector = () => {
  const navigate = useNavigate();

  const documents = [
    { label: "Aadhar Card", route: "/info/docs/upload/aadhar" },
    { label: "PAN Card", route: "/info/docs/upload/pan" },
    { label: "Driving License", route: "/info/docs/upload/license" },
  ];

  return (
    <div className="min-h-screen px-4 bg-gray-50">
      {/* Header with back button */}
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
          Personal Documents
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          Upload focused photos of below documents for faster verification
        </motion.p>
      </div>

      {/* Document List */}
      <div className="space-y-3 mt-4">
        {documents.map((doc, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            onClick={() => navigate(doc.route)}
            className="w-full px-5 py-4 bg-white rounded-xl shadow-sm border border-gray-100 text-left hover:shadow-md transition-all flex items-center justify-between"
          >
            <span className="font-medium text-gray-800">{doc.label}</span>
            <div className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};