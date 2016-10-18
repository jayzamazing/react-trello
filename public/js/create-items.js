var React = require('react');
var connect = require('react-redux').connect;

var CreateItems = React.createClass({
  //ignore form submit and use button
  handleSubmit: function(event) {
    event.preventDefault();
  },
  render: function() {
    return (
      <form className="list-form" onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.props.onAddInputChanged}/>
        <input type="button" value="Submit" onClick={this.props.addItems}/>
      </form>
    );
  }
});
var Container = connect()(CreateItems);
module.exports = {
  Container,
  CreateItems
};
