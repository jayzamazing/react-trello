'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
chai.should();

chai.use(chaiHttp);

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
describe('auth service', () => {
  //setup
  before(() => {
    return runServer(DATABASE_URL);
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
  describe('user auth', () => {
    it('should not allow user to login', done => {
      chai.request(app)
        .get('/login')
        .catch((err) => {
          err.status.should.equal(401);
          done();
        });
    });
    it('should allow user to login', done => {
      chai.request(app)
        .get('/login')
        //set headers
        .set('Accept', 'application/json')
        //send the following data
        .auth(user.email, user.password)
        .then((res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
