import React, { Component } from 'react';
import './home.css';
import { Button } from 'evergreen-ui';

export default class Game extends Component {
  submitGuess(guess) {
    console.log(guess);
    const { makeGuess } = this.props;
    makeGuess(guess);
  }

  render() {
    const {
      joined,
      question,
      answer,
      time
    } = this.props;

    // Failed to join.
    if (!joined) {
      return (
        <div>
          Failed to join :( try again.
        </div>
      );
    }

    // Waiting to start game.
    if (question === null) {
      return (
        <div>
          Waiting for the game to start...
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
      <div>Answer is: {answer}</div>
    );
  }
}
