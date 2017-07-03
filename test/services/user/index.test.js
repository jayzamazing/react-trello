'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import userModel from '../../../src/models/users';
const should = chai.should();

chai.use(chaiHttp);

// function seedUserData() {
//   console.info('seeding user data');
//   const seedData = [];
//   //iterate and create store user data in array
//   for (let i = 0; i < 10; i++) {
//     seedData.push(generateUserData());
//   }
//   //insert all the generated users
//   return userModel.insertMany(seedData);
// }
// function generateUserData() {
//   return {
//     email: faker.internet.email(),
//     password: faker.internet.password()
//   }
// }
describe('user service', () => {
  //setup
  before(() => {
    return runServer();
    });
  after(() => {
    return closeServer();
  });
  describe('create user', () => {
    after(() => {

    });
    it('should post cards data', done => {
      chai.request(app)
        //request to /cards
        .post('/users')
        //set headers
        .set('Accept', 'application/json')
        //send the following data
        .send({
          email: 'blah@testemail.com',
          password: 'kablah'
        })
        .then((res) => {
          console.log(res);
          done();
        });
    });
  });
});
