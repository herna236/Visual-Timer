import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './EditProfilePage.css';

function EditProfilePage() {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user email on component mount
    const fetchUserEmail = async () => {
      try {
        const response = await api.get('/user-email', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEmail(response.data.email);
        setNewEmail(response.data.email);
      } catch (err) {
        console.error('Error fetching user email:', err);
        setError('Failed to load user email.');
      }
    };

    fetchUserEmail();
  }, []);

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleEditProfile = async () => {
    try {
      const response = await api.put('/edit-profile', { newEmail }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEmail(response.data.user.email);
      setSuccessMessage('Email updated successfully!');
      setError('');
    } catch (err) {
      console.error('Error updating email:', err);
      setError('Failed to update email.');
      setSuccessMessage('');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Clear token and userId from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      // Set success message
      setSuccessMessage(`${email} was successfully deleted`);

      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account.');
    }
  };

  const GoBack = () => {
    navigate('/timer-control')
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <div>
        <p>Current Email: <span className="email-highlight">{email}</span></p>
        <input
          type="email"
          placeholder="Enter new email"
          value={newEmail}
          onChange={handleEmailChange}
        />
      </div>
      <button onClick={handleEditProfile}>Update Email</button>
      <button onClick={handleDeleteAccount} className="delete-button">
        Delete Account
      </button>
      <button onClick={GoBack}>Go Back</button>
    </div>
  );
}

export default EditProfilePage;
