import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Spinner } from 'evergreen-ui';
import { useRecoilValue } from 'recoil';
import Timer from './Timer';
import Scoreboard from './Scoreboard';
import { gameState } from './GameState';
import './game.css';

const NUM_BACKGROUNDS = 6;

class Game extends Component {
  submitGuess(guess) {
    const { makeGuess } = this.props;
    const { name } = useRecoilValue(gameState);
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
      hersButtonClasses.push('game-guess-button-incorrect');
    } else if (answer === 'hers') {
      hisButtonClasses.push('game-guess-button-incorrect');
      hersButtonClasses.push('game-guess-button-correct');
    }

    if (guess === 'his') {
      hisButtonClasses.push('game-guess-button-active');
    } else if (guess === 'hers') {
      hersButtonClasses.push('game-guess-button-active');
    }

    return [hisButtonClasses.join(' '), hersButtonClasses.join(' ')];
  }

  // renderNotJoined() {
  //   const { theme } = this.props;

  //   return (
  //     <div className={`game-background theme-bg-${theme}`}>
  //       <div className="game-msg-text">
  //         Failed to join :(
  //       </div>
  //       <div className="game-button-container">
  //         <div className={`game-button theme-alt-${theme}`} onClick={() => this._navigateHome()}>
  //           <div className="game-button-text">Try again?</div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  renderWaitingToStart() {
    const { theme } = useRecoilValue(gameState);

    return (
      <div className={`game-background theme-bg-${theme}`}>
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
    } = useRecoilValue(gameState);


    const [hisButtonClasses, hersButtonClasses] = this._getGuessButtonClasses(guess, answer);

    return (
      <div className={`game-background theme-bg-${theme}`}>
        <div className="game-block game-guess-buttons">
          <div className={`game-button game-guess-button theme-alt-${theme} ${hersButtonClasses}`} onClick={() => this.submitGuess('hers')}>
            <img className="game-face game-face-hers" src={require('./img/her-faces-lowtrace.png')} />
          </div>
          <div className={`game-button game-button-center game-guess-button theme-alt-${theme} ${hisButtonClasses}`} onClick={() => this.submitGuess('his')}>
            <img className="game-face game-face-his" src={require('./img/his-faces-lowtrace.png')} />
          </div>
        </div>
        <div className={`game-question-text theme-font-${theme} game-question-text-${theme}`}>
          {question}
        </div>
        <div className="game-block game-hud">
          <div className="game-msg-text game-score">
            Score: {score}
          </div>
          <div className="game-block game-timer">
            <Timer
              time={time}
              correct={answer !== null && guess === answer}
              wrong={answer !== null && guess !== answer}
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
    const {
      topScores,
      finalScore,
      theme
    } = useRecoilValue(gameState);

    return (
      <div className={`game-background theme-bg-${theme}`}>
        <div className="game-block game-scorefaces">
          {/* <img className="game-face-hers-sm" src={require('./img/her-faces-lowtrace.png')} /> */}
          <img className="game-face-tego-sm" src={require('./img/tego-faces-lowtrace.png')} />
          <div className={`game-thanks-text theme-font-${theme} game-question-text-${theme}`}>
            Thanks for playing!
          </div>
          <img className="game-face-tego-sm" src={require('./img/tego-faces-lowtrace.png')} />
          {/* <img className="game-face-his-sm" src={require('./img/his-faces-lowtrace.png')} /> */}
        </div>
        <div className="game-block game-scoreboard-text">
          Top Scores
        </div>
        <div className="game-block game-scoreboard">
          <Scoreboard
            scores={topScores}
            // scores={[
            //   {
            //     id: '12345',
            //     rank: 1,
            //     name: 'Jess',
            //     score: '10',
            //   },
            //   {
            //     id: '12346',
            //     rank: 2,
            //     name: 'Dane Nespoli',
            //     score: '7',
            //   },
            //   {
            //     id: '12347',
            //     rank: 3,
            //     name: 'Myla Boneses Bognar',
            //     score: '5',
            //   },
            //   {
            //     id: '12348',
            //     rank: 4,
            //     name: 'Alice',
            //     score: '3',
            //   },
            //   {
            //     id: '12349',
            //     rank: 5,
            //     name: 'Bob',
            //     score: '2',
            //   },
            // ]}
          />
        </div>
        <div className="game-block game-scoreboard-text game-scoreboard-text-small">
          Your Score
        </div>
        <div className="game-block game-scoreboard">
          <Scoreboard
            scores={[finalScore]}
            // scores={[
            //   {
            //     id: 0,
            //     name,
            //     score,
            //   },
            // ]}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      joined,
      question,
      answer,
      topScores,
      finalScore,
    } = useRecoilValue(gameState);

    if (topScores && finalScore) {
      return this.renderScoresView();
    }

    // Failed to join.
    if (!joined) {
      this._navigateHome();
    }

    // Waiting to start game.
    if (question === null) {
      return this.renderWaitingToStart();
    }

    // Main question/answer view.
    return this.renderGameView();
  }
}

export default withRouter(Game);
