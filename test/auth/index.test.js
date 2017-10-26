'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../../bin/www');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/ServerConfig');
chai.should();

chai.use(chaiHttp);

describe('auth service', () => {
  let token, user;
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
      const email = user.email;
      token = jwt.sign(
         {
             user: {
                 email
             }
         },
         JWT_SECRET,
         {
             algorithm: 'HS256',
             subject: email,
             expiresIn: '7d'
         }
     );
      // decoded = jwt.decode(token);
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
  it.only('should allow user to login', () => {
    return chai.request(app)
      .post('/auth/login')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .auth(user.email, user.password)
      .then(res => {
        res.should.have.status(200);
      });
  });
  it('should allow user to logout', () => {
    console.log('token');
    console.log(token);
    return chai.request(app)
      .post('/auth/logout')
      //set headers
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an.object;
      });
  });
});
