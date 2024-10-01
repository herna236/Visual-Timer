import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
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
    </div>
  );
}

export default LandingPage;
