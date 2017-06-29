import React from 'react';
import browserHistory from 'react-router';

export default class NavBar2 extends React.Component {
  showBoards() {
    browserHistory.push('/boards');
  }
  render() {
    <section>
      <nav className="navBar">
        <input type="button" onClick={this.showBoards} value="&#xf181; Boards"/>
      </nav>
    </section>
  }
}
