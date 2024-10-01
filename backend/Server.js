const express = require('express'); // Importing Express framework
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB object modeling
const cors = require('cors'); // Importing CORS middleware for cross-origin requests
const User = require('./models/User'); // Importing the User model
const jwt = require('jsonwebtoken'); // Importing JSON Web Token library for authentication
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing
require('dotenv').config(); // Load environment variables from .env file

const app = express(); // Creating an Express application
const port = process.env.PORT || 5000; // Setting the port from environment variable or default to 5000

// Use CORS middleware to allow requests from different origins
app.use(cors());
app.use(express.json()); // Middleware to parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //line is outdated causing a message in console
  .then(() => console.log('MongoDB connected')) // Log connection success
  .catch(err => console.log('Error connecting to MongoDB:', err)); // Log any connection errors

// Middleware to authenticate the user
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  if (!token) return res.status(401).send('Access denied. No token provided.'); // Check if token exists

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = await User.findById(decoded.id); // Find user by ID in token
    if (!req.user) return res.status(401).send('User not found'); // Check if user exists
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    res.status(403).send('Invalid token.'); // Handle token verification failure
  }
};

// User Registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from request body

  try {
    const existingUser = await User.findOne({ email }); // Check if user already exists
    if (existingUser) return res.status(400).send({ message: 'User already exists' }); // Handle existing user

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = new User({ // Create a new user instance
      email,
      password: hashedPassword,
      numberOfTimersStarted: 0, // Initialize timers started
      trialPeriodOver: false, // Initialize trial period status
      hasPaid: false // Initialize payment status
    });

    await user.save(); // Save the new user to the database

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a JWT token
    res.json({ token, userId: user._id }); // Respond with token and user ID

  } catch (error) {
    console.error('Error registering user:', error); // Log registration error
    res.status(400).send({ message: 'Error registering user: ' + error.message }); // Respond with error message
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) return res.status(400).send('User not found'); // Handle non-existing user

    const isMatch = await bcrypt.compare(password, user.password); // Compare provided password with stored hash
    if (!isMatch) return res.status(400).send('Invalid credentials'); // Handle password mismatch

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token
    res.json({ token, userId: user._id }); // Respond with token and user ID
  } catch (error) {
    console.error('Error logging in:', error); // Log login error
    res.status(400).send('Error logging in: ' + error.message); // Respond with error message
  }
});

// Get User Profile
app.get('/profile', authenticate, (req, res) => {
  // Respond with user details
  res.json({
    email: req.user.email,
    numberOfTimersStarted: req.user.numberOfTimersStarted,
    trialPeriodOver: req.user.trialPeriodOver,
    hasPaid: req.user.hasPaid
  });
});

// Edit User Profile
app.put('/edit-profile', authenticate, async (req, res) => {
  console.log('Edit profile route hit'); // Log route access
  const { newEmail } = req.body; // Destructure new email from request body

  try {
    // Validate email
    if (!newEmail || !validateEmail(newEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // User ID from the token
      { email: newEmail }, // New email value
      { new: true, runValidators: true } // Return updated document and run validators
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' }); // Handle non-existing user
    }

    res.status(200).json({ message: 'Email updated successfully', user: updatedUser }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: 'Server error', error }); // Handle server errors
  }
});

// Email validation function
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
  return re.test(String(email).toLowerCase()); // Test email format
};

// Get User Email
app.get('/user-email', authenticate, (req, res) => {
  res.json({ email: req.user.email }); // Respond with user's email
});

// Delete User Account
app.delete('/delete-account', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id); // Delete user by ID
    res.status(200).send('User account deleted successfully'); // Respond with success message
  } catch (error) {
    res.status(400).send('Error deleting user account: ' + error.message); // Handle errors
  }
});

// User Status
app.get('/user-status/:userId', authenticate, async (req, res) => {
  const { userId } = req.params; // Get user ID from route parameters

  try {
    const user = await User.findById(userId); // Find user by ID
    if (!user) return res.status(400).send('User not found'); // Handle non-existing user

    res.json({
      trialPeriodOver: user.trialPeriodOver,
      numberOfTimersStarted: user.numberOfTimersStarted,
      hasPaid: user.hasPaid
    }); // Respond with user status
  } catch (error) {
    res.status(400).send('Error fetching user status: ' + error.message); // Handle errors
  }
});

// Start Timer
app.post('/start-timer', authenticate, async (req, res) => {
  const userId = req.user._id; // Get user ID from token

  try {
    const user = await User.findById(userId); // Find user by ID
    if (!user) return res.status(400).send('User not found'); // Handle non-existing user

    user.numberOfTimersStarted += 1; // Increment timers started count

    if (user.numberOfTimersStarted >= 5) {
      user.trialPeriodOver = true; // Mark trial period as over after 5 timers
    }

    await user.save(); // Save user updates
    res.status(200).send('Timer started'); // Respond with success message
  } catch (error) {
    res.status(400).send('Error starting timer: ' + error.message); // Handle errors
  }
});

// Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Log server start
  });
}

module.exports = app;
