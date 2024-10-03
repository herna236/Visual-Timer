import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Create a context for authentication
export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to track if we are still checking authentication status
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Function to check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const path = location.pathname;

      // No authentication needed for these routes
      if (path === '/sign-in' || path === '/sign-up' || path === '/') {
        setIsCheckingAuth(false);
        return;
      }


      if (token) {
        setIsAuthenticated(true);
      } else {
        // If no token, user is not authenticated
        setIsAuthenticated(false);
        // Navigate to home with a message
        navigate('/?message=' + encodeURIComponent('Please sign in or register to view this page'));
      }


      setIsCheckingAuth(false);
    };

    // Call the checkAuth function when component mounts or path changes
    checkAuth();
  }, [navigate, location.pathname]);


  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  // Provide authentication state to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
