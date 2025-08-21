import { useState, useEffect } from 'react';
import { cookieUtils } from '../utils/cookieUtils';
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user data from cookies on mount
  useEffect(() => {
    const loadUserFromCookies = () => {
      const { user: cookieUser, token: cookieToken, userId: cookieUserId } = cookieUtils.getUserData();
      
      setUser(cookieUser);
      setToken(cookieToken);
      setUserId(cookieUserId);
      setIsAuthenticated(cookieUtils.isAuthenticated());
      setLoading(false);
    };

    loadUserFromCookies();
  }, []);

  // Login function
  const login = (userData, authToken) => {
    try {
      cookieUtils.setUserData(userData, authToken);
      
      setUser(userData);
      setToken(authToken);
      // Handle both 'id' and 'Id' fields from backend
      const userId = userData.id || userData.Id;
      setUserId(userId ? userId.toString() : null);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    try {
      cookieUtils.clearUserData();
      
      setUser(null);
      setToken(null);
      setUserId(null);
      setIsAuthenticated(false);
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  // Update user function
  const updateUser = (updatedFields) => {
    try {
      const updatedUser = cookieUtils.updateUserData(updatedFields);
      if (updatedUser) {
        setUser(updatedUser);
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  };

  // Get registration completion status
  const getRegistrationStatus = () => {
    if (!user) return null;
    
    return {
      currentStep: user.currentStep || 1,
      personalInfoComplete: user.personalInfoComplete || false,
      documentsUploaded: user.documentsUploaded || false,
      profileComplete: user.profileComplete || false,
      registrationStatus: user.registrationStatus || 'PENDING',
      isApproved: user.registrationStatus === 'APPROVED',
      isRejected: user.registrationStatus === 'REJECTED',
      rejectRemark: user.rejectRemark || null
    };
  };

  // Check if user needs to complete registration
  const needsRegistrationCompletion = () => {
    const status = getRegistrationStatus();
    return status && (!status.profileComplete || status.registrationStatus !== 'APPROVED');
  };

  return {
    // State
    user,
    token,
    userId,
    isAuthenticated,
    loading,
    
    // Actions
    login,
    logout,
    updateUser,
    
    // Registration status
    getRegistrationStatus,
    needsRegistrationCompletion,
    
    // Utility functions
    refreshUserData: () => {
      const { user: cookieUser, token: cookieToken, userId: cookieUserId } = cookieUtils.getUserData();
      setUser(cookieUser);
      setToken(cookieToken);
      setUserId(cookieUserId);
      setIsAuthenticated(cookieUtils.isAuthenticated());
    }
  };
};