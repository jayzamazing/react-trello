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

var token, userId, boardId;
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
var User = app.service('users');
var Board = app.service('boards');
var CardsList = app.service('cardslists');
var Cards = app.service('cards');
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
          userId = res._id;
          done();
      });
    });
  });
  //teardown after tests
  //teardown after tests
  after((done) => {
    app.authenticate({
      email: 'blah',
      password: 'kablah',
      type: 'local'
    }).then(() => {
      //delete user
      User.remove(userId)
      .then(() => {
        //stop the server
        this.server.close(() => {
          done();
        });
      })
    });
  });
  beforeEach(done => {
    app.authenticate({
      email: 'blah',
      password: 'kablah',
      type: 'local'
    })
    .then(() => {
      Board.create({
        title: 'blah'
      }).then((res) => {
        boardId = res._id;
        done();
      });
    })
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
            // done();
      //     });
      //   });
      // });

    // );

  });
  afterEach((done) => {
    //TODO
    app.authenticate({
      email: 'blah',
      password: 'kablah',
      type: 'local'
    })
    .then(() => {
      Board.remove(boardId)
      .then(() => {
        done();
      });
    });
    // delete contents of menu in mongodb
    // Cards.remove(null, () => {
    //   CardsList.remove(null, () => {
    //     Board.remove(null, () => {
          // done();
    //     });
    //   });
    // });
  });
  it.only('registered the boards service', () => {
    assert.ok(app.service('boards'));
  });
  //check get request if all fields are filled
  // it('should get the boards data', function(done) {
  //   app.authenticate({
  //     email: 'blah',
  //     password: 'kablah',
  //     type: local
  //   }).then(() => {
  //     Board.find()
  //     .then((res) => {
  //       //check server response
  //       res.status.should.equal(200);
  //       //check expected results
  //       res.body.data[0].should.have.property('title');
  //       res.body.data[0].title.should.equal('blah');
  //       res.body.data[0].should.have.property('cardsList');
  //       res.body.data[0].cardsList.should.be.a('array');
  //       res.body.data[0].cardsList[0].should.have.property('title');
  //       res.body.data[0].cardsList[0].title.should.equal('something');
  //       res.body.data[0].cardsList[0].should.have.property('cards');
  //       res.body.data[0].cardsList[0].cards.should.be.a('array');
  //       res.body.data[0].cardsList[0].cards[0].should.have.property('text');
  //       res.body.data[0].cardsList[0].cards[0].text.should.equal('ummmm');
  //       done();
  //     });
  //   });
  // });
});
