'use strict';

const assert = require('assert');
const app = require('../../../src/app');
var chai = require('chai');
var chaiHttp = require('chai-http');
var Board = app.service('boards');
var CardsList = app.service('cardslists');
var Cards = app.service('cards');
const bodyParser = require('body-parser');
//use http plugin
chai.use(chaiHttp);
chai.should();
//configure app
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }));
/*
 * All tests that should be run
 */
describe('board service', function() {
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
      done();
    });
  });
  after((done) => {
    //stop the server
    this.server.close(() => {
      done();
    });
  });
  beforeEach(done => {
    Cards.create({
      'text': 'ummmm'
    }, (err, data) => {
      var temp = [];
      temp.push(data.id);
      CardsList.create({
        title: 'something',
        cards: temp
      }, (err2, data2) => {
        var temp2 = [];
        temp2.push(data2);
        Board.create({
          title: 'blah',
          cardsList: temp2
        }, () => {
          done();
        });
      });
    });
  });
  afterEach((done) => {
    //delete contents of menu in mongodb
    Cards.remove(null, () => {
      CardsList.remove(null, () => {
        Board.remove(null, () => {
          done();
        });
      });
    });
  });
  it('registered the boards service', () => {
    assert.ok(app.service('boards'));
  });
  //check get request if all fields are filled
  it('should get the boards data', (done) => {
    //setup a request
    chai.request(app)
      //request to /boards
      .get('/boards')
      //set headers
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //check server response
        res.status.should.equal(200);
        //check expected results
        res.body.data[0].should.have.property('title');
        res.body.data[0].title.should.equal('blah');
        res.body.data[0].should.have.property('cardsList');
        res.body.data[0].cardsList.should.be.a('array');
        res.body.data[0].cardsList[0].should.have.property('title');
        res.body.data[0].cardsList[0].title.should.equal('something');
        res.body.data[0].cardsList[0].should.have.property('cards');
        res.body.data[0].cardsList[0].cards.should.be.a('array');
        res.body.data[0].cardsList[0].cards[0].should.have.property('text');
        res.body.data[0].cardsList[0].cards[0].text.should.equal('ummmm');
        done();
      });
  });
  //check post request
  it('should post boards data', done => {
    //setup a request
    chai.request(app)
    //post to /boards
    .post('/boards')
    //set headers
    .set('Accept', 'application/json')
    //send the following data
    .send({
      title: 'shopping list'
    })
    //when finished do the following
    .end((err, res) => {
      res.body.should.have.property('title');
      res.body.title.should.equal('shopping list');
      done();
    });
  });
  //check update request
  it('should update the boards data', function(done) {
    chai.request(app)
      //request to /boards
      .get('/boards')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /boards
          .put('/boards/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //attach data to request
          .send({
            title: 'shopping list'
          })
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('title');
            res.body.title.should.equal('shopping list');
            //ensure that cardslist is empty
            res.body.should.have.property('cardsList')
            .to.include.members([]);
            done();
          });
      });
  });
  //check patch request
  it('should patch the boards data', function(done) {
    chai.request(app)
      //request to /boards
      .get('/boards')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /boards
          .patch('/boards/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //attach data to request
          .send({
            title: 'shopping list'
          })
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('title');
            res.body.title.should.equal('shopping list');
            res.body.should.have.property('cardsList');
            res.body.cardsList.should.be.a('array');
            res.body.cardsList[0].should.have.property('title');
            res.body.cardsList[0].should.have.property('cards');
            res.body.cardsList[0].cards.should.be.a('array');
            res.body.cardsList[0].cards[0].should.have.property('text');
            res.body.cardsList[0].cards[0].text.should.equal('ummmm');
            done();
          });
      });
  });
  //check delete request
  it('should delete the guest data', function(done) {
    chai.request(app)
      //request to /boards
      .get('/boards')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /boards
          .delete('/boards/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('title');
            res.body.title.should.equal('blah');
            res.body.should.have.property('cardsList');
            res.body.cardsList.should.be.a('array');
            res.body.cardsList[0].should.have.property('title');
            res.body.cardsList[0].title.should.equal('something');
            res.body.cardsList[0].should.have.property('cards');
            res.body.cardsList[0].cards.should.be.a('array');
            res.body.cardsList[0].cards[0].should.have.property('text');
            res.body.cardsList[0].cards[0].text.should.equal('ummmm');
            done();
          });
      });
  });
});
