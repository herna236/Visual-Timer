import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import api from './api/axiosConfig'; // Import the configured API instance
import { useNavigate } from 'react-router-dom'; // Import navigation hook from React Router
import './EditProfilePage.css'; // Import CSS styles for this component

function EditProfilePage() {
  // State variables for managing email, error messages, and success messages
  const [email, setEmail] = useState(''); // Current user's email
  const [newEmail, setNewEmail] = useState(''); // New email to be set
  const [error, setError] = useState(''); // Error messages
  const [successMessage, setSuccessMessage] = useState(''); // Success messages
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    // Fetch user email on component mount
    const fetchUserEmail = async () => {
      try {
        // Make a GET request to retrieve the user's email
        const response = await api.get('/user-email', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Include token for authorization
          }
        });
        // Set the current and new email to the fetched email
        setEmail(response.data.email);
        setNewEmail(response.data.email);
      } catch (err) {
        console.error('Error fetching user email:', err); // Log any errors
        setError('Failed to load user email.'); // Set error message
      }
    };

    fetchUserEmail(); // Call the function to fetch user email
  }, []); // Empty dependency array means this runs only on mount

  // Handler for updating new email state as the user types
  const handleEmailChange = (e) => {
    setNewEmail(e.target.value); // Update newEmail state with input value
  };

  // Handler for updating the user's email
  const handleEditProfile = async () => {
    try {
      // Make a PUT request to update the email
      const response = await api.put('/edit-profile', { newEmail }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include token for authorization
        }
      });
      setEmail(response.data.user.email); // Update current email state
      setSuccessMessage('Email updated successfully!'); // Set success message
      setError(''); // Clear any existing error message
    } catch (err) {
      console.error('Error updating email:', err); // Log any errors
      setError('Failed to update email.'); // Set error message
      setSuccessMessage(''); // Clear success message on error
    }
  };

  // Handler for deleting the user account
  const handleDeleteAccount = async () => {
    try {
      // Make a DELETE request to delete the account
      await api.delete('/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include token for authorization
        }
      });
      // Clear token and userId from local storage upon deletion
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      // Set success message for account deletion
      setSuccessMessage(`${email} was successfully deleted`);

      // Navigate to the landing page after a brief delay
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Error deleting account:', err); // Log any errors
      setError('Failed to delete account.'); // Set error message
    }
  };

  // Handler for going back to the timer control page
  const GoBack = () => {
    navigate('/timer-control'); // Navigate to timer control page
  };

  return (
    <div className="edit-profile-container"> {/* Container for the profile editing UI */}
      <h1>Edit Profile</h1>
      {error && <p className="error">{error}</p>} {/* Display error message if exists */}
      {successMessage && <p className="success">{successMessage}</p>} {/* Display success message if exists */}
      <div>
        <p>Current Email: <span className="email-highlight">{email}</span></p> {/* Show current email */}
        <input
          type="email" // Email input field
          placeholder="Enter new email" // Placeholder text
          value={newEmail} // Controlled input for new email
          onChange={handleEmailChange} // Update new email on change
        />
      </div>
      <button onClick={handleEditProfile}>Update Email</button> {/* Button to update email */}
      <button onClick={handleDeleteAccount} className="delete-button">
        Delete Account {/* Button to delete account */}
      </button>
      <button onClick={GoBack}>Go Back</button> {/* Button to go back to timer control */}
    </div>
  );
}

export default EditProfilePage; // Export the component for use in other parts of the app
