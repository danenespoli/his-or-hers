import React, { Component } from 'react';
import './dashboard.css';
import { Button } from 'evergreen-ui';
import axios from 'axios';

export default class Dashboard extends Component {
  state = { };

  startGame() {
    console.log('POST /api/startGame');
    axios.post('/api/startGame');
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
