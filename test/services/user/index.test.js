'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {app, runServer, closeServer} from '../../../src/app';
const should = chai.should();

chai.use(chaiHttp);

describe('user service', () => {
//setup
  before(() => {
    return runServer()
    .then(() => {
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
        //when finished do the following
        .end((err, res) => {

        });
    });
  });
  after(() => {
    return closeServer();
  });
  it('should post cards data', done => {
    console.log('ha');
    done();
  });
});
