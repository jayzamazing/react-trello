'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
const should = chai.should();

chai.use(chaiHttp);


function deleteDb() {
  return mongoose.connection.db.dropDatabase();
}
function createUser() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}
describe('auth service', () => {
  //setup
  before(() => {
    return runServer(DATABASE_URL);
    });
  after(() => {
    return closeServer();
  });
  beforeEach(() => {

  });
  afterEach(() => {
    return deleteDb();
  });
  describe('user auth', () => {
    let user = createUser();
    before((done) => {
      chai.request(app)
        .post('/users')
        //set headers
        .set('Accept', 'application/json')
        //send the following data
        .send(user)
        .then((res) => {
          res.should.have.status(201);
          done();
        })
        .catch((err) => {
          // console.error(err);
          done();
        });
    });
    it('should not allow user to access endpoint', done => {
      chai.request(app)
        .get('/login')
        .catch((err) => {
          err.status.should.equal(401);
          done();
        });
    });
    it('should allow user to access endpoint', done => {
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
