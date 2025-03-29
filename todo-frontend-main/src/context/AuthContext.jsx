import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap around the app and provide authentication context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Added token state

  // Load user and token from localStorage when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(storedUser); // Restore user from localStorage
      setToken(storedToken); // Restore token from localStorage
    }
  }, []);

  // Login function to set the user and token, and store them in localStorage
  const login = (username, token) => {
    if (!username || !token) return; // Prevent empty username or token

    const userData = username
    setUser(userData);
    setToken(token); // Set the token
    localStorage.setItem("user", userData); // Store user data
    localStorage.setItem("token", token); // Store the token
  };

  // Logout function to clear user and token from state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  console.log("user", user)

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
