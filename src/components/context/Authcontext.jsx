// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem('token'),
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    username: localStorage.getItem('username')
  }));

  const login = (token, isAdmin, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', isAdmin);
    localStorage.setItem('username', username);
    setAuth({ token, isAdmin, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
    setAuth({ token: null, isAdmin: false, username: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;