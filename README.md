# Mystery Image Revealer App

link to web app:

https://frontend1-h5py.onrender.com/

## Overview
**Mystery Image Revealer App**

This is a visual timer application (react) that allows users to enter a timer length and an mystery image is gradually revealed as the timer winds down. 

This application allows users to sign up or log in and then manage timers for various tasks. After authentication, users are redirected to the main Timer Component page where they can:

	•	Start, stop, and reset timers.
	•	View and edit their profile.
	•	Delete their account.
	•	Sign out securely.

Users start with a free trial that allows them to create 5 timers of unlimited length. After the trial period ends, they are limited to creating timers that are 1 minute or less. The app uses token-based authentication (JWT) to manage user sessions, and all user data is securely handled via the backend.

## Features
- **Mystery Image Display**: An image is obscured by a black overlay.
- **User-Input Timer**: Users can set a timer, and the image will gradually be revealed as time progresses.
- **Timer Limitations**: Users are limited to five timers longer than one minute during the trial period.
- **Payment Integration**: Users can subscribe to continue using timers longer than one minute after the trial period.
- **Thorough Documentation**: All parts of the application are thoroughly documented for ease of use and understanding.

## Technology Stack
- **Frontend**:
  - **React**: For building user interfaces.
  - **Axios**: For making HTTP requests.
  - **Howler**: For audio management.
- **Backend**:
  - **Node.js**: For server-side scripting.
  - **Express**: For building the RESTful API.
  - **MongoDB**: For the database to store user information and settings.
  - **Mongoose**: For object data modeling (ODM) with MongoDB.
- **Authentication**:
  - **JWT (JSON Web Tokens)**: For user authentication.
  - **bcrypt**: For hashing passwords.
- **CORS**: For enabling cross-origin resource sharing.

## Installation
- A sample .env file is included. You will need to create a secret password and ensure that the ports are configured correctly.
- Port configurations may also need to be updated in api.jsx depending on your default settings.
