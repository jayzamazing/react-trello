'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../../bin/www');
const {DATABASE_URL} = require('../../config/serverConfig');
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
    const user = createUser();
    chai.request(app)
      //request to /cards
      .post('/users')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .send(user)
      .then(res => {
        res.should.have.status(201);
        /* eslint-disable */
        res.should.be.json;
        /* eslint-enable */
        res.body.should.include.keys('email', 'createdAt', 'updatedAt');
        res.body.email.should.equal(user.email);
        done();
      });
  });
});
