// LandingPage.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get('message');

  return (
    <div className="landing-page">
      <div className="welcome">
        Welcome to the visual timer app. This app is great for people who want to see a countdown with a mystery image!
      </div>
      <div className="button-container">
        <Link to="/sign-in">
          <button>Sign In</button>
        </Link>
        <Link to="/sign-up">
          <button>Sign Up</button>
        </Link>
      </div>
      {message && <div className="alert">{message}</div>}
    </div>
  );
}

export default LandingPage;
