import React, { Component } from 'react';
import './dashboard.css';
import { Button } from 'evergreen-ui';
import axios from 'axios';

export default class Dashboard extends Component {
  state = {
    gameState: null,
  };

  constructor() {
    super();
    this.updateGameState();
  }

  updateGameState() {
    axios.get('/api/gameState').then(({ data }) => {
      console.log(data);
      this.setState({
        gameState: data,
      });
    });
  }

  startGame() {
    axios.post('/api/startGame');
    this.updateGameState();
  }

  endGame() {
    axios.post('/api/endGame');
    this.updateGameState();
  }

  editQuestion(index, newQuestion, newAnswer) {

  }

  render() {
    const { gameState } = this.state;
    if (gameState === null) {
      return (
        <div>Loading...</div>
      );
    }

    if (gameState.started) {
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
