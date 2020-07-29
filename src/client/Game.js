import React, { Component } from 'react';
import './home.css';
import { Button } from 'evergreen-ui';
import socket from './socket';

export default class Game extends Component {
  state = {
    question: null,
    answer: null,
    time: 30,
  };

  constructor() {
    super();

    socket.on('question', (question) => {
      console.log(question);
      this.setState({
        question,
      });
    });

    socket.on('timer', (time) => {
      console.log(time);
      this.setState({
        time,
      });
    });
  }

  submitGuess(guess) {
    console.log(guess);
  }

  render() {
    const { question, answer, time } = this.state;

    // Waiting to start game.
    if (question === null) {
      return (
        <div>
          <div>
            Waiting for the game to start...
          </div>
        </div>
      );
    }

    // User must now answer question!
    if (answer === null) {
      return (
        <div>
          <div>
            {question}
          </div>
          <div>
            Time left: {time}
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

    // Display results with answer.
    return (
      <div></div>
    );
  }
}
