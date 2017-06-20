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
var Board = server.service('boards');
var CardsList = server.service('cardslists');
var Cards = server.service('cards');
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
describe('board service', function() {
//setup
  before((done) => {
    //start the server
    this.server = server.listen(3030);
    this.server.once('listening', () => {
      //create a user
      User.create({
        email: 'blah',
        password: 'kablah'
      }).then((res) => {
          //store user id
          id = res._id;
          done();
      });
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
  beforeEach(done => {
    app.authenticate({
      email: 'blah',
      password: 'kablah',
      type: 'local'
    }).then((res) => {
      // console.log(res);
      // Cards.create({
      //   'text': 'ummmm'
      // }, (err, data) => {
      //   var temp = [];
      //   temp.push(data.id);
      //   CardsList.create({
      //     title: 'something',
      //     cards: temp
      //   }, (err2, data2) => {
      //     var temp2 = [];
      //     temp2.push(data2);
      //     Board.create({
      //       title: 'blah',
      //       cardsList: temp2
      //     }, () => {
      //       done();
      //     });
      //   });
      // });
          Board.create({
            title: 'blah',
          }).then((res2) => {
            // console.log(res2);
            done();
          }).catch((err) => {
              // console.log(err);
            }
          );
    }).catch((err3) => {
      // console.error(err3);
    });

  });
  afterEach((done) => {
    // delete contents of menu in mongodb
    // Cards.remove(null, () => {
    //   CardsList.remove(null, () => {
    //     Board.remove(null, () => {
          done();
    //     });
    //   });
    // });
  });
  it.only('registered the boards service', () => {
    assert.ok(app.service('boards'));
  });
  //check get request if all fields are filled
  it('should get the boards data', function(done) {
    // app.authenticate({
    //   email: 'blah',
    //   password: 'kablah',
    //   type: local
    // }).then(() => {
      done();
    // });
  });
});
