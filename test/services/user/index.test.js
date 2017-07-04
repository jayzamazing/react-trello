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
describe('user service', () => {
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
          console.log(res.body);
          done();
        })
        .catch((err) => {
          console.error(err);
          done();
        });
    });
  });
});
