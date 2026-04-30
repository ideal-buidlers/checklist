"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

// Simple password - in production, you'd want this to be more secure
const CORRECT_PASSWORD = "Ideal";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if password is already stored in session
    const storedAuth = sessionStorage.getItem("authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }

    // Check for Google OAuth success in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("google_auth") === "success") {
      setGoogleConnected(true);
      sessionStorage.setItem("google_connected", "true");
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const storedGoogle = sessionStorage.getItem("google_connected");
      if (storedGoogle === "true") {
        setGoogleConnected(true);
      }
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

  const initiateGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setGoogleConnected(false);
    sessionStorage.removeItem("authenticated");
    sessionStorage.removeItem("google_connected");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        googleConnected,
        loading,
        authenticate,
        initiateGoogleAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
