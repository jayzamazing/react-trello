var React = require('react');
// var router = require('react-router');
// var hashHistory = router.hashHistory;
var NavBarContainer = React.createClass({
  render: function() {
    return (
      <nav className="navBar">
        //TODO
      </nav>
    );
  }
});
var NavBar = React.createClass({
  render: function() {
    return (
      <section>
        <NavBarContainer />
        {this.props.children}
      </section>
    );
  }
});
module.exports = NavBar;
