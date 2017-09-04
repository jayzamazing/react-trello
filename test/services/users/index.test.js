'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
chai.should();

chai.use(chaiHttp);

function deleteDb() {
  return mongoose.connection.db.dropDatabase();
}
function createUser() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  };
}
describe('user service', () => {

  //setup
  before(() => {
    return runServer(DATABASE_URL);
  });
  after(() => {
    return closeServer();
  });
  afterEach(() => {
    return deleteDb();
  });
  it('should create a user', done => {
    let user = createUser();
    chai.request(app)
      //request to /cards
      .post('/users')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .send(user)
      .then((res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.include.keys('email', 'createdAt', 'updatedAt');
        res.body.email.should.equal(user.email);
        done();
      });
  });
});
