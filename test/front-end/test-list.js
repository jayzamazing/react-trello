var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var should = chai.should();

var List = require('../../../public/js/list');

describe('List component', function() {
    it('Renders the list item', function() {
        var listItem = {
            title: 'something',
            cards: [
                {
                    text: 'ummmm'
                }, {
                    text: 'food'
                }
            ]
        };
        //create instance of render
        var renderer = TestUtils.createRenderer();
        //render an image component
        renderer.render(<List.ListContainer title={listItem.title} cards={listItem.cards}/>);
        //get the rendered react component to test against
        var result = renderer.getRenderOutput();
        //test props for various values
        //check class name is correct
        result.type.should.shallowDeepEqual(List.Lists);
        //get list prop
        var listItem = result.props;
        //check title is correct
        listItem.title.should.equal(listItem.title);
        //check cards match
        listItem.cards[0].text.should.equal(listItem.cards[0].text);
        listItem.cards[1].text.should.equal(listItem.cards[1].text);
    });
});
