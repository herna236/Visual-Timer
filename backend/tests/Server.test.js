const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../path/to/your/app'); // Adjust the path to your app
const User = require('../models/User'); // Adjust the path to your User model

describe('User API', () => {
  before(async () => {
    // Connect to MongoDB before tests
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    // Clear the database after tests
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('userId');
    });

    it('should return an error for existing user', async () => {
      await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('User already exists');
    });
  });

  describe('POST /login', () => {
    it('should login an existing user', async () => {
      await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('userId');
    });

    it('should return an error for invalid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).to.equal(400);
      expect(res.text).to.equal('Invalid credentials');
    });
  });

  describe('GET /profile', () => {
    it('should get the user profile', async () => {
      const registerRes = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const token = registerRes.body.token;

      const res = await request(app)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('email', 'test@example.com');
    });

    it('should return an error if not authenticated', async () => {
      const res = await request(app)
        .get('/profile');

      expect(res.status).to.equal(401);
      expect(res.text).to.equal('Access denied. No token provided.');
    });
  });

  // Add more tests for the other endpoints (edit-profile, delete-account, etc.)
});
