import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state from LocalStorage to persist login on refresh
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const session = localStorage.getItem("session");
    if (session) return JSON.parse(session);
    return null;
  });

  // Centralized Login Function
  const login = (newToken, newUser) => {
    // 1. Update LocalStorage
    localStorage.setItem("token", newToken);
    localStorage.setItem("session", JSON.stringify(newUser));

    // 2. Update React State
    setToken(newToken);
    setUser(newUser);
  };

  // Centralized Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("session");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);