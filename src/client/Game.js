import React, { Component } from 'react';
import './home.css';
import { Button } from 'evergreen-ui';
import socket from './socket';

export default class Game extends Component {
  state = {
    question: null,
    timeLeft: 30,
  };

  constructor() {
    super();

    socket.on('question', ({ question }) => {
      console.log(question);
      this.setState({
        question,
      });
    });
  }

  submitGuess(guess) {
    console.log(guess);
  }

  render() {
    const { question, timeLeft } = this.state;

    if (question === null) {
      return (
        <div>
          <div>
            Waiting for the game to start...
          </div>
        </div>
      );
    }

    return (
      <div>
        <div>
          {question}
        </div>
        <div>
          Time left: {timeLeft}
        </div>
        <div>
          <Button onClick={() => this.submitGuess('his')}>
            His
          </Button>
          <Button onClick={() => this.submitGuess('hers')}>
            Hers
          </Button>
        </div>
      </div>
    );
  }
}
