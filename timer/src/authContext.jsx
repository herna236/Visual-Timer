import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Create a context for authentication
export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to track if we are still checking authentication status
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate(); // Hook for programmatic navigation
  const location = useLocation(); // Hook to get current route information

  useEffect(() => {
    // Function to check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const path = location.pathname; // Get the current path

      // No authentication needed for these routes
      if (path === '/sign-in' || path === '/sign-up' || path === '/') {
        setIsCheckingAuth(false); // No need to check further
        return; // Exit the function
      }

      // If a token exists, user is authenticated
      if (token) {
        setIsAuthenticated(true);
      } else {
        // If no token, user is not authenticated
        setIsAuthenticated(false);
        // Navigate to home with a message
        navigate('/?message=' + encodeURIComponent('Please sign in or register to view this page'));
      }

      // Mark the authentication check as complete
      setIsCheckingAuth(false);
    };

    // Call the checkAuth function when component mounts or path changes
    checkAuth();
  }, [navigate, location.pathname]); // Dependencies for useEffect

  // While checking auth, show a loading message
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  // Provide authentication state to child components
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children} {/* Render child components */}
    </AuthContext.Provider>
  );
};
