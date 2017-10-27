'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../../bin/www');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/serverConfig');
chai.should();

chai.use(chaiHttp);

describe('auth service', () => {
  let decoded, email, token, user;
  function deleteDb() {
    return mongoose.connection.db.dropDatabase();
  }
  function createUser() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password()
    };
  }
  //setup
  before(() => {
    return runServer();
  });
  after(() => {
    return closeServer();
  });
  beforeEach(done => {
    user = createUser();
    chai.request(app)
      .post('/users')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .send(user)
      .then(res => {
        res.should.have.status(201);
        done();
      });
      ({email} = user);
      token = jwt.sign(
      {user: {email}},
        JWT_SECRET,
        {algorithm: 'HS256', subject: 'email', expiresIn: '7d'}
);
      decoded = jwt.decode(token);
  });
  afterEach(() => {
    token = {};
    // decoded = {};
    return deleteDb();
  });
  it('should not allow user to login', () => {
    return chai.request(app)
      .post('/login')
      .catch(err => {
        err.status.should.equal(404);
      });
  });
  it('should allow user to login', () => {
    return chai.request(app)
      .post('/auth/login')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .auth(user.email, user.password)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        const resToken = res.body.authToken;
        resToken.should.be.a('string');
        const payload = jwt.verify(resToken, JWT_SECRET, {algorithm: ['HS256']});
        payload.user.email.should.equal(email);
      });
  });
  it('should allow user to refresh their token', () => {
    return chai.request(app)
      .post('/auth/refresh')
      //set headers
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        const resToken = res.body.authToken;
        resToken.should.be.a('string');
        const payload = jwt.verify(resToken, JWT_SECRET, {algorithm: ['HS256']});
        payload.user.should.eql({email});
        payload.exp.should.be.at.least(decoded.exp);
      });
  });
});
