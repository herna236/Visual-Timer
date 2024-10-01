import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './authContext';
import TimerControl from './TimerControl';
import LandingPage from './LandingPage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import ProfilePage from './ProfilePage';
import EditProfilePage from './EditProfilePage';
import ErrorBoundary from './ErrorBoundary';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />

              {/* Wrap protected routes with ProtectedRoute */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timer-control"
                element={
                  <ProtectedRoute>
                    <TimerControl />
                  </ProtectedRoute>
                }
              />
            </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;

// User Authentication:

// When a user logs in, the AuthProvider updates its state to reflect that the user is authenticated.
// Accessing Protected Routes:

// When a user tries to access a protected route (e.g., /profile), ProtectedRoute checks the authentication state from AuthProvider.
// If the user is authenticated, it renders the ProfilePage. If not, it redirects to the sign-in page.
