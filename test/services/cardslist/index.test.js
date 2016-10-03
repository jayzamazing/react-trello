'use strict';

const assert = require('assert');
const app = require('../../../src/app');

var chai = require('chai');
var chaiHttp = require('chai-http');
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
describe('cardslist service', function() {
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
      }, () => {
        done();
      });
    });
  });
  afterEach((done) => {
    //delete contents of menu in mongodb
    Cards.remove(null, () => {
      CardsList.remove(null, () => {
        done();
      });
    });
  });
  it('registered the cardslists service', () => {
    assert.ok(app.service('cardslists'));
  });
  //check get request if all fields are filled
  it('should get the cardslists data', (done) => {
    //setup a request
    chai.request(app)
      //request to /cardslists
      .get('/cardslists')
      //set headers
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //check server response
        res.status.should.equal(200);
        //check expected results
        res.body.data[0].should.have.property('title');
        res.body.data[0].title.should.equal('something');
        res.body.data[0].should.have.property('cards');
        res.body.data[0].cards.should.be.a('array');
        res.body.data[0].cards[0].should.have.property('text');
        res.body.data[0].cards[0].text.should.equal('ummmm');
        done();
      });
  });
  //check post request
  it('should post cardslists data', done => {
    //setup a request
    chai.request(app)
    //post to /cardslists
    .post('/cardslists')
    //set headers
    .set('Accept', 'application/json')
    //send the following data
    .send({
      title: 'walmart shopping list'
    })
    //when finished do the following
    .end((err, res) => {
      res.body.should.have.property('title');
      res.body.title.should.equal('walmart shopping list');
      done();
    });
  });
  //check update request
  it('should update the cardslists data', function(done) {
    chai.request(app)
      //request to /cardslists
      .get('/cardslists')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /cardslists
          .put('/cardslists/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //attach data to request
          .send({
            title: 'walmart shopping list'
          })
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('title');
            res.body.title.should.equal('walmart shopping list');
            //ensure that cardslist is empty
            res.body.should.have.property('cards')
            .to.include.members([]);
            done();
          });
      });
  });
  //check patch request
  it('should patch the cardslists data', function(done) {
    chai.request(app)
      //request to /cardslists
      .get('/cardslists')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /cardslists
          .patch('/cardslists/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //attach data to request
          .send({
            title: 'walmart shopping list'
          })
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('title');
            res.body.title.should.equal('walmart shopping list');
            res.body.should.have.property('cards');
            res.body.cards.should.be.a('array');
            res.body.cards[0].should.have.property('text');
            res.body.cards[0].text.should.equal('ummmm');
            done();
          });
      });
  });
  //check delete request
  it('should delete the guest data', function(done) {
    chai.request(app)
      //request to /cardslists
      .get('/cardslists')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /cardslists
          .delete('/cardslists/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('title');
            res.body.title.should.equal('something');
            res.body.should.have.property('cards');
            res.body.cards.should.be.a('array');
            res.body.cards[0].should.have.property('text');
            res.body.cards[0].text.should.equal('ummmm');
            done();
          });
      });
  });
});
