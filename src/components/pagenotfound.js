import React from 'react';
import { Link } from 'react-router';

export default class PageNotFound extends React.Component {
  render() {
    return (
      <div>
        <h2>404 error</h2>
        <h4>Page not found!</h4>
        <p>
          <Link to="/">Go back to the main page</Link>
        </p>
      </div>
    );
  }
}
