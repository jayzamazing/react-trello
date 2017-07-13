'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
// import {Board} from '../../../src/models/boards';
import {User} from '../../../src/models/users';
chai.should();

chai.use(chaiHttp);
let users;
//used to delete the database
function deleteDb() {
  return mongoose.connection.db.dropDatabase();
}
//Create a user, hash password, and keep track of original password
function createUser() {
  let password = faker.internet.password();
  return User.hashPassword(password)
  .then((hash) => {
    return {
      email: faker.internet.email(),
      password: hash,
      unhashed: password
    };
  });
}
//create multiple users
function createUsers() {
  const seedData = [];
  for (let i = 0; i <= 9; i++) {
    seedData.push(createUser());
  }
  //wait for all the hashpassword promises to finish before performing insert many
  return Promise.all(seedData)
  .then((seed) => {
    users = seed;
    return User.insertMany(seed);
  });
}
// function seedTitleData() {
//   const seedData = [];
//   return {
//     title: faker.random.words
//   }
// }
describe('boards service', () => {
  let agent;
  //setup
  before(() => {
    return runServer(DATABASE_URL);
  });
  after(() => {
    return closeServer();
  });
  beforeEach(() => {
    return createUsers();
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
      .send({title: 'grocery list'})
      .then((res) => {
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
      });
  });
  it('should create a board', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
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
