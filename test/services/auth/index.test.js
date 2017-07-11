'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import { PORT } from '../../../src/config';
chai.should();

chai.use(chaiHttp);


describe('auth service', () => {
  let user;
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
  beforeEach((done) => {
    user = createUser();
    chai.request(app)
      .post('/users')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .send(user)
      .then((res) => {
        res.should.have.status(201);
        done();
      });
  });
  afterEach(() => {
    return deleteDb();
  });
  it('should not allow user to login', () => {
    return chai.request(app)
      .post('/login')
      .catch((err) => {
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
      .then((res) => {
        res.should.have.status(200);
      });
  });
  it('should allow user to logout', () => {
    return chai.request(app)
      .post('/auth/logout')
      //set headers
      .set('Accept', 'application/json')
      .then((res) => {
        res.should.have.status(200);
      });
  });
});
