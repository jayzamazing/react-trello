'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
var authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
var token, id;
//config for app to do authentication
app
.use(bodyParser.json())
.use(bodyParser.urlencoded({
  extended: true
}))
.configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
chai.should();
/*
* All tests that should be run
*/
describe('user service', function() {
//setup
  before((done) => {
//start the server
    this.server = app.listen(3030);
    this.server.once('listening', () => {
      done();
    });
  });
// teardown after tests
  after((done) => {
//setup a request to get authentication token
    chai.request(app)
//request to /auth/local
.post('/auth/local')
//set header
.set('Accept', 'application/json')
//send credentials
.send({
  'email': 'blah',
  'password': 'kablah'
})
//when finished
.then((res) => {
//set token for auth in other requests
  token = res.body.token;
}).then(() => {
  chai.request(app)
//request to /auth/local
.delete('/users/' + id)
//set header
.set('Accept', 'application/json')
//send credentials
.set('Authorization', 'Bearer '.concat(token)).then(() => {
  done();
});
});
  });
  it('registered the users service', () => {
    assert.ok(app.service('users'));
  });
//test for post for /users to add user to mongodb
  it('should post the user data', function(done) {
//setup a request
    chai.request(app)
//request to /store
.post('/users')
.set('Accept', 'application/json')
//attach data to request
.send({
  email: 'blah',
  password: 'kablah'
})
//when finished do the following
.end(function(err, res) {
//check to see how many dinners were created under the table
  res.should.have.status(201);
  res.body.email.should.be.a('string');
  res.body.email.should.equal('blah');
  id = res.body._id;
  done();
});
  });
});
