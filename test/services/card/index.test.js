'use strict';

const assert = require('assert');
const app = require('../../../src/app');
var chai = require('chai');
var chaiHttp = require('chai-http');
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
describe('card service', function() {
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
    }, () => {
      done();
    });
  });
  afterEach((done) => {
    //delete contents of menu in mongodb
    Cards.remove(null, () => {
      done();
    });
  });

  it('registered the cards service', () => {
    assert.ok(app.service('cards'));
  });
  //check get request if all fields are filled
  it('should get the cards data', (done) => {
    //setup a request
    chai.request(app)
      //request to /cards
      .get('/cards')
      //set headers
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //check server response
        res.status.should.equal(200);
        //check expected results
        res.body.data[0].should.have.property('text');
        res.body.data[0].text.should.equal('ummmm');
        done();
      });
  });
  //check post request
  it('should post cards data', done => {
    //setup a request
    chai.request(app)
    //post to /cards
    .post('/cards')
    //set headers
    .set('Accept', 'application/json')
    //send the following data
    .send({
      text: 'cookies'
    })
    //when finished do the following
    .end((err, res) => {
      res.body.should.have.property('text');
      res.body.text.should.equal('cookies');
      done();
    });
  });
  //check update request
  it('should update the cards data', function(done) {
    chai.request(app)
      //request to /cards
      .get('/cards')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /cards
          .put('/cards/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //attach data to request
          .send({
            text: 'milk'
          })
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('text');
            res.body.text.should.equal('milk');
            done();
          });
      });
  });
  //check patch request
  it('should patch the cards data', function(done) {
    chai.request(app)
      //request to /cards
      .get('/cards')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /cards
          .patch('/cards/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //attach data to request
          .send({
            text: 'chicken'
          })
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('text');
            res.body.text.should.equal('chicken');
            done();
          });
      });
  });
  //check delete request
  it('should delete the guest data', function(done) {
    chai.request(app)
      //request to /cards
      .get('/cards')
      .set('Accept', 'application/json')
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /cards
          .delete('/cards/' + res.body.data[0]._id)
          .set('Accept', 'application/json')
          //when finished do the following
          .end(function(err, res) {
            //check server response
            res.status.should.equal(200);
            //check expected results
            res.body.should.have.property('text');
            res.body.text.should.equal('ummmm');
            done();
          });
      });
  });
});
