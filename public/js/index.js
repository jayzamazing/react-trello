var React = require('react');
var ReactDOM = require('react-dom');
var Board = require('./board')
//render the data onto div with id app
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Board />, document.getElementById('app'));
});
