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

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/timer-control" element={<TimerControl />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
