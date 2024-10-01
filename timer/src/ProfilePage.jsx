import React, { useState, useEffect } from 'react'; // Importing necessary hooks from React
import api from './api/axiosConfig'; // Importing API configuration for making requests
import { useNavigate } from 'react-router-dom'; // Importing hook to navigate between routes
import './ProfilePage.css'; // Importing CSS styles for the component

function ProfilePage() {
  // State variables
  const [email, setEmail] = useState(''); // To store the user's email
  const [error, setError] = useState(''); // To store any error messages
  const [successMessage, setSuccessMessage] = useState(''); // To store success messages
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch user email when the component mounts
    const fetchUserEmail = async () => {
      try {
        const response = await api.get('/user-email', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Sending the JWT token for authentication
          }
        });
        setEmail(response.data.email); // Setting the fetched email to state
      } catch (err) {
        console.error('Error fetching user email:', err); // Logging any errors
        setError('Failed to load user email.'); // Setting an error message
      }
    };

    fetchUserEmail(); // Call the fetch function
  }, []); // Empty dependency array means this runs once on mount

  // Function to navigate to the Edit Profile page
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  // Function to delete the user account
  const handleDeleteAccount = async () => {
    try {
      await api.delete('/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Sending the JWT token for authentication
        }
      });
      // Clear token and userId from local storage after deletion
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      // Set a success message
      setSuccessMessage(`${email} was successfully deleted`);

      // Redirect to the landing page after 2 seconds
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Error deleting account:', err); // Logging any errors
      setError('Failed to delete account.'); // Setting an error message
    }
  };

  // Function to go back to the Timer Control page
  const GoBack = () => {
    navigate('/timer-control');
  };

  return (
    <div className="edit-profile-container"> {/* Main container for the profile page */}
      <h1>Profile</h1> {/* Title of the page */}
      {error && <p className="error">{error}</p>} {/* Display error message if any */}
      {successMessage && <p className="success">{successMessage}</p>} {/* Display success message if any */}
      <div>
        <p>Email: {email}</p> {/* Display the user's email */}
      </div>
      <button onClick={handleEditProfile}>Edit Profile</button> {/* Button to edit profile */}
      <button onClick={GoBack}>Go Back</button> {/* Button to go back */}
      <button onClick={handleDeleteAccount} className="delete-button">
        Delete Account
      </button> {/* Button to delete account */}
    </div>
  );
}

export default ProfilePage; // Exporting the component
