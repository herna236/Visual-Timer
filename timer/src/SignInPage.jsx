import React, { useState } from 'react';
import api from './api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './SignInPage.css';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clear previous token and userId if they exist
      localStorage.removeItem('token');
      localStorage.removeItem('userId');


      const response = await api.post('/login', { email, password });

      // Extract the token and userId from the response data
      const { token, userId } = response.data;

      // Store the token and userId in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      console.log('Logged in successfully');
      // Redirect to TimerControl page
      navigate('/timer-control');
    } catch (error) {
      // Handle errors
      console.log(error.response?.data)
      alert('Error logging in: ' + (error.response?.data || 'An Error occured'));
    }
  };

  return (
    <div className="sign-in-container">
      <form onSubmit={handleSubmit} className="sign-in-form">
        <h1>Sign In</h1>
        <div className="divider"></div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignInPage;
