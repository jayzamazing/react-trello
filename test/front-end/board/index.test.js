'use strict';
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var should = chai.should();

var Board = require('../../../public/js/board');
var List = require('../../../public/js/list');
describe('Board component', function() {
    var boardItem = {};
    beforeEach((done) => {
      boardItem =
          {   'board_name': 'super board',
              
              '_id': 1,
              'title': 'blah',
              'cardsList': [{
                  '_id': 1,
                  'title': 'something',
                  'cards': [{
                      '_id': 1,
                      'text': 'ummmm'
                  }, {
                      '_id': 2,
                      'text': 'food'
                  }]
              }, {
                  '_id': 2,
                  'title': 'hungry',
                  'cards': [{
                      '_id': 3,
                      'text': 'special'
                  }, {
                      '_id': 4,
                      'text': 'taco'
                  }]
              }]
          };
      done();
    });
    afterEach((done) => {
      boardItem = {};
      done();
    });
    it('Renders the board item', function() {
        //create instance of render
        var renderer = TestUtils.createRenderer();
        //render an image component
        renderer.render(<Board.Board title={boardItem.title} cardsList={boardItem.cardsList} />);
        // //get the rendered react component to test against
        // var board = renderer.getRenderOutput();
        // // console.log(result);
        // board.type.should.equal('div');
        // board.props.className.should.equal('board');
        // var board_name = board.props.children[0];
        // board_name.type.should.equal('div');
        // board_name.props.className.should.equal('board-name');
        // var h1_0 = board_name.props.children;
        // h1_0.type.should.equal('h1');
        // h1_0.props.children.should.equal('blah');
        // var board_list = board.props.children[1];
        // board_list.type.should.equal('div');
        // board_list.props.className.should.equal('board-list')
        // var listContainer = board_list.props.children[0];
        // listContainer.type.should.shallowDeepEqual(List.ListContainer);
        // listContainer.props.title.should.equal('everything');
        // listContainer.props.cards[0].text.should.equal('is');
    });
});
