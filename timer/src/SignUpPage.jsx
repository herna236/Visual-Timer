import React, { useState } from 'react'; // Import React and useState hook
import api from './api/axiosConfig'; // Import configured Axios instance for API calls
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import './SignUpPage.css'; // Import CSS for styling the sign-up page

function SignUpPage() {
  // State variables for storing email and password input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useNavigate hook to programmatically navigate between routes
  const navigate = useNavigate();

  // Async function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Make a POST request to the registration endpoint with email and password
      const response = await api.post('/register', { email, password });
      console.log('Registration response:', response.data); // Log the response data

      // Check if the response contains both token and userId
      if (response.data.token && response.data.userId) {
        // Store userId and token in local storage
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
        console.log('Stored token:', response.data.token); // Log the stored token
        alert('User registered successfully'); // Alert user of successful registration
        navigate('/timer-control'); // Redirect to the timer control page
      } else {
        alert('Unexpected response from server: Token or userId not found'); // Alert if response is not as expected
      }
    } catch (error) {
      console.error('Error registering user:', error); // Log any errors
      // Check if the error has a response object (indicating a server error)
      if (error.response) {
        alert('Error registering user: ' + (error.response.data.message || 'An error occurred')); // Alert user with specific error message
      } else {
        alert('Error registering user: An error occurred'); // Alert for any other errors
      }
    }
  };

  // Render the sign-up form
  return (
    <div className="sign-up-container"> {/* Container for the sign-up form */}
      <form onSubmit={handleSubmit} className="sign-up-form"> {/* Form element with submission handler */}
        <h1>Sign Up</h1> {/* Form heading */}
        <div className="divider"></div> {/* Divider for styling */}
        <label>
          Email:
          <input
            type="email" // Input type for email
            value={email} // Bind input value to state
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
            required // Make this field required
          />
        </label>
        <label>
          Password:
          <input
            type="password" // Input type for password
            value={password} // Bind input value to state
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
            required // Make this field required
            minLength="8" // Set minimum length for password
          />
        </label>
        <button type="submit">Sign Up</button> {/* Submit button */}
      </form>
    </div>
  );
}

export default SignUpPage; // Export the SignUpPage component
