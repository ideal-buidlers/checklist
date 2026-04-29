"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

// Simple password - in production, you'd want this to be more secure
const CORRECT_PASSWORD = "Ideal123!";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if password is already stored in session
    const storedAuth = sessionStorage.getItem("authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const authenticate = (password) => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("authenticated", "true");
      return true;
    }
    return false;
  };

  const signOut = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("authenticated");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, authenticate, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
