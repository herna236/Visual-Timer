const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../Server.js');
const User = require('../models/User');

describe('User API', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('PUT /edit-profile', () => {
    it('should update the user email', async () => {
      const registerRes = await request(app).post('/register').send({
        email: 'update_test@example.com',
        password: 'password123',
      });

      const token = registerRes.body.token;
      const res = await request(app)
        .put('/edit-profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 'updated_email@example.com' });

      expect(res.status).to.equal(200);
      expect(res.body.user.email).to.equal('updated_email@example.com');
    });

    it('should return error for invalid email', async () => {
      const registerRes = await request(app).post('/register').send({
        email: 'error_test@example.com',
        password: 'password123',
      });

      const token = registerRes.body.token;
      const res = await request(app)
        .put('/edit-profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 'invalid-email' });

      expect(res.status).to.equal(400);
      expect(res.body.message).to.equal('Invalid email address');
    });
  });

  describe('DELETE /delete-account', () => {
    it('should delete the user account', async () => {
      const registerRes = await request(app).post('/register').send({
        email: 'delete_test@example.com',
        password: 'password123',
      });

      const token = registerRes.body.token;
      const res = await request(app)
        .delete('/delete-account')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.text).to.equal('User account deleted successfully');

      const findUser = await User.findOne({ email: 'delete_test@example.com' });
      expect(findUser).to.be.null;
    });
  });
   //test numberOfTimersStarted increments
   
  describe('POST /start-timer', () => {
    it('should increment the user\'s number of timers started', async () => {
      const registerRes = await request(app).post('/register').send({
        email: 'timer_test@example.com',
        password: 'password123',
      });

      const token = registerRes.body.token;
      await request(app).post('/start-timer').set('Authorization', `Bearer ${token}`);

      const user = await User.findOne({ email: 'timer_test@example.com' });
      expect(user.numberOfTimersStarted).to.equal(1);
    });
  });

  describe('GET /user-status/:userId', () => {
    it('should return the user\'s status', async () => {
      const registerRes = await request(app).post('/register').send({
        email: 'status_test@example.com',
        password: 'password123',
      });

      const token = registerRes.body.token;
      const userId = registerRes.body.userId;

      const res = await request(app)
        .get(`/user-status/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('trialPeriodOver', false);
      expect(res.body).to.have.property('numberOfTimersStarted', 0);
      expect(res.body).to.have.property('hasPaid', false);
    });

    //test for delete

    it('should return error if user does not exist', async () => {
      const registerRes = await request(app).post('/register').send({
        email: 'nonexistent_user@example.com',
        password: 'password123',
      });

      const token = registerRes.body.token;
      await User.deleteOne({ email: 'nonexistent_user@example.com' });

      const res = await request(app)
        .get('/user-status/invalidUserId')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(400);
      expect(res.text).to.equal('User not found');
    });
  });
});
