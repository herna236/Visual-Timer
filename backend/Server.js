const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Setting the port from environment variable or default to 5000

// Use CORS middleware to allow requests from different origins
app.use(cors());
app.use(express.json()); // Middleware to parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) //line is outdated causing a message in console
  .then(() => console.log('MongoDB connected')) // Log connection success
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Middleware to authenticate the user
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
  if (!token) return res.status(401).send('Access denied. No token provided.'); // Check if token exists

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).send('User not found'); // Check if user exists
    next();
  } catch (error) {
    res.status(403).send('Invalid token.');
  }
};


app.post('/register', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from request body

  try {
    const existingUser = await User.findOne({ email }); // Check if user already exists
    if (existingUser) return res.status(400).send({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const user = new User({ // Create a new user
      email,
      password: hashedPassword,
      numberOfTimersStarted: 0,
      trialPeriodOver: false,
      hasPaid: false
    });

    await user.save(); // Save the new user to the database

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate a JWT token
    res.json({ token, userId: user._id }); // Respond with token and user ID

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).send({ message: 'Error registering user: ' + error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password); // Compare provided password with stored hash
    if (!isMatch) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token
    res.json({ token, userId: user._id }); // Respond with token and user ID
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(400).send('Error logging in: ' + error.message);
  }
});


app.get('/profile', authenticate, (req, res) => {
  // Respond with user details
  res.json({
    email: req.user.email,
    numberOfTimersStarted: req.user.numberOfTimersStarted,
    trialPeriodOver: req.user.trialPeriodOver,
    hasPaid: req.user.hasPaid
  });
});


app.put('/edit-profile', authenticate, async (req, res) => {
  console.log('Edit profile route hit');
  const { newEmail } = req.body; // Destructure new email from request body

  try {
    // Validate email
    if (!newEmail || !validateEmail(newEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // User ID from the token
      { email: newEmail }, // New email value
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Email updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
  return re.test(String(email).toLowerCase()); // Test email format
};


app.get('/user-email', authenticate, (req, res) => {
  res.json({ email: req.user.email });
});


app.delete('/delete-account', authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id); // Delete user by ID
    res.status(200).send('User account deleted successfully');
  } catch (error) {
    res.status(400).send('Error deleting user account: ' + error.message);
  }
});


app.get('/user-status/:userId', authenticate, async (req, res) => {
  const { userId } = req.params; // Get user ID from route parameters

  try {
    const user = await User.findById(userId); // Find user by ID
    if (!user) return res.status(400).send('User not found');

    res.json({
      trialPeriodOver: user.trialPeriodOver,
      numberOfTimersStarted: user.numberOfTimersStarted,
      hasPaid: user.hasPaid
    });
  } catch (error) {
    res.status(400).send('Error fetching user status: ' + error.message);
  }
});


app.post('/start-timer', authenticate, async (req, res) => {
  const userId = req.user._id; // Get user ID from token

  try {
    const user = await User.findById(userId); // Find user by ID
    if (!user) return res.status(400).send('User not found');

    user.numberOfTimersStarted += 1; // Increment timers started count

    if (user.numberOfTimersStarted >= 5) {
      user.trialPeriodOver = true; // Mark trial period as over after 5 timers
    }

    await user.save(); // Save user updates
    res.status(200).send('Timer started');
  } catch (error) {
    res.status(400).send('Error starting timer: ' + error.message);
  }
});


if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`); // Log server start
  });
}

module.exports = app;
