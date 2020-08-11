import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spinner } from 'evergreen-ui';
import Timer from './Timer';
import './game.css';

const NUM_BACKGROUNDS = 6;

class Game extends Component {
  submitGuess(guess) {
    const { makeGuess, name } = this.props;
    makeGuess(guess, name);
  }

  _navigateHome() {
    // Go to game page.
    const { history } = this.props;
    history.push('/');
  }

  _getGuessButtonClasses(guess, answer) {
    const hisButtonClasses = [];
    const hersButtonClasses = [];

    if (answer === 'his') {
      hisButtonClasses.push('game-guess-button-correct');
      hersButtonClasses.push('game-guess-button-wrong');
    } else if (answer === 'hers') {
      hisButtonClasses.push('game-guess-button-wrong');
      hersButtonClasses.push('game-guess-button-correct');
    }

    if (guess === 'his') {
      hisButtonClasses.push('game-guess-button-active');
    } else if (guess === 'hers') {
      hersButtonClasses.push('game-guess-button-active');
    }

    return [hisButtonClasses, hersButtonClasses];
  }

  renderNotJoined() {
    const { theme } = this.props;

    return (
      <div className={`game-background game-background-${theme}`}>
        <div className="game-msg-text">
          Failed to join :(
        </div>
        <div className="game-button-container">
          <div className={`game-button game-button-${theme}`} onClick={() => this._navigateHome()}>
            <div className="game-button-text">Try again?</div>
          </div>
        </div>
      </div>
    );
  }

  renderWaitingToStart() {
    const { theme } = this.props;

    return (
      <div className={`game-background game-background-${theme}`}>
        <div className="game-msg-text">
          You're in!
        </div>
        <div className="game-msg-small-text game-msg-text-small">
          The game will be starting shortly...
        </div>
        <Spinner size={24} />
      </div>
    );
  }

  renderGameView() {
    const {
      question,
      answer,
      time,
      guess,
      score,
      questionNum,
      questionTotal,
      theme,
    } = this.props;


    const [hisButtonClasses, hersButtonClasses] = this._getGuessButtonClasses(guess, answer);

    return (
      <div className={`game-background game-background-${theme}`}>
        <div className="game-block game-correct-text">
          {(guess === answer && guess !== null) ? 'Correct!' : ''}
        </div>
        <div className="game-block game-guess-buttons">
          <div className={`game-button game-guess-button game-button-${theme} ${hersButtonClasses.join(' ')}`} onClick={() => this.submitGuess('hers')}>
            <div className="game-button-text game-guess-button-text">Steph</div>
          </div>
          <div className={`game-button game-guess-button game-button-${theme} ${hisButtonClasses.join(' ')}`} onClick={() => this.submitGuess('his')}>
            <div className="game-button-text game-guess-button-text">Dustin</div>
          </div>
        </div>
        <div className={`game-question-text game-question-text-${theme}`}>
          {question}
        </div>
        <div className="game-block game-hud">
          <div className="game-msg-text game-score">
            Score: {score}
          </div>
          <div className="game-block game-timer">
            <Timer
              time={time}
              theme={theme}
            />
          </div>
          <div className="game-msg-text game-qnumber">
            <span>{questionNum}</span>
            <span className="game-qdenominator"> / {questionTotal}</span>
          </div>
        </div>
      </div>
    );
  }

  renderScoresView() {
    return (
      <div className={`game-background game-background-${theme}`}>
        <Scoreboard
          scores={[
            {
              id: '12345',
              name: 'Jess',
              score: '10',
            },
            {
              id: '12346',
              name: 'Dane',
              score: '7',
            },
            {
              id: '12347',
              name: 'Myla',
              score: '5',
            },
          ]}
        />
      </div>
    );
  }

  render() {
    const {
      joined,
      question,
      answer,
      topScores,
    } = this.props;

    // TODO: remove this line!
    return this.renderScoresView();

    if (topScores) {
      return this.renderScoresView();
    }

    // Failed to join.
    // TODO: simply show the game but don't allow the user to play.
    // TODO: uncomment
    // if (!joined) {
    //   return this.renderNotJoined();
    // }

    // Waiting to start game.
    if (question === null) {
      return this.renderWaitingToStart();
    }

    // Main question/answer view.
    return this.renderGameView();
  }
}

export default withRouter(Game);
