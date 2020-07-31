import React, { Component } from 'react';
import './dashboard.css';
import { Button } from 'evergreen-ui';
import axios from 'axios';

export default class Dashboard extends Component {
  startGame() {
    axios.post('/api/startGame');
  }

  endGame() {
    axios.post('/api/endGame');
  }

  editQuestion(index, newQuestion, newAnswer) {

  }

  render() {
    const { started } = this.props;

    if (started) {
      return (
        <div>
          <Button onClick={() => this.endGame()}>
            End Game
          </Button>
        </div>
      );
    }

    // Before the game starts.
    return (
      <div>
        <Button onClick={() => this.startGame()}>
          Start Game!
        </Button>
        <Button onClick={() => this.editQuestion()}>
          Edit Questions
        </Button>
      </div>
    );
  }
}
