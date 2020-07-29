import React, { Component } from 'react';
import './dashboard.css';
import { Button } from 'evergreen-ui';

export default class Dashboard extends Component {
  state = { };

  startGame() {
    // TODO: start game with API call.
  }

  render() {
    return (
      <div>
        <Button onClick={this.startGame}>
          Start Game!
        </Button>
      </div>
    );
  }
}
