var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var should = chai.should();

var Board = require('../public/js/board');
var List = require('../public/js/list');
describe('Board component', function() {
    it('Renders the board item', function() {
        var boardItem = {
            title: 'blah',
            cardsList: [{
                title: 'everything',
                cards: [{
                    text: 'is'
                }, {
                    text: 'code'
                }]
            }, {
                title: 'starving',
                cards: [{
                    text: 'hamburger'
                }, {
                    text: 'sauce'
                }]
            }]
        };
        //create instance of render
        var renderer = TestUtils.createRenderer();
        //render an image component
        renderer.render(<Board title={boardItem.title} cardsList={boardItem.cards} />);
        //get the rendered react component to test against
        var board = renderer.getRenderOutput();
        // console.log(result);
        board.type.should.equal('div');
        board.props.className.should.equal('board');
        var board_name = board.props.children[0];
        board_name.type.should.equal('div');
        board_name.props.className.should.equal('board-name');
        var h1_0 = board_name.props.children;
        h1_0.type.should.equal('h1');
        h1_0.props.children.should.equal('blah');
        var board_list = board.props.children[1];
        board_list.type.should.equal('div');
        board_list.props.className.should.equal('board-list')
        var listContainer = board_list.props.children[0];
        listContainer.type.should.shallowDeepEqual(List.ListContainer);
        listContainer.props.title.should.equal('something');
        listContainer.props.cards[0].text.should.equal('ummmm');

    });
});
