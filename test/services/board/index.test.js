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
  it('should get the boards data', (done) => {
    //setup a request
    chai.request(app)
      //request to /boards
      .get('/boards')
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
        res.body.data[0].cardsList[0].should.have.property('cards');
        res.body.data[0].cardsList[0].cards.should.be.a('array');
        res.body.data[0].cardsList[0].cards[0].should.have.property('text');
        done();
      });
  });
});
