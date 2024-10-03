import React, { useState } from 'react';
import api from './api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/register', { email, password });
      if (response.data.token && response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
        alert('User registered successfully');
        navigate('/timer-control');
      } else {
        alert('Unexpected response from server: Token or userId not found');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert(
        'Error registering user: ' +
          (error.response?.data.message || 'An error occurred')
      );
    }
  };

  return (
    <div className="sign-up-container">
      <form onSubmit={handleSubmit} className="sign-up-form">
        <h1>Sign Up</h1>
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
            minLength="8"
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpPage;
