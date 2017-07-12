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
describe('boards service', () => {
  let user;
  let agent;
  //setup
  before(() => {
    return runServer(DATABASE_URL);
  });
  after(() => {
    return closeServer();
  });
  beforeEach(() => {
    user = createUser();
    return chai.request(app)
      .post('/users')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .send(user);
  });
  afterEach(() => {
    return deleteDb();
  });
  it('should not create a board, not auth redirects to /', () => {
    agent = chai.request.agent(app);
    return agent
      .post('/boards')
      //set headers
      .set('Accept', 'application/json')
      .set('X-Forwarded-For', '127.0.0.1:49180')
      .send({title: 'grocery list'})
      .then((res) => {
        res.should.redirect;
      });
  });
  it('should create a board', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(user.email, user.password)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        post('/boards')
        //set headers
        .set('Accept', 'application/json')
        .send({title: 'grocery list'})
        .then((res) => {
          res.body.should.have.property('title');
          res.body.title.should.equal('grocery list');
          res.body.should.have.property('cardsList');
          res.body.cardsList.should.be.a('array');
          res.body.cardsList.should.eql([]);
        });
      });
  });
});
