import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Export custom hook
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // e.g., { id: 101, name: "Ravi", isOnline: true }

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("deliveryUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("deliveryUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("deliveryUser");
    }
  }, [user]);

  // Login function
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Toggle Online/Offline
  const toggleOnlineStatus = () => {
    if (user) {
      setUser({ ...user, isOnline: !user.isOnline });
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, toggleOnlineStatus }}>
      {children}
    </UserContext.Provider>
  );
};
