import React, { Component } from 'react';
import './home.css';
import { Button } from 'evergreen-ui';
import socket from './socket';

export default class Game extends Component {
  state = {
    question: 'There is currently no question!',
    timeLeft: 30,
  };

  submitGuess(guess) {
    console.log(guess);
  }

  render() {
    const { question, timeLeft } = this.state;

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
