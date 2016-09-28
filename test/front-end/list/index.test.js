var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var should = chai.should();

var List = require('../../../public/js/list');

describe('List component', function() {
    it('Renders the list item', function() {
        var listItem = {
            _id: 1,
            boardId: 1,
            title: 'something',
            cards:
               { '1': { _id: 1, text: 'ummmm' },
                 '2': { _id: 2, text: 'food' },
                 '3': { _id: 3, text: 'special' },
                 '4': { _id: 4, text: 'taco' },
                 '5': { _id: 5, text: 'apple' },
                 '6': { _id: 6, text: 'pie' },
                 '7': { _id: 7, text: 'pants' },
                 '8': { _id: 8, text: 'shirt' } }
        };
        //create instance of render
        var renderer = TestUtils.createRenderer();
        //render an image component
        // <Lists title={this.props.title} cards={this.props.cards}
        //   onClick={this.onAddSubmit} onChange={this.onAddInputChanged}
        //   id={this.props.id} board={this.props.board}/>
        renderer.render(<List.ListContainer title={listItem.title} cards={listItem.cards}
          id={listItem._id} boardId={listItem.boardId}/>);
        //get the rendered react component to test against
        var result = renderer.getRenderOutput();
        //test props for various values
        //check class name is correct
        result.type.should.shallowDeepEqual(List.Lists);
        //get list prop
        var resultListItem = result.props;
        //check title is correct
        resultListItem.title.should.equal(listItem.title);
        //check cards match
        resultListItem.cards[1].text.should.equal(listItem.cards[1].text);
        resultListItem.cards[2].text.should.equal(listItem.cards[2].text);
        resultListItem.boardId.should.equal(listItem.boardId);
        resultListItem.id.should.equal(listItem._id);
    });
});
