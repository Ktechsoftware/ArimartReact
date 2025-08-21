import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Cookie names
const DELIVERY_USER_COOKIE = 'DeliveryPartnerDataArimart';
const DELIVERY_TOKEN_COOKIE = 'DeliveryPartnerTokenArimart';
const DELIVERY_USERID_COOKIE = 'DeliveryPartnerUserIdArimart';

// Cookie utility functions
export const cookieUtils = {
  // Set user data in cookies
  setUserData: (user, token) => {
    const cookieOptions = { expires: 7 }; // 7 days
    
    Cookies.set(DELIVERY_USER_COOKIE, JSON.stringify(user), cookieOptions);
    Cookies.set(DELIVERY_TOKEN_COOKIE, token, cookieOptions);
    // Handle both 'id' and 'Id' fields from backend
    const userId = user.id || user.Id;
    if (userId) {
      Cookies.set(DELIVERY_USERID_COOKIE, userId.toString(), cookieOptions);
    }
  },

  // Get user data from cookies
  getUserData: () => {
    try {
      const userCookie = Cookies.get(DELIVERY_USER_COOKIE);
      const token = Cookies.get(DELIVERY_TOKEN_COOKIE);
      const userId = Cookies.get(DELIVERY_USERID_COOKIE);
      
      return {
        user: userCookie ? JSON.parse(userCookie) : null,
        token: token || null,
        userId: userId || null
      };
    } catch (error) {
      console.error('Error parsing user cookie:', error);
      return { user: null, token: null, userId: null };
    }
  },

  // Update user data in cookies (partial update)
  updateUserData: (updatedFields) => {
    try {
      const { user } = cookieUtils.getUserData();
      if (user) {
        const updatedUser = { ...user, ...updatedFields };
        const token = Cookies.get(DELIVERY_TOKEN_COOKIE);
        cookieUtils.setUserData(updatedUser, token);
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Error updating user cookie:', error);
      return null;
    }
  },

  // Clear all cookies
  clearUserData: () => {
    Cookies.remove(DELIVERY_USER_COOKIE);
    Cookies.remove(DELIVERY_TOKEN_COOKIE);
    Cookies.remove(DELIVERY_USERID_COOKIE);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { user, token, userId } = cookieUtils.getUserData();
    return !!(user && token && userId);
  }
};

