import React, { Component } from 'react';
import './dashboard.css';
import { Button } from 'evergreen-ui';
import axios from 'axios';

export default class Dashboard extends Component {
  startGame() {
    axios.post('/api/startGame');
  }

  nextQuestion() {
    axios.post('/api/nextQuestion');
  }

  endGame() {
    axios.post('/api/endGame');
  }

  editQuestions(index, newQuestion, newAnswer) {
    axios.post('/api/editQuestions', [
      {
        question: 'Who did blah blah first?',
        answer: 'hers',
      },
    ]);
  }

  render() {
    const { question } = this.props;

    // If the game has started, show End Game options.
    if (question !== null) {
      return (
        <div>
          <Button onClick={() => this.endGame()}>
            End Game
          </Button>
          <Button onClick={() => this.nextQuestion()}>
            Next Question
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
        <Button onClick={() => this.editQuestions()}>
          Edit Questions
        </Button>
      </div>
    );
  }
}
