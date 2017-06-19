'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const server = require('../../../src/app');
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest/client';
import localstorage from 'feathers-localstorage';
import authentication from 'feathers-authentication/client';
import superagent from 'superagent';
const bodyParser = require('body-parser');
var User = server.service('users');
var token, id;
//use http plugin
chai.use(chaiHttp);
//use should
chai.should();
server
.use(bodyParser.json())
.use(bodyParser.urlencoded({
  extended: true
}));
var host = 'http://localhost:3030';
var app = feathers()
    .configure(rest(host).superagent(superagent))
    .configure(hooks())
    .configure(authentication({ storage: window.localStorage }));

/*
* All tests that should be run
*/
describe('user service', function() {
//setup
  before((done) => {
    //start the server
    this.server = server.listen(3030);
    this.server.once('listening', () => {
      done();
    });
  });
  //teardown after tests
  after((done) => {
    //stop the server
    this.server.close(() => {
      //delete user
      User.remove(id)
      .then(() => {
        done();
      })
    });
  });
  it('registered the users service', () => {
    assert.ok(app.service('users'));
  });
  //test for post for /users to add user to mongodb
  it('should post the user data', function(done) {
    //create a user
    User.create({
      email: 'blah',
      password: 'kablah'
    }).then((res) => {
        //store user id
        id = res._id;
        done();
    })
  });
});
