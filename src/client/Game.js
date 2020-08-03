import React, { Component } from 'react';
import './home.css';
import { Button } from 'evergreen-ui';

export default class Game extends Component {
  submitGuess(guess) {
    console.log(guess);
    const { makeGuess } = this.props;
    makeGuess(guess);
  }

  renderNotJoined() {
    return (
      <div>
        Failed to join :( try again.
      </div>
    );
  }

  renderWaitingToStart() {
    return (
      <div>
        Waiting for the game to start...
      </div>
    );
  }

  renderGameView() {
    const {
      question,
      time,
    } = this.props;

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

  renderAnswerView() {
    const {
      question,
      answer,
      time,
    } = this.props;

    return (
      <div>Answer is: {answer}</div>
    );
  }


  render() {
    const {
      joined,
      question,
      answer,
      time,
      scores,
    } = this.props;

    if (scores) {
      const scoreList = scores.topScores.map(s => (
        <div>
          {s.name}  {s.score}
        </div>
      ));

      return (
        <div>
          <div>
            Your score: {scores.ownScore.score}
          </div>
          {scoreList}
        </div>
      );
    }

    // Failed to join.
    // TODO: simply show the game but don't allow the user to play.
    if (!joined) {
      return this.renderNotJoined();
    }

    // Waiting to start game.
    if (question === null) {
      return this.renderWaitingToStart();
    }

    // User must now answer question!
    if (answer === null) {
      return this.renderGameView();
    }

    // Display results with answer.
    return this.renderAnswerView();
  }
}
