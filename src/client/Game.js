import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spinner } from 'evergreen-ui';
import Timer from './Timer';
import './game.css';

const NUM_BACKGROUNDS = 6;

class Game extends Component {
  state = {
    background: null,
    backgroundHistory: new Set(),
  }

  componentDidMount() {
    this.setNextBackgroundNumber();
  }

  // This function will randomly select a theme for each question, but will also
  // ensure that all 5 themes are used before the same theme is selected again.
  setNextBackgroundNumber() {
    const { backgroundHistory } = this.state;
    const allOptions = [0, 1, 2, 3, 4, 5];
    let currentOptions = allOptions.filter(o => (
      backgroundHistory.has(o)
    ));

    // Already used all options, so reset the history.
    if (currentOptions.length === 0) {
      currentOptions = allOptions;
      backgroundHistory.clear();
    }

    // Random number out of available numbers.
    const randomIndex = Math.floor(Math.random() * Math.floor(currentOptions.length));
    const bgNum = currentOptions[randomIndex];

    backgroundHistory.add(bgNum);

    this.setState({
      background: bgNum,
      backgroundHistory,
    });
  }

  submitGuess(guess) {
    console.log(guess);
    const { makeGuess } = this.props;
    makeGuess(guess);
  }

  navigateHome() {
    // Go to game page.
    const { history } = this.props;
    history.push('/');
  }

  renderNotJoined() {
    const { background } = this.state;
    return (
      <div className={`game-background game-background-5 game-background-${background}`}>
        <div className="game-msg-text">
          Failed to join :(
        </div>
        <div className="game-button-container">
          <div className="game-button game-button-5" onClick={() => this.navigateHome()}>
            <div className="game-button-text">Try again?</div>
          </div>
        </div>
      </div>
    );
  }

  renderWaitingToStart() {
    const { background } = this.state;

    return (
      <div className={`game-background game-background-5 game-background-${background}`}>
        <div className="game-msg-text">
          You're in!
        </div>
        <div className="game-msg-small-text game-msg-text-small">
          Waiting for game to start...
        </div>
        <Spinner size={24} />
      </div>
    );
  }

  renderGameView() {
    const { background } = this.state;
    const {
      question,
      time,
    } = this.props;

    return (
      <div className={`game-background game-background-5 game-background-${background}`}>
        <div className="game-block game-guess-buttons">
          <div className="game-button game-guess-button game-button-5" onClick={() => this.submitGuess('hers')}>
            <div className="game-button-text game-guess-button-text">Steph</div>
          </div>
          <div className="game-button game-guess-button game-button-5" onClick={() => this.submitGuess('his')}>
            <div className="game-button-text game-guess-button-text">Dustin</div>
          </div>
        </div>
        <div className="game-question-text game-question-text-5">
          {question}
        </div>
        <div className="game-block game-hud">
          <div className="game-msg-text game-score">
            Score: 1
          </div>
          <div className="game-block game-timer">
            <Timer time={time} />
          </div>
          <div className="game-msg-text game-qnumber">
            <span>1</span>
            <span className="game-qdenominator"> / 12</span>
          </div>
        </div>
      </div>
    );

    // return (
    //   <div>
    //     <div>
    //       {question}
    //     </div>
    //     <div>
    //       Time left: {time}
    //     </div>
    //     <div>
    //       <Button onClick={() => this.submitGuess('his')}>
    //         His
    //       </Button>
    //       <Button onClick={() => this.submitGuess('hers')}>
    //         Hers
    //       </Button>
    //     </div>
    //   </div>
    // );
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

  renderScoresView() {
    const {
      scores,
    } = this.props;

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

  render() {
    const {
      joined,
      question,
      answer,
      scores,
    } = this.props;

    if (scores) {
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

    // User must now answer question!
    // TODO: uncomment if statement!
    // if (answer === null) {
      return this.renderGameView();
    // }

    // Display results with answer.
    return this.renderAnswerView();
  }
}

export default withRouter(Game);
