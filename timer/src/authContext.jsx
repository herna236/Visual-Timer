import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const path = location.pathname;

      // No authentication needed for sign-in, sign-up, or landing page
      if (path === '/sign-in' || path === '/sign-up' || path === '/') {
        setIsCheckingAuth(false);
        return;
      }

      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/?message=' + encodeURIComponent('Please sign in or register to view this page'));
      }

      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
