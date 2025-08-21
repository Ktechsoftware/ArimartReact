import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

// Required document types for delivery users
const REQUIRED_DOCUMENT_TYPES = ['Aadhaar', 'PAN', 'DrivingLicence'];

// Upload single document
export const uploadDocumentAsync = createAsyncThunk(
  'documentUpload/uploadDocument',
  async ({ userId, documentType, frontFile, backFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId.toString());
      formData.append('documentType', documentType);
      formData.append('frontFile', frontFile);
      
      if (backFile) {
        formData.append('backFile', backFile);
      }

      const response = await API.post('/document/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return {
        documentType,
        documentId: response.data.DocumentId,
        isVerified: response.data.IsVerified,
        message: response.data.Message
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Document upload failed');
    }
  }
);

// Get user's uploaded documents
export const getUserDocumentsAsync = createAsyncThunk(
  'documentUpload/getUserDocuments',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/document/user/${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch documents');
    }
  }
);

// Check if all documents are uploaded and update user status
export const checkAndUpdateDocumentStatusAsync = createAsyncThunk(
  'documentUpload/checkAndUpdateStatus',
  async (userId, { getState, rejectWithValue, dispatch }) => {
    try {
      const { documentUpload } = getState();
      const uploadedTypes = Object.keys(documentUpload.uploadedDocuments);
      
      // Check if all required documents are uploaded
      const allDocumentsUploaded = REQUIRED_DOCUMENT_TYPES.every(type => 
        uploadedTypes.includes(type)
      );

      if (allDocumentsUploaded) {
        // Update user's DocumentsUploaded status to true
        const response = await API.put(`/auth/delivery-user/update/${userId}`, {
          documentsUploaded: true,
          currentStep: 3 // Move to next step after documents
        });

        return {
          allDocumentsUploaded: true,
          user: response.data.user
        };
      }

      return {
        allDocumentsUploaded: false,
        user: null
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update document status');
    }
  }
);

const initialState = {
  // Upload status for each document type
  uploadedDocuments: {}, // { 'Aadhaar': { documentId: 123, isVerified: false, uploadDate: '...' }, ... }
  
  // Upload progress
  uploading: {}, // { 'Aadhaar': true/false, 'PAN': true/false, ... }
  
  // Overall status
  allDocumentsUploaded: false,
  documentUploadComplete: false,
  
  // UI state
  loading: false,
  error: null,
  
  // Progress tracking
  totalRequiredDocuments: REQUIRED_DOCUMENT_TYPES.length,
  uploadedCount: 0,
  progressPercentage: 0
};

const documentUploadSlice = createSlice({
  name: 'documentUpload',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset upload state
    resetUploadState: (state) => {
      return { ...initialState };
    },
    
    // Set uploading status for specific document
    setUploading: (state, action) => {
      const { documentType, isUploading } = action.payload;
      state.uploading[documentType] = isUploading;
    },
    
    // Remove uploaded document
    removeDocument: (state, action) => {
      const documentType = action.payload;
      delete state.uploadedDocuments[documentType];
      delete state.uploading[documentType];
      
      // Recalculate progress
      state.uploadedCount = Object.keys(state.uploadedDocuments).length;
      state.progressPercentage = (state.uploadedCount / state.totalRequiredDocuments) * 100;
      state.allDocumentsUploaded = state.uploadedCount === state.totalRequiredDocuments;
    },
    
    // Initialize from user data
    initializeFromUserData: (state, action) => {
      const user = action.payload;
      state.allDocumentsUploaded = user.documentsUploaded || false;
      state.documentUploadComplete = user.documentsUploaded || false;
    }
  },

  extraReducers: (builder) => {
    builder
      // Upload Document
      .addCase(uploadDocumentAsync.pending, (state, action) => {
        const { documentType } = action.meta.arg;
        state.uploading[documentType] = true;
        state.error = null;
      })
      .addCase(uploadDocumentAsync.fulfilled, (state, action) => {
        const { documentType, documentId, isVerified, message } = action.payload;
        
        // Update uploaded documents
        state.uploadedDocuments[documentType] = {
          documentId,
          isVerified,
          uploadDate: new Date().toISOString(),
          message
        };
        
        // Clear uploading status
        state.uploading[documentType] = false;
        
        // Update progress
        state.uploadedCount = Object.keys(state.uploadedDocuments).length;
        state.progressPercentage = (state.uploadedCount / state.totalRequiredDocuments) * 100;
        
        // Check if all documents are uploaded
        const allUploaded = REQUIRED_DOCUMENT_TYPES.every(type => 
          state.uploadedDocuments[type]
        );
        
        state.allDocumentsUploaded = allUploaded;
      })
      .addCase(uploadDocumentAsync.rejected, (state, action) => {
        const { documentType } = action.meta.arg;
        state.uploading[documentType] = false;
        state.error = action.payload;
      })
      
      // Get User Documents
      .addCase(getUserDocumentsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDocumentsAsync.fulfilled, (state, action) => {
        state.loading = false;
        
        // Process fetched documents
        const documents = action.payload;
        state.uploadedDocuments = {};
        
        documents.forEach(doc => {
          state.uploadedDocuments[doc.documentType] = {
            documentId: doc.documentId,
            isVerified: doc.isVerified,
            uploadDate: doc.uploadDate,
            frontImagePath: doc.frontImagePath,
            backImagePath: doc.backImagePath
          };
        });
        
        // Update progress
        state.uploadedCount = Object.keys(state.uploadedDocuments).length;
        state.progressPercentage = (state.uploadedCount / state.totalRequiredDocuments) * 100;
        state.allDocumentsUploaded = state.uploadedCount === state.totalRequiredDocuments;
      })
      .addCase(getUserDocumentsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check and Update Document Status
      .addCase(checkAndUpdateDocumentStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAndUpdateDocumentStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { allDocumentsUploaded, user } = action.payload;
        
        state.allDocumentsUploaded = allDocumentsUploaded;
        state.documentUploadComplete = allDocumentsUploaded;
        
        if (allDocumentsUploaded && user) {
          // This will be handled by the auth slice to update user data
        }
      })
      .addCase(checkAndUpdateDocumentStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  resetUploadState,
  setUploading,
  removeDocument,
  initializeFromUserData
} = documentUploadSlice.actions;

export default documentUploadSlice.reducer;

// Selectors
export const selectUploadedDocuments = (state) => state.documentUpload.uploadedDocuments;
export const selectDocumentUploadProgress = (state) => state.documentUpload.progressPercentage;
export const selectAllDocumentsUploaded = (state) => state.documentUpload.allDocumentsUploaded;
export const selectIsDocumentUploading = (documentType) => (state) => 
  state.documentUpload.uploading[documentType] || false;
export const selectRequiredDocuments = () => REQUIRED_DOCUMENT_TYPES;
export const selectMissingDocuments = (state) => {
  const uploadedTypes = Object.keys(state.documentUpload.uploadedDocuments);
  return REQUIRED_DOCUMENT_TYPES.filter(type => !uploadedTypes.includes(type));
};