import React, { Component } from 'react';
import './dashboard.css';

export default class Home extends Component {
  state = { username: null };

  render() {
    const { username } = this.state;
    return (
      <div>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
      </div>
    );
  }
}
