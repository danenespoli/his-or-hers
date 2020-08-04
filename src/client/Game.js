import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spinner } from 'evergreen-ui';
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

export default withRouter(Game);
