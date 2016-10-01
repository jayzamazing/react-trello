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
  before(done => {
    //start the server
    this.server = app.listen(3030);
    this.server.once('listening', () => {
      Cards.create({
        'text': 'ummmm'
      }, (err, data) => {
        var temp = [];
        temp.push(data.id);
        CardsList.create({
          title: 'something',
          cards: [temp]
        }, (err2, data2) => {
          var temp2 = [];
          temp2.push(data2);
          Board.create({
            title: 'blah',
            cardsList: [temp2]
          }, () => {
            done();
          });
        });
      });
    });
  });
  after((done) => {
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
});
