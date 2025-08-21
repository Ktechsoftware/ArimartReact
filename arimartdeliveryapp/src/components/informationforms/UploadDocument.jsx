import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Upload, X, Check, AlertCircle, FileText } from "lucide-react";
import { 
  uploadDocumentAsync, 
  checkAndUpdateDocumentStatusAsync,
  selectUploadedDocuments,
  selectDocumentUploadProgress,
  selectAllDocumentsUploaded,
  selectIsDocumentUploading,
  selectRequiredDocuments,
  clearError
} from "../../Store/documentUploadSlice";
import { useAuth } from "../../hooks/useAuth";

// Document Upload Component
export const UploadDocument = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { documentType } = useParams();
  console.log(documentType)
   const { login, isAuthenticated, user, userId } = useAuth();
  const uploadedDocuments = useSelector(selectUploadedDocuments);
  const uploadProgress = useSelector(selectDocumentUploadProgress);
  const allDocumentsUploaded = useSelector(selectAllDocumentsUploaded);
  const isUploading = useSelector(selectIsDocumentUploading(documentType));
  const requiredDocuments = useSelector(selectRequiredDocuments);

  // Local state
  const [images, setImages] = useState([null, null]);
  const [error, setError] = useState(null);

  // Document type configuration
  const documentConfig = {
  'Pan': {  // lowercase to match route
    title: 'PAN Card Details',
    description: 'Upload a clear photo of your PAN Card',
    frontDescription: 'Clear photo showing PAN number and details',
    backDescription: 'Back side (if applicable)'
  },
  'Aadhaar': {  // lowercase to match route
    title: 'Aadhaar Card Details',
    description: 'Upload focused photos of your Aadhaar Card for faster verification',
    frontDescription: 'Clear photo showing your name and photo',
    backDescription: 'Clear photo showing the QR code and other details'
  },
  'DrivingLicence': {  // lowercase to match route
    title: 'Driving Licence Details',
    description: 'Upload photos of your Driving Licence',
    frontDescription: 'Front side with photo and license number',
    backDescription: 'Back side with address and other details'
  }
};

  const currentDoc = documentConfig[documentType] || documentConfig['Aadhaar'];

  // Check if document is already uploaded
  const isDocumentUploaded = uploadedDocuments[documentType];

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      const updated = [...images];
      updated[index] = { file, url: imageUrl };
      setImages(updated);
      setError(null);
    }
  };

  const handleRemove = (index) => {
    const updated = [...images];
    if (updated[index]?.url) {
      URL.revokeObjectURL(updated[index].url);
    }
    updated[index] = null;
    setImages(updated);
  };

  const handleSubmit = async () => {
    if (!images[0]) {
      setError('Front image is required');
      return;
    }

    if (!userId) {
      setError('User ID not found. Please login again.');
      return;
    }

    try {
      // Upload document
      const result = await dispatch(uploadDocumentAsync({
        userId: userId,
        documentType: documentType,
        frontFile: images[0].file,
        backFile: images[1]?.file || null
      })).unwrap();

      // Check if all documents are uploaded and update status
      await dispatch(checkAndUpdateDocumentStatusAsync(userId));

      // Navigate back or to next document
      if (allDocumentsUploaded) {
        alert("Upload next document");
        navigate(-1);
      } else {
        navigate(-1);
      }

    } catch (error) {
      setError(error);
    }
  };

  // If document is already uploaded, show success state
  if (isDocumentUploaded) {
    return (
      <div className="relative min-h-screen pb-32 px-4 bg-gray-50">
        <div className="sticky top-0 pt-6 pb-4 bg-gray-50 z-10">
          <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          <span className="font-medium">Back</span>
        </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Check className="text-green-600 h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentDoc.title} Uploaded
          </h2>
          <p className="text-gray-600 mb-6">
            Your document has been uploaded successfully
          </p>
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Verification Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                isDocumentUploaded.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {isDocumentUploaded.isVerified ? 'Verified' : 'Under Review'}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/documents')}
            className="bg-gradient-to-r from-[#FF5963] to-[#FFAF70] text-white px-8 py-3 rounded-xl font-semibold"
          >
            View All Documents
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-32 px-4 bg-gray-50">
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
          {currentDoc.title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-gray-500 mt-1"
        >
          {currentDoc.description}
        </motion.p>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Upload Progress</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              className="bg-gradient-to-r from-[#FF5963] to-[#FFAF70] h-2 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center"
          >
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Sections */}
      <div className="space-y-6">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {i === 0 ? "Front Side" : "Back Side"}
              {i === 0 && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {i === 0 ? currentDoc.frontDescription : currentDoc.backDescription}
            </p>

            {images[i] ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <img
                  src={images[i].url}
                  alt="Uploaded"
                  className="w-full rounded-lg border-2 border-gray-100 object-cover max-h-64"
                />
                <button
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  onClick={() => handleRemove(i)}
                  disabled={isUploading}
                >
                  <X className="text-gray-600" />
                </button>
                <div className="flex items-center mt-2 text-green-500 text-sm font-medium">
                  <Check className="mr-1" />
                  Ready to Upload
                </div>
              </motion.div>
            ) : (
              <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors group ${
                isUploading 
                  ? 'border-gray-200 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-pink-400'
              }`}>
                <div className={`p-3 rounded-full mb-3 text-white transition-opacity ${
                  isUploading 
                    ? 'bg-gray-400' 
                    : 'bg-gradient-to-r from-[#FF5963] to-[#FFAF70] group-hover:opacity-90'
                }`}>
                  <Upload size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700 mb-1">
                  {isUploading ? 'Uploading...' : 'Click to Upload'}
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG (Max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, i)}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            )}
          </motion.div>
        ))}
      </div>

      {/* Sticky Submit Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 bg-gradient-to-t from-white via-white to-transparent"
      >
        <button
          onClick={handleSubmit}
          disabled={!images[0] || isUploading}
          className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all ${
            images[0] && !isUploading
              ? "bg-gradient-to-r from-[#FF5963] to-[#FFAF70] text-white hover:shadow-xl"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isUploading ? "Uploading..." : "Submit Document"}
        </button>
      </motion.div>
    </div>
  );
};